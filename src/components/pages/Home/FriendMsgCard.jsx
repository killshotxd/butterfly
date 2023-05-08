/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { UserAuth } from "../../context/AuthContext";
import { TbMessageCircle } from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FriendMsgCard = (state) => {
  const navigate = useNavigate();
  const { currentUser } = UserAuth();
  const [userInfo, setUserInfo] = useState();
  const user = state.state;

  const getFriendList = async () => {
    const friendRef = collection(
      doc(db, "friends", currentUser.email),
      "friend"
    );

    const unsubscribe = onSnapshot(friendRef, (querySnapshot) => {
      const userCollectionData = querySnapshot.docs.map((doc) => ({
        did: doc.id,
        ...doc.data(),
      }));

      setUserInfo(userCollectionData);
    });

    return unsubscribe;
  };

  useEffect(() => {
    getFriendList();
  }, []);

  return (
    <>
      <Toaster />
      {userInfo?.length == 0 ? (
        <>
          <div className="card w-full bg-base-100 shadow-md">
            <div className="card-body">
              <p>Please Add some friends to start chatting ! 😁</p>
            </div>
          </div>
        </>
      ) : (
        <div className="card w-full bg-base-100 shadow-md">
          <div className="card-body">
            <div>
              <span className="font-semibold">Start Chatting Now!! 🙂</span>
            </div>
            {userInfo?.map((friend, index) => (
              <>
                <div key={index}>
                  <div className="flex items-center justify-between ">
                    <div className="flex items-center  gap-4">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img src={friend.avatar} />
                        </div>
                      </div>
                      <p>{friend.name}</p>
                    </div>

                    <span
                      onClick={() => {
                        navigate("/message", { state: friend });
                      }}
                      className="bg-cyan-400 cursor-pointer hover:bg-cyan-600 p-1 rounded-full text-white flex items-center justify-center btn-ghost"
                    >
                      <TbMessageCircle />
                    </span>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FriendMsgCard;
