import { MdPersonAdd } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { BiCommentDots } from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
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

  console.log(posts);

  useEffect(() => {
    getAllPosts();
  }, []);

  const handleProfileView = (uid) => {};

  const handlePostDelete = async (did) => {
    // const UserSpecificPostRef = doc(
    //   collection(db, "posts", currentUser.email, "post"),
    //   did
    // );

    const docRef = doc(collection(db, "posts"), did);
    // await deleteDoc(UserSpecificPostRef);
    await deleteDoc(docRef);
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
                    <p className="font-semibold text-xs">{res.postedBy}</p>
                    <p className="text-xs">location</p>
                  </div>
                </div>

                {pathname == "/profile" ? (
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
              </div>

              <div className="flex items-center px-2 justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 hover:bg-slate-300 p-1 rounded-full">
                    <AiOutlineHeart /> <span className="text-sm">0</span>
                  </div>
                  <div className="flex items-center gap-1 hover:bg-slate-300 p-1 rounded-full">
                    <BiCommentDots /> <span className="text-sm">0</span>
                  </div>
                </div>
                <span className="hover:bg-slate-300 p-1 rounded-full">
                  <IoMdShare />
                </span>
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  );
};

export default Feed;
