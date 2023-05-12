import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../Firebase";
import toast, { Toaster } from "react-hot-toast";
import { UserAuth } from "../../context/AuthContext";
const SendMsg = (state) => {
  const notUser = state.state.state;
  const { currentUser } = UserAuth();
  const [value, setValue] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [currentLength, setCurrentLength] = useState(0);
  const maxLength = 20;

  const handleSendMsg = async () => {
    if (value.trim() === "") {
      toast.error("Enter valid Message!");
      return;
    }

    try {
      const { uid, displayName, photoURL, email } = currentUser;
      const messageData = {
        text: value,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
        seenBy: [uid],
        status: "Delivered",
      };

      await addDoc(
        collection(db, "messages", email, notUser?.email),
        messageData
      );
      await addDoc(
        collection(db, "messages", notUser.email, email),
        messageData
      );
    } catch (error) {
      console.log(error);
    }

    setValue("");
    setCurrentLength(0);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const words = inputValue.split(" ");
    const currentLength = words.filter((word) => word !== "").length;
    setCurrentLength(currentLength);

    if (currentLength > maxLength) {
      e.preventDefault();
      toast("Maximum Input Length");
    } else {
      setValue(inputValue);
    }
  };
  return (
    <>
      <Toaster />
      <div className="flex items-center gap-3 mt-2 p-3 justify-center">
        <textarea
          placeholder="Enter your message here...."
          value={value}
          onChange={(e) => handleInputChange(e)}
          className="textarea  bg-base-200 textarea-xs w-full max-w-xs"
        ></textarea>
        <button
          onClick={() => {
            handleSendMsg();
          }}
          className="bg-cyan-400 text-white hover:bg-cyan-600 p-1 text-sm rounded"
        >
          Send
        </button>
      </div>
    </>
  );
};

export default SendMsg;
