const supabase = require("../lib/supabase");
const redis = require("../lib/redis");
const { v4: uuidv4 } = require("uuid");

// Create job - POST Request
async function createJob(req, res) {
  try {
    const {
      type,
      payload,
      priority = 0,
      max_retries = 3,
      scheduled_at,
    } = req.body;

    if (!type || !payload) {
      return res
        .status(400)
        .json({ error: 'Job "type" and "payload" are required.' });
    }

    const id = uuidv4();

    // ✅ Calculate scheduled time (default: now)
    let scheduleTime = new Date(scheduled_at || Date.now());
    if (scheduleTime.getTime() < Date.now()) {
      scheduleTime = new Date(); // shift to now if time is in the past
    }

    // ✅ Insert into Supabase
    const { data, error } = await supabase.from("jobs").insert([
      {
        id,
        type,
        payload,
        priority,
        max_retries,
        scheduled_at: scheduleTime.toISOString(),
      },
    ]);

    if (error) {
      console.error("❌ Supabase Insert Error:", error.message);
      return res
        .status(500)
        .json({ error: "Failed to create job in database." });
    }

    // ✅ Add to Redis queue
    await redis.zAdd("jobs:queue", [
      {
        score: scheduleTime.getTime(), // UNIX ms timestamp
        value: id,
      },
    ]);

    // ✅ Return created job
    res
      .status(201)
      .json({ id, type, payload, scheduled_at: scheduleTime.toISOString() });
  } catch (err) {
    console.error("❌ Job Creation Error:", err.message);
    res.status(500).json({ error: "Server error while creating job." });
  }
}
// Get job by ID - GET Request
async function getJobByID(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();
  console.log(data);
  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.status(200).json({
    data: data,
    message: "Job Fetched Successfully!",
  });
}
// GET all jobs
async function getAllJobs(req, res) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Failed to fetch jobs:', error.message);
      return res.status(500).json({ error: 'Error fetching jobs' });
    }

    res.json(data);
  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: 'Server error while fetching jobs' });
  }
}
// Cancel job by ID
async function cancelJobByID(req, res) {
  const { id } = req.params;

  try {
    // 1. Check current status
    const { data: job, error } = await supabase
      .from('jobs')
      .select('status')
      .eq('id', id)
      .single();

    if (error || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending jobs can be cancelled' });
    }

    // 2. Update job status
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to cancel job' });
    }

    // 3. Remove from Redis queue (optional safety)
    await redis.zRem('jobs:queue', id);

    res.json({ message: 'Job cancelled successfully', id });

  } catch (err) {
    console.error('❌ Cancel error:', err.message);
    res.status(500).json({ error: 'Server error while cancelling job' });
  }
}
module.exports = {
  createJob,
  getAllJobs,
  getJobByID,
  cancelJobByID,
};
