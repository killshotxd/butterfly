const CommentBox = (commentRes) => {
  console.log(commentRes);
  return (
    <>
      <div
        key={commentRes.commentRes.id}
        className="px-2 py-2 bg-base-200 rounded"
      >
        <div className="px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="avatar">
                <div className="w-8 rounded-full ">
                  <img src={commentRes.commentRes.avatar} />
                </div>
              </div>

              <small className="font-semibold">
                {commentRes.commentRes.commenterName}
              </small>
            </div>

            <small>2 days ago</small>
          </div>

          <div className="px-4 pl-10">
            <p className="text-xs">{commentRes.commentRes.comment}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentBox;
