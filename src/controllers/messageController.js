const { sendMessage, getMessages } = require("../services/messageService");

exports.sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { text} = req.body;
    let files = [];
    // Get file URLs from upload middleware
    if (req.body.fileUrls && req.body.fileUrls.length > 0) {
      files = req.body.fileUrls;
    }

    let sender = req.body.sender;

    if(typeof sender === 'string'){
      sender = JSON.parse(sender);
    }


    if (!text && files.length === 0)
      return res.status(400).json({ error: "Missing text or files" });
    if (!sender) return res.status(400).json({ error: "Missing sender" });

    const message = await sendMessage(roomId, { text, sender, files });
    req.io.to(roomId).emit("chat-message", message);

    res.json({ message });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit } = req.query;
    const messages = await getMessages(roomId, Number(limit) || 50);
    res.json({ messages });
  } catch (err) {
    console.error("Error getting messages:", err);
    res.status(500).json({ error: err.message });
  }
};
