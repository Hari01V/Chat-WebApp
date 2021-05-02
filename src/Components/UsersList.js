import React, { useContext, useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { FirebaseContext } from './Firebase/context';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import User from './User';
import SignOut from './SignOut';
import '../styles/UserList.css';

function UserList(props) {
  const { setChatUser } = props;

  const [tab, setTab] = useState("chats");

  const { firebase } = useContext(FirebaseContext);
  const userRef = firebase.firestore.collection('Users');
  const [users] = useCollectionData(userRef);

  let currUser;
  if (users) {
    currUser = users.find(user => user.uid === firebase.auth.currentUser.uid);
  }

  var chats = firebase.myChats;
  //SORT WITH LATESTMSG
  var chatsSorted = chats.sort((a, b) => {
    if (a.latestMsg && b.latestMsg) {
      return b.latestMsg.sentAt - a.latestMsg.sentAt;
    } else {
      return 0;
    }
  });
  var usersChats = [];
  chatsSorted.forEach(chat => {
    var tmp = users.find(user => user.uid === chat.otherUser);
    tmp = { ...tmp, latestMsg: chat.latestMsg };
    usersChats.push(tmp);
  });
  console.log(usersChats);

  return (
    <div className="UserList">
      <div className="UserList-header">
        {currUser && <img src={currUser.picUrl} className="User-pic" />}
        <div className="options">
          <SignOut />
          <MoreVertIcon />
        </div>
      </div>
      <div className="tab-group">
        <div className={`tab ${tab === "chats" ? `tab-active` : ''}`} onClick={() => setTab("chats")}>
          Chats
        </div>
        <div className={`tab ${tab === "users" ? `tab-active` : ''}`} onClick={() => setTab("users")}>
          Users
        </div>
      </div>
      {tab === "chats" ?
        usersChats && usersChats.map(user => {
          if (firebase.auth.currentUser.uid !== user.uid) {
            return <User key={user.uid} user={user} setChatUser={setChatUser} latestMsg={user.latestMsg} />
          }
        })
        :
        users && users.map(user => {
          if (firebase.auth.currentUser.uid !== user.uid) {
            return <User key={user.uid} user={user} setChatUser={setChatUser} />
          }
        })}

    </div>
  )
}

export default UserList;