/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { UserAuth } from "../../context/AuthContext";

const FriendListCard = (state) => {
  const { currentUser } = UserAuth();
  const [userInfo, setUserInfo] = useState();
  const user = state.state;
  console.log(user);

  const getUserInfo = async () => {
    const userRef = doc(db, "users", user.email);

    // Get user document snapshot
    const userDocSnapshot = await getDoc(userRef);

    // Check if the user document exists
    if (userDocSnapshot.exists()) {
      // Get user data
      const userData = userDocSnapshot.data();

      // Get user sub-collections
      const notifyCollectionRef = collection(
        db,
        "users",
        user.email,
        "Profile"
      );

      // Listen for changes in the user sub-collection
      const unsubscribe = onSnapshot(notifyCollectionRef, (querySnapshot) => {
        const userCollectionData = querySnapshot.docs.map((doc) => ({
          did: doc.id,
          ...doc.data(),
        }));

        // Combine user data and user sub-collection data
        const userInfo = {
          ...userData,
          Details: userCollectionData,
        };
        console.log(userInfo);
        setUserInfo(userInfo);

        return userInfo;
      });

      return unsubscribe;
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          <div>
            <span>Friend List</span>
          </div>
          {userInfo?.friends?.map((friend, index) => (
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
                      handleRemoveFriend(friend);
                    }}
                    className="bg-red-400 p-1 rounded-full text-white flex items-center justify-center btn-ghost"
                  >
                    <BiTrash />
                  </span>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default FriendListCard;
