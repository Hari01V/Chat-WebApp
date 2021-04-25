import React, { useEffect, useRef } from 'react';
import '../styles/ChatMsgContainer.css';
import ChatMsg from './ChatMsg';

function ChatMsgContainer(props) {
  const { localMessages, messages } = props;
  const dummy = useRef();

  useEffect(() => {
    console.log("COMPONENT CHATMSGCONTAINER DID UPDATE");
  }, []);

  // dummy.current.scrollIntoView({ behaviour: "smooth" });

  return (
    <main className="ChatMsgContainer">
      <div className="ChatMsgs">
        {/* {localMessages && localMessages.map(msg => <ChatMsg key={msg.id} message={msg.data} sender={msg.sender} />)} */}
        {messages && messages.map(msg => <ChatMsg key={msg.id} message={msg.data} sender={msg.sender} />)}
      </div>
      <div ref={dummy}></div>
    </main>
  )
}

export default ChatMsgContainer;