const express = require('express');
const dotenv = require('dotenv');
const recommendationRoutes = require('./routes/recommendations');

dotenv.config();

const app = express();
app.use(express.json());

// Attach routes
app.use('/api/recommendations', recommendationRoutes);

// Start the server (Vercel will override the port in production)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
