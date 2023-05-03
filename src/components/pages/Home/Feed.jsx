import { MdPersonAdd } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { BiCommentDots, BiSend } from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
const Feed = (state) => {
  const notUser = state.state;
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = UserAuth();
  const pathname = location.pathname;
  const [posts, setPosts] = useState();
  const [showComments, setShowComments] = useState(false);
  const [commentInp, setCommentInp] = useState("");
  const [comments, setComments] = useState();
  const [selectedPostComments, setSelectedPostComments] = useState([]);
  const [showCommentId, setShowCommentId] = useState("");
  const getAllPosts = async () => {
    const postsRef = collection(db, "posts");
    if (state && notUser?.email) {
      const queryy = query(postsRef, where("email", "==", notUser?.email));
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
        where("email", "==", currentUser?.email)
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
      const unsubscribe = onSnapshot(postsRef, (querySnapshot) => {
        const dbpost = [];
        querySnapshot.forEach((doc) => {
          dbpost.push({ ...doc.data(), did: doc.id });
        });
        setPosts(dbpost);
      });

      return { unsubscribe };
    }
  };
  console.log(notUser);

  console.log(posts);

  useEffect(() => {
    getAllPosts();
  }, []);

  const handlePostDelete = async (did) => {
    // const UserSpecificPostRef = doc(
    //   collection(db, "posts", currentUser.email, "post"),
    //   did
    // );

    const docRef = doc(collection(db, "posts"), did);
    // await deleteDoc(UserSpecificPostRef);
    await deleteDoc(docRef);
  };

  // const handlePostsLike = async (res) => {
  //   const docRef = doc(collection(db, "posts"), res.did);

  //   if (res.likedBy == currentUser.email) {
  //     res.likes--;
  //     let likeCount = {
  //       likedBy: "",
  //       likes: res.likes,
  //     };
  //     console.log(likeCount);
  //     return;
  //   } else {
  //     res.likes++;
  //     let likeCount = {
  //       likedBy: currentUser.email,
  //       likes: res.likes,
  //     };
  //     console.log(likeCount);
  //     await updateDoc(docRef, likeCount);
  //   }
  // };

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
    } else {
      // Post has not been liked yet, add a new like
      await addDoc(likesRef, {
        postId: post.did,
        likedBy: currentUser.email,
        createdAt: serverTimestamp(),
      });
      await updateDoc(postDocRef, { likes: post.likes + 1 });
    }
  };

  const handlePostComment = async (post) => {
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
      console.log("Comment added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const getComments = async (postId) => {
    try {
      const commentsRef = collection(db, "comments");
      const queryy = query(commentsRef, where("postId", "==", postId));
      const querySnapshot = await getDocs(queryy);
      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(comments);
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

  return (
    <>
      {posts?.map((res) => (
        <>
          <div key={res.did} className="card w-full bg-base-100 shadow-md">
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
                    <p className="text-xs">location</p>
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
                      <span className="bg-cyan-400 p-1 rounded-full text-white flex items-center justify-center btn-ghost">
                        <MdPersonAdd />
                      </span>
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
                    <img src={res.img} alt="postImg" className="rounded-xl" />
                  </figure>
                )}
                {res.clip == "" ? (
                  ""
                ) : (
                  <video width="850" height="700" controls>
                    <source src={res.clip} type="video/mp4" />
                  </video>
                )}

                {res.audio == "" ? "" : <audio src={res.audio} controls />}
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
                <span className="hover:bg-slate-300 p-1 rounded-full">
                  <IoMdShare />
                </span>
              </div>

              {showComments && showCommentId === res.did && (
                <>
                  {/* COMMENTS DIV */}

                  {selectedPostComments?.map((commentRes) => (
                    <>
                      {console.log(commentRes)}
                      <div
                        key={commentRes.id}
                        className="px-2 py-2 bg-base-200 rounded"
                      >
                        <div className="px-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="avatar">
                                <div className="w-8 rounded-full ">
                                  <img src={commentRes.avatar} />
                                </div>
                              </div>

                              <small className="font-semibold">
                                {commentRes.commenterName}
                              </small>
                            </div>

                            <small>2 days ago</small>
                          </div>

                          <div className="px-4 pl-10">
                            <p className="text-xs">{commentRes.comment}</p>
                          </div>
                        </div>
                      </div>
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
  );
};

export default Feed;
