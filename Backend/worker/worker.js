const redis = require('../lib/redis');
const supabase = require('../lib/supabase');
const handleJob = require('./handlers');

async function pollAndProcessJobs() {
  const now = Date.now();
  const jobIds = await redis.zRangeByScore('jobs:queue', 0, now);

  for (const id of jobIds) {
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !job || job.status !== 'pending') {
      await redis.zRem('jobs:queue', id);
      continue;
    }

    await supabase.from('jobs').update({
      status: 'in_progress'
    }).eq('id', id);

    try {
      await handleJob(job);

      await supabase.from('jobs').update({
        status: 'completed',
        completed_at: new Date().toISOString()
      }).eq('id', id);
    } catch (err) {
      const retries = job.retries + 1;
      if (retries < job.max_retries) {
        const retryDelay = 5 * 60 * 1000;
        const retryAt = Date.now() + retryDelay;

        await supabase.from('jobs').update({
          retries,
          status: 'pending',
          scheduled_at: new Date(retryAt).toISOString()
        }).eq('id', id);

        await redis.zAdd('jobs:queue', [{
          score: retryAt,
          value: id
        }]);
      } else {
        await supabase.from('jobs').update({
          status: 'failed',
          failed_reason: err.message
        }).eq('id', id);
      }
    }

    await redis.zRem('jobs:queue', id);
  }
}

setInterval(pollAndProcessJobs, 5000);
console.log('👷 Worker running every 5s...');