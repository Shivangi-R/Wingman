import React from "react";
import EmojiPicker from "emoji-picker-react";

const Emojis = ({ pickEmoji }) => {
  return (
    <>
      <EmojiPicker onEmojiClick={pickEmoji} />
    </>
  );
};


export default Emojis;