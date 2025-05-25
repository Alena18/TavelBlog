const express = require("express");
const router = express.Router();
const travelLogController = require("../controllers/travelLogController");

router.get("/", travelLogController.getAllLogs);
router.post("/", travelLogController.createLog);
router.put("/:id", travelLogController.updateLog);
router.delete("/:id", travelLogController.deleteLog);

module.exports = router;
