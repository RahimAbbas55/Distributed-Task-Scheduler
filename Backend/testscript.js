const redis = require('./lib/redis');

async function test() {
  await redis.set('test_key', 'hello world');
  const value = await redis.get('test_key');
  console.log('Redis Test Value:', value); // should print 'hello world'
}

test();
