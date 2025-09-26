import { Connection } from "../models/connection.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { sendConnectionAcceptedEmail } from "../util/email.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (userId === req.user._id) {
      return res
        .status(401)
        .json({ message: "You can't send a request to yourself" });
    }

    if (req.user.connections.includes(userId)) {
      return res.status(400).json({ message: "You are already connection" });
    }

    const existingRequest = await Connection.findOne({
      sender: req.user._id,
      recipient: userId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    const connection = new Connection({
      sender: req.user._id,
      recipient: user._id,
    });

    await connection.save();

    return res.status(200).json(connection);
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const connectionRequest = await Connection.findById(requestId)
      .populate("sender", "fullname email username")
      .populate("recipient", "fullname email username");

    if (!connectionRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (connectionRequest.recipient._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this request" });
    }

    if (connectionRequest.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }

    connectionRequest.status = "accepted";
    await connectionRequest.save();

    await Promise.all([
      User.findByIdAndUpdate(connectionRequest.recipient._id, {
        $addToSet: { connections: connectionRequest.sender._id },
      }),
      User.findByIdAndUpdate(connectionRequest.sender._id, {
        $addToSet: { connections: connectionRequest.recipient._id },
      }),
    ]);

    const notification = new Notification({
      recipient: connectionRequest.sender._id,
      type: "connectionAccepted",
      relatedUser: userId,
    });

    const senderName = connectionRequest.sender.fullname;
    const senderEmail = connectionRequest.sender.email;
    const recipientName = connectionRequest.recipient.fullname;
    const profileUrl =
      process.env.CLIENT_URL +
      "/profile/" +
      connectionRequest.recipient.username;

    try {
      await sendConnectionAcceptedEmail(
        senderEmail,
        senderName,
        recipientName,
        profileUrl
      );
    } catch (error) {
      console.log("Error in sending acceptedConnection email", error.message);
    }
    return res.status(200).json({
      message: "Connection request accepted successfully",
      connectionRequest,
    });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await Connection.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request is already processed" });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({ message: "Connection request rejected" });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getConnectionRequest = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Connection.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "fullname username profilePic headline connections");

    return res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "connections",
      "fullname username headline profilePic connections"
    );

    return res.status(200).json(user.connections);
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targetedUserId = req.params.userId;
    const currUserId = req.user._id;

    const targetedUser = await User.findById(targetedUserId);
    if (!targetedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.connections.includes(targetedUserId)) {
      return res.json({ status: "connected" });
    }

    const pendingRequest = await Connection.findOne({
      $or: [
        { sender: currUserId, recipient: targetedUserId },
        { sender: targetedUserId, recipient: currUserId },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if ( pendingRequest.sender._id.toString() === currUserId.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({ status: "received", requestId: pendingRequest._id });
      }
    }

    return res.json({ status: "not-connected" });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.user.connections.includes(userId)) {
      return res.status(404).json({ message: "User not in your connection" });
    }

    await Promise.all([
      User.findByIdAndUpdate(req.user._id, { $pull: { connections: userId } }),
      User.findByIdAndUpdate(userId, { $pull: { connections: req.user._id } }),
    ]);

    return res.status(200).json({ message: "Connection removed successfully" });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
