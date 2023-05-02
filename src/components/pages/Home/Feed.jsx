import { MdPersonAdd } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { BiCommentDots } from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
const Feed = () => {
  return (
    <>
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          {/*  */}
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </div>

              <div className="flex flex-col">
                <p className="font-semibold text-xs">user name</p>
                <p className="text-xs">location</p>
              </div>
            </div>

            <span className="bg-cyan-400 p-1 rounded-full text-white flex items-center justify-center btn-ghost">
              <MdPersonAdd />
            </span>
          </div>
          {/*  */}

          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Consectetur eius ad pariatur adipisci facere eligendi nesciunt
              aperiam. Eveniet, ab suscipit?
            </p>

            <figure className="pt-4">
              <img
                src="https://images.unsplash.com/photo-1566159266489-6158a42c3beb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                alt="Shoes"
                className="rounded-xl"
              />
            </figure>
          </div>

          <div className="flex items-center px-2 justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <AiOutlineHeart /> <span className="text-sm">0</span>
              </div>
              <div className="flex items-center gap-1">
                <BiCommentDots /> <span className="text-sm">0</span>
              </div>
            </div>
            <span>
              <IoMdShare />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
