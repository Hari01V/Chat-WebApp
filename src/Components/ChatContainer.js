import '../styles/ChatContainer.css';

import "firebase/auth";
import "firebase/firestore";

import React, { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { FirebaseContext } from './Firebase/context';

import SignIn from './SignIn';
import ChatRoom from './ChatRoom';
import UserList from './UsersList';
import { fbConst } from '../helpers';

function ChatContainer() {
  const { firebase } = useContext(FirebaseContext);
  const [user, loading, error] = useAuthState(firebase.auth);
  const [chatUser, setChatUser] = useState({});

  let chat;
  const NewChat = async () => {
    if (fbConst.isCreatingChat) {
      return;
    } else {
      console.log("BEFORE CREATING");
      fbConst.isCreatingChat = true;
      await firebase.createNewchat(chatUser.uid);
      fbConst.isCreatingChat = false;
      //NEED TO RE-RENDER!!!

      console.log("AFTER CREATING");
    }
  }

  if (chatUser.uid || JSON.stringify(chatUser) !== "{}") {
    chat = firebase.myChats.find(chat => chat.otherUser === chatUser.uid);
    if (!chat) {
      console.log("CHAT NOT FOUND, NEED TO CREATE ONE!");
      NewChat();
    }
  }

  return (
    <div className="ChatContainer">
      <section className="Users-section">
        {user ? <UserList setChatUser={setChatUser} /> : <></>}
      </section>
      <section className="Chats-section">
        {user ? (chatUser.uid ?
          (chat ? <ChatRoom chatUser={chatUser} chat={chat} /> : <></>)
          : <div className="emptyChatSection"></div>)
          : <SignIn />}
      </section>
    </div>
  );
}

export default ChatContainer;
