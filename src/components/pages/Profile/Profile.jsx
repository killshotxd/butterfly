/* eslint-disable no-unused-vars */
import { useLocation } from "react-router-dom";
import Feed from "../Home/Feed";
import StatusUpdate from "../Home/StatusUpdate";
import UserHomeCard from "../Home/UserHomeCard";
import FriendListCard from "../Home/FriendListCard";
import { UserAuth } from "../../context/AuthContext";
import { BsArrowRight } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";

const Profile = () => {
  const { currentUser } = UserAuth();
  const { state } = useLocation();
  console.log(state);
  return (
    <>
      <div className="py-4 mx-auto bg-base-200 min-h-screen container px-10">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 max-md:justify-center max-md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <UserHomeCard state={state} />
            {/* {currentUser.email == state?.email ? (
              <FriendListCard state={state} />
            ) : (
              ""
            )} */}
          </div>
          <div>
            {state && state?.email !== currentUser?.email ? (
              <>
                <div className="card w-full bg-base-100 shadow-md">
                  <div className="card-body">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="flex items-center gap-3 justify-center">
                        <span className="font-semibold">Profile</span>{" "}
                        <IoIosArrowForward />{" "}
                        <span className="font-semibold">{state.postedBy}</span>
                        <div className="avatar">
                          <div className="w-8 rounded">
                            <img src={state.avatar} alt="Avatar" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <StatusUpdate state={state} />
              </div>
            )}

            <div className="pt-10 flex flex-col gap-4">
              <Feed state={state} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
