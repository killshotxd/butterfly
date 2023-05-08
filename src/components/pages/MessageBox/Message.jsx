import { useLocation } from "react-router-dom";
import UserHomeCard from "../Home/UserHomeCard";
import ChatBox from "./ChatBox";

const Message = () => {
  const { state } = useLocation();

  return (
    <>
      <div className="py-4 mx-auto bg-base-200 min-h-screen container px-10">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 max-md:justify-center max-md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <UserHomeCard state={state} />
          </div>
          <div className="flex flex-col gap-4">
            <ChatBox state={state} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
