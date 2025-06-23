const express = require('express');
const router = express.Router();
const { createJob, getJobByID, cancelJobByID } = require("../controller/jobController");

// Health check route
router.get('/', (req, res) => {
  console.log('job api working');
  res.status(200).send('Job API working');
});

// Get job by id
router.get("/getJob/:id", getJobByID);

// Create job
router.post("/createJob", createJob);

// Cancel job by id
router.post("/cancelJob/:id", cancelJobByID);

// Exporting router
module.exports = router;
