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
import { HiUserRemove } from "react-icons/hi";
import toast, { Toaster } from "react-hot-toast";
import { TbMessageCircle } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
const FriendListCard = (state) => {
  const navigate = useNavigate();
  const { currentUser } = UserAuth();
  const [userInfo, setUserInfo] = useState();
  const user = state.state;

  // const getUserInfo = async () => {
  //   const userRef = doc(db, "users", currentUser?.email);

  //   // Get user document snapshot
  //   const userDocSnapshot = await getDoc(userRef);

  //   // Check if the user document exists
  //   if (userDocSnapshot.exists()) {
  //     // Get user data
  //     const userData = userDocSnapshot.data();

  //     // Get user sub-collections
  //     const notifyCollectionRef = collection(
  //       db,
  //       "users",
  //       currentUser?.email,
  //       "Profile"
  //     );

  //     // Listen for changes in the user sub-collection
  //     const unsubscribe = onSnapshot(notifyCollectionRef, (querySnapshot) => {
  //       const userCollectionData = querySnapshot.docs.map((doc) => ({
  //         did: doc.id,
  //         ...doc.data(),
  //       }));

  //       // Combine user data and user sub-collection data
  //       const userInfo = {
  //         ...userData,
  //         Details: userCollectionData,
  //       };

  //       console.log(userInfo);
  //       setUserInfo(userInfo);

  //       return userInfo;
  //     });

  //     return unsubscribe;
  //   }
  // };

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

  const handleRemoveFriend = async (friend) => {
    try {
      const currentUserRef = doc(db, "users", currentUser.email);
      const friendRef = doc(db, "users", friend?.email);
      const listFriend = doc(
        db,
        "friends",
        currentUser?.email,
        "friend",
        friend?.email
      );
      const listFriendOther = doc(
        db,
        "friends",
        friend?.email,
        "friend",
        currentUser?.email
      );
      await runTransaction(db, async (transaction) => {
        const currentUserDoc = await transaction.get(currentUserRef);
        const friendDoc = await transaction.get(friendRef);

        if (!currentUserDoc.exists() || !friendDoc.exists()) {
          throw "One or both users not found";
        }

        const currentUserFriends = currentUserDoc.data().friends;
        const friendFriends = friendDoc.data().friends;

        if (
          !currentUserFriends.includes(friend.email) ||
          !friendFriends.includes(currentUser.email)
        ) {
          throw "Friendship not found";
        }

        transaction.update(currentUserRef, {
          friends: arrayRemove(friend?.email),
        });
        transaction.update(friendRef, {
          friends: arrayRemove(currentUser?.email),
        });
      });
      await deleteDoc(listFriend, friend.email);
      await deleteDoc(listFriendOther, currentUser.email);

      getFriendList();
      toast.success("Friend Removed ! ");
      console.log("Friend removed successfully");
    } catch (error) {
      console.error("Error removing friend", error);
    }
  };

  return (
    <>
      <Toaster />
      {userInfo?.length == 0 ? (
        <>
          <div className="card w-full bg-base-100 shadow-md">
            <div className="card-body">
              <p>Please Add some friend ! 😁</p>
            </div>
          </div>
        </>
      ) : (
        <div className="card w-full bg-base-100 shadow-md">
          <div className="card-body">
            <div>
              <span className="font-semibold">Friend List 🙂</span>
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

                    <div className="flex items-center gap-3">
                      <span
                        onClick={() => {
                          handleRemoveFriend(friend);
                        }}
                        className="bg-red-400 hover:bg-red-600 p-1 rounded-full text-white flex items-center justify-center btn-ghost"
                      >
                        <HiUserRemove />
                      </span>

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
                </div>
              </>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FriendListCard;
