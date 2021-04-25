import React, { useContext } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { FirebaseContext } from './Firebase/context';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import User from './User';
import SignOut from './SignOut';
import '../styles/UserList.css';

function UserList(props) {
  const { setChatUser } = props;

  const { firebase } = useContext(FirebaseContext);

  const userRef = firebase.firestore.collection('Users');
  const [users] = useCollectionData(userRef);
  let currUser;
  if (users) {
    currUser = users.find(user => user.uid === firebase.auth.currentUser.uid);
  }
  return (
    <div className="UserList">
      <div className="UserList-header">
        {currUser && <img src={currUser.picUrl} className="User-pic" />}
        <div className="options">
          <SignOut />
          <MoreVertIcon />
        </div>
      </div>
      {users && users.map(user => {
        if (firebase.auth.currentUser.uid !== user.uid) {
          return <User key={user.uid} user={user} setChatUser={setChatUser} />
        }
      })}
    </div>
  )
}

export default UserList;