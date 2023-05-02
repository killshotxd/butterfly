import Feed from "../Home/Feed";
import StatusUpdate from "../Home/StatusUpdate";
import UserHomeCard from "../Home/UserHomeCard";

const Profile = () => {
  return (
    <>
      <div className="py-4 mx-auto bg-base-200 min-h-screen container px-10">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 max-md:justify-center max-md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div>
            <UserHomeCard />
          </div>
          <div>
            <div>
              <StatusUpdate />
            </div>
            <div className="pt-10">
              <Feed />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
