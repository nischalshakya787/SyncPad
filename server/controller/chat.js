import ChatModel from "../model/Chat.js";

export const fetchChat = async (req, res) => {
  const docId = req.params.docId;
  try {
    // Find the chat document and populate the username for each sender in the message array
    const chat = await ChatModel.findOne({ docId }).populate({
      path: "message.senderId",
      select: "username", // Only include the username field from the User model
    });

    if (!chat) {
      return res.status(400).json({ message: "Chat does not exist" });
    }

    // Map over the messages to create the desired format which is:
    // {senderId, username,message,timestamp}
    const formattedMessages = chat.message.map((msg) => ({
      senderId: msg.senderId._id,
      username: msg.senderId.username, // Access the populated username
      message: msg.message,
      timestamp: msg.timestamp,
    }));

    return res.status(200).json({ chat: formattedMessages });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching chat", error: error.message });
  }
};
