import { useLocation } from "react-router-dom";
import Feed from "../Home/Feed";
import StatusUpdate from "../Home/StatusUpdate";
import UserHomeCard from "../Home/UserHomeCard";

const Profile = () => {
  const { state } = useLocation();
  console.log(state);
  return (
    <>
      <div className="py-4 mx-auto bg-base-200 min-h-screen container px-10">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 max-md:justify-center max-md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div>
            <UserHomeCard state={state} />
          </div>
          <div>
            {state ? (
              ""
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
