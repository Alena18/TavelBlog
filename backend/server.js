const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import and mount your routes
const loginRoutes = require("./routes/login");
app.use("/api", loginRoutes);

const journeyPlanRoutes = require("./routes/plans");
app.use("/api/plans", journeyPlanRoutes);

const travelLogRoutes = require("./routes/travelLog");
app.use("/api/travel-log", travelLogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
