// controllers/notificationController.js

const Notification = require('../models/Notification');
const User = require('../models/User');


// Get notifications for a user
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ date: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        console.log("User trying to mark a post as read:", req.params.id);

        if (!req.user || !req.user.id) {
            console.log('User ID from token is missing');
            return res.status(401).json({ message: 'User not authorized' });
        }

        console.log("User ID from token:", req.user.id);

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            console.log('Notification not found');
            return res.status(404).json({ message: 'Notification not found' });
        }

        console.log('Notification found:', notification);

        if (notification.user.toString() !== req.user.id.toString()) {
            console.log('Not authorized');
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();
        console.log('Notification marked as read successfully:', notification);
        res.json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getNotifications,
    markNotificationAsRead
};
