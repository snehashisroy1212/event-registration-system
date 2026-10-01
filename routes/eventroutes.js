const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, organizerOnly } = require("../middleware/auth");

router.get("/", getEvents);               // Public: list events
router.get("/:id", getEventById);         // Public: event details
router.post("/", protect, organizerOnly, createEvent);
router.put("/:id", protect, organizerOnly, updateEvent);
router.delete("/:id", protect, organizerOnly, deleteEvent);

module.exports = router;