/* eslint-disable no-unused-vars */
import moment from "moment";
import { UserAuth } from "../../context/AuthContext";

const Chat = (msg, index) => {
  var message = msg.msg;

  const timestamp = moment(message?.createdAt?.toDate());

  // eslint-disable-next-line no-unused-vars
  const relativeTime = timestamp?.fromNow();
  const { currentUser } = UserAuth();
  return (
    <>
      <div className="">
        {/* NOT user */}
        <div
          className={`chat ${
            message.uid === currentUser.uid ? "chat-end" : "chat-start"
          }`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src={message.avatar} />
            </div>
          </div>
          <div className="chat-header">
            {message.name}
            <time className="text-xs opacity-50 ml-2">{relativeTime}</time>
          </div>
          <div className="chat-bubble">{message.text}</div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>

        {/* USER */}
        {/* <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div className="chat-header">
            Anakin
            <time className="text-xs opacity-50">12:46</time>
          </div>
          <div className="chat-bubble">I hate you!</div>
          <div className="chat-footer opacity-50">Seen at 12:46</div>
        </div> */}
        {/* CHAT CONTAINER */}
      </div>
    </>
  );
};

export default Chat;
