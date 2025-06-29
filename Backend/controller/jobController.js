const supabase = require("../lib/supabase");
const redis = require('../lib/redis');
const { v4: uuidv4 } = require("uuid");

// Create job - POST Request
async function createJob(req, res) {
  const {
    type,
    payload,
    scheduled_at,
    priority = 0,
    max_retries = 3,
  } = req.body;
  const id = uuidv4();

  const { data, error } = await supabase.from("jobs").insert([
    {
      id,
      type,
      payload,
      scheduled_at: scheduled_at || new Date().toISOString(),
      priority,
      max_retries,
    },
  ]).select();

  if (error){
    return res.status(500).json({ error: error.message });
  }
  // Enqueue to Redis
  await redis.zAdd('jobs:queue', [{
    score: new Date(scheduled_at || Date.now()).getTime(),
    value: id
  }]);

  res.status(201).json({
    data: data[0],
    message: "Job Added Successfully!"
  });
}
// Get job by ID - GET Request
async function getJobByID(req, res) {
    const { id } = req.params;
    const { data , error } = await supabase.from("jobs").select("*").eq('id' , id).single();
    console.log(data)
    if ( error ){
        return res.status(404).json({ error: error.message });
    }
    res.status(200).json({
        data: data,
        message: "Job Fetched Successfully!"
    });
}
// Cancel job by ID 
async function cancelJobByID(req, res) {
    const { id } = req.params;
    const { data , error } = await supabase.from("jobs").update({ status: "cancelled" }).eq("id" , id).eq("status" , "pending").select().single();
    if ( error || !data ) return res.status(404).json({ error: "Job not found or already started!"});
    res.status(200).json({
        data: data,
        message: "Job Cancelled Successfully!"
    });
}
module.exports = {
  createJob,
  getJobByID,
  cancelJobByID,
};
