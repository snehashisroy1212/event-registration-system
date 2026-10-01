const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
  deleteRegistration,
} = require("../controllers/registrationController");
const { protect, organizerOnly } = require("../middleware/auth");

router.post("/", protect, registerForEvent);
router.get("/me", protect, getMyRegistrations);
router.get("/event/:eventId", protect, organizerOnly, getEventRegistrations);
router.put("/:id/cancel", protect, cancelRegistration);
router.delete("/:id", protect, deleteRegistration);

module.exports = router;