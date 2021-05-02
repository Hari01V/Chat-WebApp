import React, { } from 'react';
import DoneAllSharpIcon from '@material-ui/icons/DoneAllSharp';
import '../styles/User.css';

function User(props) {
  const { user, setChatUser } = props;
  const { uid, name, email, picUrl, latestMsg } = user;

  return (
    <div className="User" onClick={() => setChatUser(user)}>
      <div className="image-container">
        <img src={picUrl} className="User-pic" />
      </div>
      <div className="content">
        <h1 className="User-name">{name}</h1>
        {latestMsg && (latestMsg.sender === uid ?
          <span className="msg">{latestMsg.data}</span>
          : <span className="msg">
            <DoneAllSharpIcon />
            {latestMsg.data.length > 50 ? `${latestMsg.data.slice(0, 50)}...` : latestMsg.data}
          </span>)}
      </div>
    </div>
  )
}

export default User;