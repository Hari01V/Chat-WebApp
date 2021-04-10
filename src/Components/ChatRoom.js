import React, { useState, useContext, useRef, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import SendRoundedIcon from '@material-ui/icons/SendRounded';

import Firebase from 'firebase/app';

import { FirebaseContext } from './Firebase/context';
import '../styles/ChatRoom.css';
import ChatMsgContainer from './ChatMsgContainer';

import { fbConst } from '../helpers';

function ChatRoom(props) {
  const { chatUser, chat } = props;
  const { firebase } = useContext(FirebaseContext);

  const getOurMessages = async () => {
    let tmpmessages = [];
    fbConst.currChat = chat;
    await firebase.firestore.collection('Chats').doc(chat.docId).collection('messages')
      .orderBy("sentAt").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tmpmessages.push({
            id: doc.id,
            data: doc.data().data,
            sender: doc.data().sender
          });
        });
      });
    window.localStorage.setItem(`${chat.docId}`, JSON.stringify({ msgs: tmpmessages }));
  }

  const getLocalMsg = () => {
    const localMsg = JSON.parse(window.localStorage.getItem(`${chat.docId}`));
    return localMsg ? localMsg.msgs : [];
  }

  let localMessages;
  if (fbConst.currChat != chat) {
    localMessages = JSON.parse(window.localStorage.getItem(`${chat.docId}`));
    if (localMessages) {
      fbConst.currChat = chat;
    } else {
      getOurMessages();
    }
  }

  const [formValue, setformValue] = useState('');
  const changeFormValue = (evt) => {
    setformValue(evt.target.value);
  }
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue.match(/^\s*$/)) {
      const { uid } = firebase.auth.currentUser;
      const messageRef = firebase.firestore.collection('Chats').doc(chat.docId).collection('messages');
      await messageRef.add({
        sender: uid,
        data: formValue,
        sentAt: Firebase.firestore.Timestamp.now()
      }).then((docRef) => {
        //UPDATE THE LOCALSTORAGE
        console.log("UPDATING LOCAL STORAGE!");
        const localMsg = JSON.parse(window.localStorage.getItem(`${chat.docId}`));
        localMsg.msgs.push({ data: formValue, sender: uid });
        window.localStorage.setItem(`${chat.docId}`, JSON.stringify({ msgs: localMsg.msgs }));
      }).catch((error) => {
        //RESEND THE MSG OR INTIMATE ERROR MSG!
        console.log("ERROR: MESSAGE COULD'NT BE SENT");
        console.log(error);
      });
    }
    setformValue('');
  }

  return (
    chatUser.uid ?
      (<div className="ChatRoom">
        <div className="ChatRoom-header">
          <div className="User-info">
            <img src={chatUser.picUrl} className="User-pic" />
            <h1 className="User-name">{chatUser.name}</h1>
          </div>
          <div className="options">
            <MoreVertIcon />
          </div>
        </div>
        <div className="ChatMsg-container">
          {chat ?
            <ChatMsgContainer localMessages={getLocalMsg()} />
            : <></>}
        </div>
        <form onSubmit={sendMessage} className="form-container">
          <input type="text" className="formInput"
            value={formValue} onChange={changeFormValue} placeholder="Type a message" />
          <button type="submit" className="sendBtn"><SendRoundedIcon fontSize="large" /></button>
        </form>
      </div>) :
      (<>
      </>)
  )
}

export default ChatRoom;