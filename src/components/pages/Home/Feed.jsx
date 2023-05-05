/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import toast, { Toaster } from "react-hot-toast";
import { MdPersonAdd } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { BiCommentDots, BiSend } from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import CommentBox from "./CommentBox";
import { FaUserAltSlash } from "react-icons/fa";
import { HiOutlineDownload, HiUserAdd, HiUserRemove } from "react-icons/hi";
import moment from "moment";

const Feed = (state) => {
  const notUser = state.state;

  const location = useLocation();

  const navigate = useNavigate();

  const { currentUser } = UserAuth();

  const pathname = location.pathname;

  //STATES
  const [posts, setPosts] = useState();
  const [showComments, setShowComments] = useState(false);
  const [commentInp, setCommentInp] = useState("");
  const [comments, setComments] = useState();
  const [selectedPostComments, setSelectedPostComments] = useState([]);
  const [showCommentId, setShowCommentId] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [friendsList, setFriendsList] = useState(false);
  const [userInfo, setUserinfo] = useState(false);
  const [friendList, setFriendList] = useState(false);

  // GET ALL POSTS
  const getAllPosts = async () => {
    const postsRef = collection(db, "posts");
    if (state && notUser?.email) {
      const queryy = query(
        postsRef,
        where("email", "==", notUser?.email),
        orderBy("time", "desc")
      );
      const unsubscribe = onSnapshot(queryy, (querySnapshot) => {
        const dbpost = [];
        querySnapshot.forEach((doc) => {
          dbpost.push({ ...doc.data(), did: doc.id });
        });
        setPosts(dbpost);
      });

      return { unsubscribe };
    } else if (location.pathname == "/profile") {
      const queryyPersonal = query(
        postsRef,
        where("email", "==", currentUser?.email),
        orderBy("time", "desc")
      );
      const unsubscribe = onSnapshot(queryyPersonal, (querySnapshot) => {
        const dbpost = [];
        querySnapshot.forEach((doc) => {
          dbpost.push({ ...doc.data(), did: doc.id });
        });
        setPosts(dbpost);
      });

      return { unsubscribe };
    } else {
      const queryyPersonal = query(postsRef, orderBy("time", "desc"));
      const unsubscribe = onSnapshot(queryyPersonal, (querySnapshot) => {
        const dbpost = [];
        querySnapshot.forEach((doc) => {
          dbpost.push({ ...doc.data(), did: doc.id });
        });
        setPosts(dbpost);
      });

      return { unsubscribe };
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  // DELETE POST
  const handlePostDelete = async (did) => {
    const docRef = doc(collection(db, "posts"), did);
    await deleteDoc(docRef);
    toast.success("Post deleted successfully! ");
  };

  // LIKE POST
  const handlePostsLike = async (post) => {
    const likesRef = collection(db, "likes");
    const postLikesQuery = query(
      likesRef,
      where("postId", "==", post.did),
      where("likedBy", "==", currentUser.email)
    );
    const postLikes = await getDocs(postLikesQuery);
    const postDocRef = doc(collection(db, "posts"), post.did);

    if (postLikes.size > 0) {
      // Post has already been liked, remove the like
      const likeDocRef = doc(likesRef, postLikes.docs[0].id);
      await deleteDoc(likeDocRef);
      await updateDoc(postDocRef, { likes: post.likes - 1 });
      toast.success("Post Unlike done 😁! ");
    } else {
      // Post has not been liked yet, add a new like
      await addDoc(likesRef, {
        postId: post.did,
        likedBy: currentUser.email,
        createdAt: serverTimestamp(),
      });
      await updateDoc(postDocRef, { likes: post.likes + 1 });
      toast.success("Post Liked 😁! ");
    }
  };

  // COMMENT
  const handlePostComment = async (post) => {
    if (commentInp == "") {
      toast("Please enter a comment!!");
      return;
    }
    try {
      const commentsRef = collection(db, "comments");
      const newComment = {
        postId: post.did,
        commenterEmail: currentUser.email,
        commenterName: currentUser.displayName,
        avatar: currentUser.photoURL,
        comment: commentInp,
        createdAt: new Date(),
        timeStamp: serverTimestamp(),
      };
      const docRef = await addDoc(commentsRef, newComment);
      const comments = await getComments(post.did);
      setSelectedPostComments(comments);
      setCommentInp("");
      toast.success("Comment Added 😁! ");
      console.log("Comment added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const getComments = async (postId) => {
    try {
      setCommentLoading(true);
      const commentsRef = collection(db, "comments");
      const queryy = query(commentsRef, where("postId", "==", postId));
      const querySnapshot = await getDocs(queryy);
      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(comments);
      setCommentLoading(false);
      return comments;
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleToggleComments = async (postId) => {
    setShowCommentId(postId);

    if (postId === showCommentId) {
      setShowComments(!showComments);
    } else {
      setShowComments(true);
      const comments = await getComments(postId);
      setSelectedPostComments(comments);
    }
  };

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
      console.log(userCollectionData);
      setFriendList(userCollectionData);
    });
  };

  useEffect(() => {
    getFriendList();
  }, []);

  // Add Friend
  const handleAddFriend = async (res) => {
    try {
      const currentUserRef = doc(db, "users", currentUser.email);
      const friendRef = doc(db, "users", res.email);
      const listFriendMine = doc(
        db,
        "friends",
        currentUser?.email,
        "friend",
        res?.email
      );
      const listFriendOther = doc(
        db,
        "friends",
        res?.email,
        "friend",
        currentUser?.email
      );

      // Add the friend's email to the current user's friend list
      await updateDoc(currentUserRef, {
        friends: arrayUnion(res.email),
      });

      // Add the current user's email to the friend's friend list
      await updateDoc(friendRef, {
        friends: arrayUnion(currentUser.email),
      });

      // Add the friends to currentUSer email collection of friend
      await setDoc(listFriendMine, {
        name: res.postedBy,
        email: res.email,
        avatar: res.avatar,
        addedOn: serverTimestamp(),
      });

      // Add the friends to currentUSer email collection of friend
      await setDoc(listFriendOther, {
        name: currentUser.displayName,
        email: currentUser.email,
        avatar: currentUser.photoURL,
        addedOn: serverTimestamp(),
      });

      getUserInfo();
      toast.success("Friend Added 😁! ");
      console.log("Friend added successfully");
    } catch (error) {
      console.error("Error adding friend", error);
    }
  };

  const handleRemoveFriend = async (friend) => {
    try {
      const currentUserRef = doc(db, "users", currentUser.email);
      const friendRef = doc(db, "users", friend.email);
      const listFriend = doc(
        db,
        "friends",
        currentUser.email,
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
          friends: arrayRemove(friend.email),
        });
        transaction.update(friendRef, {
          friends: arrayRemove(currentUser.email),
        });
      });
      await deleteDoc(listFriend, friend.email);
      await deleteDoc(listFriendOther, currentUser.email);
      getUserInfo();
      getFriendList();
      toast.success("Friend Removed ! ");
      console.log("Friend removed successfully");
    } catch (error) {
      console.error("Error removing friend", error);
    }
  };

  // USER INFO
  const getUserInfo = async () => {
    const { email } = currentUser;
    const userRef = doc(db, "users", email);

    // Get user document snapshot
    const userDocSnapshot = await getDoc(userRef);

    // Check if the user document exists
    if (userDocSnapshot.exists()) {
      // Get user data
      const userData = userDocSnapshot.data();

      // Get user sub-collections
      const notifyCollectionRef = collection(db, "users", email, "Profile");

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

        setUserinfo(userInfo);

        return userInfo;
      });

      return unsubscribe;
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const downloadImage = (url) => {
    var element = document.createElement("a");
    var file = new Blob([url], { type: "image/*" });
    element.href = URL.createObjectURL(file);
    element.download = "image.jpg";
    element.click();
  };

  return (
    <>
      <Toaster />
      {posts?.length == 0 ? (
        "Please Post Something"
      ) : (
        <>
          {posts?.map((res, index) => (
            <>
              <div key={index} className="card w-full bg-base-100 shadow-md">
                <div className="card-body">
                  {/*  */}
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div
                          onClick={() => {
                            navigate("/profile", { state: res });
                          }}
                          className="w-10 rounded-full"
                        >
                          <img src={res.avatar} />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <p className="font-semibold text-xs">{res?.postedBy}</p>
                        <p className="text-xs">
                          {moment(res?.time?.toDate()).fromNow()}
                        </p>
                      </div>
                    </div>

                    {pathname == "/profile" &&
                    notUser?.email == currentUser?.email ? (
                      <span className="bg-red-400 p-1 rounded-full text-white flex items-center justify-center btn-ghost">
                        <BiTrash />
                      </span>
                    ) : (
                      <>
                        {res.uid == currentUser.uid ? (
                          <span
                            onClick={() => {
                              handlePostDelete(res.did);
                            }}
                            className="bg-red-400 p-1 rounded-full text-white flex items-center justify-center btn-ghost"
                          >
                            <BiTrash />
                          </span>
                        ) : (
                          <>
                            {userInfo?.friends?.includes(res?.email) &&
                            res.email ? (
                              <span
                                onClick={() => {
                                  handleRemoveFriend(res);
                                }}
                                className="bg-red-400 p-1 rounded-full text-white flex items-center justify-center btn-ghost"
                              >
                                <HiUserRemove />
                              </span>
                            ) : (
                              <span
                                onClick={() => {
                                  handleAddFriend(res);
                                }}
                                className="bg-cyan-400 p-1 rounded-full text-white flex items-center justify-center btn-ghost"
                              >
                                <HiUserAdd />
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {/*  */}

                  <div className="px-3">
                    <p>{res.description}</p>

                    {res.img == "" ? (
                      ""
                    ) : (
                      <figure className="pt-4">
                        <img
                          src={res.img}
                          alt="postImg"
                          className="rounded-xl"
                        />
                      </figure>
                    )}
                    {res.clip == "" ? (
                      ""
                    ) : (
                      <video width="850" height="700" controls>
                        <source src={res.clip} type="video/mp4" />
                      </video>
                    )}

                    {res.audio == "" ? (
                      ""
                    ) : (
                      <audio className="w-full" src={res.audio} controls />
                    )}

                    {/* {res.img == "" ? (
                      ""
                    ) : (
                      <div className="flex items-center gap-1 float-right mt-2 bg-cyan-400 p-2 rounded ">
                        <a href={res.img} download className="text-white">
                          <HiOutlineDownload />
                        </a>
                      </div>
                    )} */}
                  </div>

                  <div className="flex items-center px-2 justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => handlePostsLike(res)}
                        className="flex items-center gap-1 hover:bg-slate-300 p-1 rounded-full"
                      >
                        <AiOutlineHeart />{" "}
                        <span className="text-sm">{res.likes}</span>
                      </div>
                      <div
                        onClick={() => {
                          handleToggleComments(res.did);
                        }}
                        className="flex items-center gap-1 hover:bg-slate-300 p-1 rounded-full"
                      >
                        <BiCommentDots />
                      </div>
                    </div>
                  </div>

                  {showComments && showCommentId === res.did && (
                    <>
                      {/* COMMENTS DIV */}

                      {selectedPostComments?.map((commentRes) => (
                        <>
                          {commentLoading ? (
                            <div className="loader flex m-auto items-center justify-center "></div>
                          ) : (
                            <CommentBox commentRes={commentRes} />
                          )}
                        </>
                      ))}
                      <hr />

                      {/* COMMENTS DIV */}

                      <div className="px-4 flex justify-center ">
                        <input
                          type="text"
                          placeholder="Write Comment..."
                          value={commentInp}
                          className="input w-full focus-within:outline-none focus:border-none text-sm max-w-xs"
                          onChange={(e) => setCommentInp(e.target.value)}
                        />
                        <button
                          onClick={() => {
                            handlePostComment(res);
                          }}
                          className="bg-cyan-400   text-white hover:bg-cyan-600 p-1 w-8 flex justify-center m-auto h-full text-sm rounded"
                        >
                          <BiSend />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ))}
        </>
      )}
    </>
  );
};

export default Feed;
