import UserHomeCard from "./UserHomeCard";

const Home = () => {
  return (
    <>
      <div className="py-4 mx-auto container px-10">
        <div className="grid grid-cols-3 max-sm:grid-cols-1 max-md:justify-center max-md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="sideBar">
            <UserHomeCard />
          </div>
          <div className="StatusUpdate">Status</div>
          <div className="Sponsor">Sponsor</div>
        </div>
      </div>
    </>
  );
};

export default Home;
