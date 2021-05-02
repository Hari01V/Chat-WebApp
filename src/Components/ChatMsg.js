import React, { useContext } from 'react';
import { FirebaseContext } from './Firebase/context';

import Firebase from 'firebase/app';

import '../styles/ChatMsg.css';

function ChatMsg(props) {
  const { firebase } = useContext(FirebaseContext);

  const { message } = props;
  const { data, sender, sentAt } = message;
  const msgClass = sender === firebase.auth.currentUser.uid ? 'sent' : 'recieved';

  // console.log(Firebase.firestore.Timestamp.now().toDate().getHours());
  // console.log(Firebase.firestore.Timestamp.now().toDate().getMinutes());
  // console.log(sentAt);
  const DATE = new Date(sentAt.seconds * 1000);
  const [day, month, date, year] = DATE.toDateString().split(" ");

  return (
    <div className={`message ${msgClass}`}>
      <span>{data}</span>
      <span className="date">{`${month} ${date}, ${year}  ${DATE.getHours()}:${DATE.getMinutes()}`}</span>
      <span className="status"></span>
    </div>
  )
}

export default ChatMsg;