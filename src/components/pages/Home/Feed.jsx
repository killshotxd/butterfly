import { MdPersonAdd } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { BiCommentDots } from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
const Feed = () => {
  const location = useLocation();
  const { currentUser } = UserAuth();
  const pathname = location.pathname;
  const [posts, setPosts] = useState();
  const getAllPosts = async () => {
    const postsRef = collection(db, "allPosts");
    const unsubscribe = onSnapshot(postsRef, (querySnapshot) => {
      const dbpost = [];
      querySnapshot.forEach((doc) => {
        dbpost.push({ ...doc.data(), did: doc.id });
      });
      setPosts(dbpost);
    });

    return { unsubscribe };
  };

  console.log(posts);

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <>
      {posts?.map((res) => (
        <>
          <div className="card w-full bg-base-100 shadow-md">
            <div className="card-body">
              {/*  */}
              <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
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
                      <span className="bg-red-400 p-1 rounded-full text-white flex items-center justify-center btn-ghost">
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

              <div>
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
