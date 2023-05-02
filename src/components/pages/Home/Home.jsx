import Feed from "./Feed";
import SponsorCard from "./SponsorCard";
import StatusUpdate from "./StatusUpdate";
import UserHomeCard from "./UserHomeCard";

const Home = () => {
  return (
    <>
      <div className="py-4 mx-auto bg-base-200 min-h-screen container px-10">
        <div className="grid grid-cols-3 max-sm:grid-cols-1 max-md:justify-center max-md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="sideBar">
            <UserHomeCard />
          </div>
          <div className="StatusUpdate">
            <div>
              <StatusUpdate />
            </div>
            <div className="pt-10">
              <Feed />
            </div>
          </div>
          <div className="Sponsor">
            <SponsorCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
