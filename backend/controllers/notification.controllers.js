import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient : req.user._id })
                                            .sort({ createdAt : -1 })
                                            .populate("relatedUser", "fullname username profilePic headline")
                                            .populate("relatedPost", "content image")

    return res.status(200).json(notifications)
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    let notification = await Notification.findById(id);

    if(!notification) {
      return res.status(401).json({ message : "notification not found"})
    }

    if(notification.recipient._id.toString() === req.user._id.toString() ) {
      notification = await Notification.findByIdAndUpdate(id, { $set : { read : true }}, { new : true })
    }

    return res.status(200).json({ message : "Notification Read", notification})
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if(!notification) {
      return res.status(401).json({ message : "Notification not found"})
    }

    if(notification.recipient._id.toString() === req.user._id.toString() ) {
      await Notification.findByIdAndDelete(id);
    }
    return res.status(200).json({ message : "Notification deleted"})
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
