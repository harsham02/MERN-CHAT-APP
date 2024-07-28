import React, { useEffect, useRef } from 'react';
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { ChatState } from "../../context/ChatProvider";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/ChatLogic";
import './Styles.css';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const messagesEndRef = useRef(null);

  // Ensure unique keys
  const uniqueMessages = messages.reduce((acc, message) => {
    if (!acc.find(msg => msg._id === message._id)) {
      acc.push(message);
    }
    return acc;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [uniqueMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="scrollable-chat-container">
      {uniqueMessages.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id}>
          {(isSameSender(uniqueMessages, m, i, user._id) || isLastMessage(uniqueMessages, i, user._id)) && m.sender && (
            <Tooltip label={m.sender.name || "Unknown"} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name || "Unknown"}
                src={m.sender.pic || ""}
              />
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: `${m.sender?._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
              marginLeft: isSameSenderMargin(uniqueMessages, m, i, user._id),
              marginTop: isSameUser(uniqueMessages, m, i) ? 3 : 10,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
            }}
          >
            {m.content}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ScrollableChat;
