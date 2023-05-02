import { UserAuth } from "../../context/AuthContext";
import { BsFileImage } from "react-icons/bs";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
// import { IoMdAttach } from "react-icons/io";
import { AiTwotoneAudio } from "react-icons/ai";
const StatusUpdate = () => {
  const { currentUser } = UserAuth();
  return (
    <>
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full ">
                <img src={currentUser.photoURL} />
              </div>
            </div>

            <textarea
              placeholder="What's on your mind...."
              className="textarea  bg-base-200 textarea-xs w-full max-w-xs"
            ></textarea>
          </div>
          <hr />
          <div className="grid grid-cols-4 gap-4">
            <div className="flex justify-center  items-center gap-2">
              <small className="flex btn-ghost p-1 rounded items-center text-xs gap-1">
                <BsFileImage /> Image
              </small>
            </div>
            <div className="flex justify-center  items-center gap-2">
              <small className="flex btn-ghost p-1 rounded items-center gap-1">
                <MdOutlineSlowMotionVideo /> Clip
              </small>
            </div>
            {/* <div className="flex  items-center gap-2">
              <small className="flex items-center gap-1">
                <IoMdAttach /> Attachment
              </small>
            </div> */}
            <div className="flex justify-center   items-center gap-2">
              <small className="flex btn-ghost rounded p-1 items-center gap-1">
                <AiTwotoneAudio /> Audio
              </small>
            </div>
            <div className="flex justify-center items-center gap-2">
              <button className="bg-cyan-400 text-white hover:bg-cyan-600 p-1 text-sm rounded">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusUpdate;
