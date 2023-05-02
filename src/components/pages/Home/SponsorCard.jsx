const SponsorCard = () => {
  return (
    <>
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Sponsored</span>
            <small>Create an Ad</small>
          </div>
          <figure className="pt-4">
            <img
              src="https://images.unsplash.com/photo-1565502106544-1fca45f257ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              alt="Shoes"
              className="rounded-xl"
            />
          </figure>
          <div className="flex items-center pt-4 justify-between">
            <small className="font-semibold">Brand</small>
            <small>email@gmail.com</small>
          </div>
          <div>
            <p className="text-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
              corrupti dicta adipisci deleniti nesciunt pariatur, temporibus
              reprehenderit cumque nobis atque, debitis ullam ab laborum libero
              tempore minima eligendi voluptatibus! Dolor!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SponsorCard;
