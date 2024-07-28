// ChatLogic.jsx
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (!messages || !m || !m.sender || !userId) return "auto";

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender?._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender?._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  if (!messages || !m || !m.sender || !userId) return false;

  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender?._id !== m.sender._id ||
      messages[i + 1].sender?._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  if (!messages || !userId) return false;

  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender?._id !== userId &&
    messages[messages.length - 1].sender?._id
  );
};

export const isSameUser = (messages, m, i) => {
  if (!messages || !m || !m.sender) return false;

  return i > 0 && messages[i - 1].sender?._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) return "Unknown User";

  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) return null;

  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
