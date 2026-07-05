import eventModel from "../../models/PromotionManegment/event.model.js";
import { IncomingForm } from 'formidable';
import { upload } from '../../helpers/aws.helpers.js'
import { generateUniqueSlug } from '../../helpers/genrateSlug.helper.js'
// Create Event ::
export const addEvent = async (req, res) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const requiredFields = ["title", "description", "date", "location"];
        for (const field of requiredFields) {
            if (!fields[field] || fields[field][0].trim() === "") {
                return res.status(400).json({ success: false, message: `${field} is required.` });
            }
        }
        const title = fields.title?.[0]?.trim();
        const description = fields.description?.[0]?.trim();
        const location = fields.location?.[0]?.trim();
        const dateStr = fields.date?.[0]?.trim();
        let formattedDate;
        try {
            const [day, month, year] = dateStr.split("-");
            formattedDate = new Date(`${year}-${month}-${day}`);
            if (isNaN(formattedDate)) throw new Error("Invalid date format");
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid date format. Use DD-MM-YYYY.", });
        }
        files.image = files.thumbnail;
        if (!files.thumbnail) {
            return res.status(400).json({ success: false, message: "Thumbnail is required." });
        }
        try {
            const slug = await generateUniqueSlug(title, eventModel, "url");
            const thumbnailUrl = await upload(files);
            const newEvent = new eventModel({ title, description, location, date: formattedDate, url: slug, thumbnail: thumbnailUrl });
            const savedEvent = await newEvent.save();
            return res.status(201).json({ success: true, message: "Event added successfully.", data: savedEvent });
        } catch (err) {
            console.error("Add Event Error:", err);
            return res.status(500).json({ success: false, message: "Failed to create event.", error: err.message });
        }
    });
};
// Get All Event 
export const getAllEvents = async (req, res) => {
    try {
        const { role, type } = req.query;
        let filter = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (role === "user") {
            if (type === "upcoming") {
                filter.date = { $gte: today };
            } else if (type === "past") {
                filter.date = { $lt: today };
            }
        }
        const events = await eventModel.find(filter).sort({ date: 1 });
        const totalEvents = await eventModel.countDocuments();
        return res.status(200).json({ success: true, message: "Events fetched successfully.", totalEvents, count: events.length, data: events, });
    } catch (error) {
        console.error("Get All Events Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch events.", error: error.message, });
    }
};
// Get Single Event User And Admin both Of us :: 
export const getSingleEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Event ID or slug is required." });
        }
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        let event;
        if (isObjectId) {
            event = await eventModel.findById(id);
        } else {
            event = await eventModel.findOne({ url: id });
        }
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }
        return res.status(200).json({ success: true, message: "Event fetched successfully.", data: event });
    } catch (error) {
        console.error("Get Single Event Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch event.", error: error.message });
    }
};
// Update Event ::
export const updateEvent = async (req, res) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        try {
            const eventId = req.params.id;
            const event = await eventModel.findById(eventId);
            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found." });
            }
            if (fields.title) event.title = fields.title[0] || fields.title;
            if (fields.description) event.description = fields.description[0] || fields.description;
            if (fields.date) event.date = new Date(fields.date[0] || fields.date);
            if (fields.location) event.location = fields.location[0] || fields.location;
            if (files.thumbnail) {
                files.image = files.thumbnail;
                const thumbnailUrl = await upload(files);
                event.thumbnail = thumbnailUrl;
            }
            const updatedEvent = await event.save();
            return res.status(200).json({ success: true, message: "Event updated successfully.", data: updatedEvent });
        } catch (err) {
            console.error("Update Event Error:", err);
            return res.status(500).json({ success: false, message: "Failed to update event.", error: err.message });
        }
    });
};
// Delete Event ::
export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const deleted = await eventModel.findByIdAndDelete(eventId);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }
        return res.status(200).json({ success: true, message: "Event deleted successfully." });
    } catch (err) {
        console.error("Delete Event Error:", err);
        return res.status(500).json({ success: false, message: "Failed to delete event.", error: err.message });
    }
};
// Update Status Event :: 
export const updatedeventstatus = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, message: "Event ID and status are required." });
    }
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value. Must be 'active' or 'inactive'." });
    }
    try {
        const event = await eventModel.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }
        event.status = status;
        const updatedEvent = await event.save();
        return res.status(200).json({ success: true, message: " Event status updated successfully.", data: updatedEvent });
    } catch (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

