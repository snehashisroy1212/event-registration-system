const Registration = require("../models/Registration");
const Event = require("../models/Event");

// @route POST /api/registrations
// @desc  Register the logged-in user for an event
exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId, notes } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const count = await Registration.countDocuments({ event: eventId, status: "confirmed" });
    if (count >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    const registration = await Registration.create({
      event: eventId,
      user: req.user._id,
      notes,
    });

    res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already registered for this event" });
    }
    next(err);
  }
};

// @route GET /api/registrations/me
// @desc  Get logged-in user's registrations
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event", "title date location capacity")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/registrations/event/:eventId  (organizer only)
// @desc  See who registered for a specific event
exports.getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your event" });
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .populate("user", "name email");

    res.json(registrations);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/registrations/:id/cancel
// @desc  Cancel own registration
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: "Registration not found" });

    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your registration" });
    }

    registration.status = "cancelled";
    await registration.save();

    res.json({ message: "Registration cancelled", registration });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/registrations/:id
// @desc  Permanently remove own registration
exports.deleteRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: "Registration not found" });

    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your registration" });
    }

    await registration.deleteOne();
    res.json({ message: "Registration removed" });
  } catch (err) {
    next(err);
  }
};