const express = require("express");
const { allMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middlewear/authMiddlewear");

const router = express.Router();

 router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;