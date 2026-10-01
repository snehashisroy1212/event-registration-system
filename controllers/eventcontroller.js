const Event = require("../models/Event");

// @route GET /api/events
// @desc  List all events (with optional search/pagination)
exports.getEvents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const events = await Event.find(query)
      .populate("organizer", "name email")
      .populate("registrationCount")
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Event.countDocuments(query);

    res.json({ total, page: Number(page), events });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/events/:id
// @desc  Single event details
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("registrationCount");

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/events  (organizer only)
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, capacity } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      organizer: req.user._id,
    });

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/events/:id  (organizer only, owner)
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your event" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json(event);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/events/:id  (organizer only, owner)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
};