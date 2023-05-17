import AdModal from "./AdModal";

/* eslint-disable react/no-unescaped-entities */
const SponsorCard = () => {
  return (
    <>
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Sponsored</span>
            <label htmlFor="my-modal-4" className="text-sm cursor-pointer">
              Create an Ad
            </label>
            {/* <small>Create an Ad</small> */}
          </div>
          <figure className="pt-4">
            <img
              src="https://images.unsplash.com/photo-1565502106544-1fca45f257ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              alt="Shoes"
              className="rounded-xl"
            />
          </figure>
          <div className="flex items-center pt-4 justify-between">
            <small className="font-semibold">McDonald</small>
            <small>McDonals@gmail.com</small>
          </div>
          <div>
            <p className="text-xs">
              Experience the joy of a juicy, delicious burger and crispy fries
              at McDonald's. Fast, convenient, and always satisfying. Come dine
              with us today!
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <AdModal />
        </label>
      </label>
    </>
  );
};

export default SponsorCard;
