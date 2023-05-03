const FriendListCard = (state) => {
  console.log(state);
  const user = state.state;
  console.log(user);
  return (
    <>
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          <div>
            <span>Friend List</span>
          </div>
          {user.friends.map((friend, index) => (
            <div key={index}>
              <p>{friend}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FriendListCard;
