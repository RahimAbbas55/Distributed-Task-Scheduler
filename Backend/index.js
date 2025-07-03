// Imports
const express = require('express');
const jobRoutes = require('./routes/jobRoutes');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();

// Allow requests from front-end
app.use(cors({
  origin: "http://localhost:3000", // frontend origin
  credentials: true
}));

// Configurations
require('dotenv').config();
app.use(cors());
app.use(express.json());

// Using the routes
app.get('/', (req, res) => res.send('API root working'));
app.use('/api/jobs' , jobRoutes)

// Listening to the server
app.listen(PORT , () => console.log(`Server running on port: ${PORT}`));