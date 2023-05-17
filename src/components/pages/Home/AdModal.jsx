import { useNavigate } from "react-router-dom";

const AdModal = () => {
  const navigate = useNavigate();
  return (
    <>
      <h3 className="text-lg font-bold text-center">Your Personalized Ad</h3>
      <p className="py-4">Choose your preferred Ad Option :</p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-bold">1 Day (Rs.100)</p>
          <p
            onClick={() => {
              navigate(`/ad/${100}`);
            }}
            className="font-semibold cursor-pointer"
          >
            Click Here
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-bold">3 Day (Rs.250)</p>
          <p
            onClick={() => {
              navigate(`/ad/${250}`);
            }}
            className="font-semibold cursor-pointer"
          >
            Click Here
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-bold">7 Day (Rs.600)</p>
          <p
            onClick={() => {
              navigate(`/ad/${600}`);
            }}
            className="font-semibold cursor-pointer"
          >
            Click Here
          </p>
        </div>
      </div>
    </>
  );
};

export default AdModal;
