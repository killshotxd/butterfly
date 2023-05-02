import { UserAuth } from "../../context/AuthContext";
import { GrEdit, GrUserSettings } from "react-icons/gr";
import { GoLocation } from "react-icons/go";
import { MdWork } from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";
const UserHomeCard = () => {
  const { currentUser } = UserAuth();
  return (
    <>
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          {/* NAME,Friends */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="avatar online">
                <div className="w-10 rounded-full">
                  <img src={currentUser.photoURL} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{currentUser.displayName}</span>
                <span className="text-sm">0 Friends</span>
              </div>
            </div>

            <span className="hover:bg-slate-300 p-1 rounded-full">
              <GrUserSettings />
            </span>
          </div>
          {/* NAME,Friends */}
          <hr />
          {/* LOCATION */}
          <div className="flex flex-col gap-2">
            <small className="flex items-center gap-2">
              <GoLocation /> Uttar Pradesh
            </small>
            <small className="flex items-center gap-2">
              <MdWork /> Frontend Developer
            </small>
          </div>
          {/* LOCATION */}
          <hr />

          {/* PROFILE VIEWS/IMPRESSIONS */}
          <small className="flex items-center justify-between">
            Profile Views in last 7 days
            <span className="font-semibold">21</span>{" "}
          </small>
          <small className="flex items-center justify-between">
            Impressions in last 7 days
            <span className="font-semibold">1021</span>
          </small>
          {/* PROFILE VIEWS/IMPRESSIONS */}
          <hr />
          {/* SOCIAL LINKS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <FaLinkedin size={25} />
              </div>
              <div className="flex flex-col">
                <small className="font-semibold">LinkedIn</small>
                <small className="text-gray-400">Network Platform</small>
              </div>
            </div>

            <small className="hover:bg-slate-300 p-1 rounded-full">
              <GrEdit />
            </small>
          </div>
          {/* SOCIAL LINKS */}
          {/* SOCIAL LINKS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <FaGithub size={25} />
              </div>
              <div className="flex flex-col">
                <small className="font-semibold">Github</small>
                <small className="text-gray-400">Developers Platform</small>
              </div>
            </div>

            <small className="hover:bg-slate-300 p-1 rounded-full">
              <GrEdit />
            </small>
          </div>
          {/* SOCIAL LINKS */}
        </div>
      </div>
    </>
  );
};

export default UserHomeCard;
