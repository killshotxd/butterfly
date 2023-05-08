import { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import SendMsg from "./SendMsg";
import { useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../Firebase";
import Chat from "./Chat";
import { useRef } from "react";

const ChatBox = (state) => {
  const messagesEndRef = useRef();
  const notUser = state.state;
  const { currentUser } = UserAuth();
  const [messages, setMessages] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    let q;

    q = query(
      collection(db, "messages", currentUser.email, notUser.email),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });

      setMessages(messages);
    });

    return () => unsubscribe();
  }, [currentUser.email, notUser.email]);

  return (
    <>
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          <div className="rounded bg-base-200 mb-4 p-3 flex items-center m-auto gap-4">
            <div>
              Chatting with :{" "}
              <span className="font-semibold">{notUser.name}</span>{" "}
            </div>
            <div className="avatar">
              <div className="w-8 rounded">
                <img src={notUser.avatar} alt="Avatar" />
              </div>
            </div>
          </div>
          {/* CHAT CONTAINER */}
          {messages.length == 0 ? (
            // <div className="rounded p-3 w-full text-center font-semibold justify-center flex items-center m-auto">
            //   <div
            //     className="hero w-full"
            //     style={{
            //       backgroundImage: `url("https://images.unsplash.com/photo-1526045612212-70caf35c14df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80")`,
            //     }}
            //   >
            //     <div className="hero-overlay bg-opacity-60"></div>
            //     <div className="hero-content text-center text-neutral-content">
            //       <div className="">
            //         <p className="p-5">Message Now!!</p>
            //       </div>
            //     </div>
            //   </div>
            // </div>
            ""
          ) : (
            <>
              {messages.map((msg, index) => (
                <Chat key={msg.id} msg={msg} index={index} />
              ))}
            </>
          )}

          <SendMsg state={state} />
        </div>
        <div ref={messagesEndRef}></div>
      </div>
    </>
  );
};

export default ChatBox;
