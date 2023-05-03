/* eslint-disable no-unused-vars */
import { UserAuth } from "../../context/AuthContext";
import { BsFileImage } from "react-icons/bs";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import ProgressBar from "@ramonak/react-progress-bar";
// import { IoMdAttach } from "react-icons/io";
import { AiTwotoneAudio } from "react-icons/ai";
import { useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../../Firebase";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { IoIosRemoveCircle } from "react-icons/io";
const StatusUpdate = () => {
  const imagePicker = useRef();
  const clipPicker = useRef();
  const audioPicker = useRef();
  const { currentUser } = UserAuth();
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [clipUrl, setClipUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [description, setDescription] = useState("");
  console.log(progress);
  const [profileImageUploadStarted, setProfileImageUploadStarted] =
    useState(false);
  const handleImageClick = () => {
    imagePicker.current.click();
  };

  const handleClipClick = () => {
    clipPicker.current.click();
  };

  const handleAudioClick = () => {
    audioPicker.current.click();
  };

  const removeImg = () => {
    setImageUrl("");
  };

  const removeClip = () => {
    setClipUrl("");
  };

  const removeAudi = () => {
    setAudioUrl("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const fileType = file.type;
    const isImage = fileType.includes("image");
    const isClip = fileType.includes("video");
    const isAudio = fileType.includes("audio");
    console.log(file);
    if (!file) return;
    setProfileImageUploadStarted(true);
    uploadImage(
      file,
      (progress) => {
        setProgress(progress);
      },
      (url) => {
        if (isImage) {
          setImageUrl(url);
        } else if (isClip) {
          setClipUrl(url);
        } else if (isAudio) {
          setAudioUrl(url);
        }
        // setImageUrl(url);
        uploadImage(url);
        console.log("After", url);
        setProfileImageUploadStarted(false);
        setProgress(0);
      },
      (err) => {
        console.log("Error->", err);
        setProfileImageUploadStarted(false);
      }
    );
  };

  const uploadImage = (file, progressCallback, urlCallback, errorCallback) => {
    if (!file) {
      errorCallback("File not found");
      return;
    }

    const fileType = file.type;
    const fileSize = file.size / 1024 / 1024;

    // if (fileSize > 2) {
    //   errorCallback("File must smaller than 2MB");
    //   return;
    // }

    const storageRef = ref(
      storage,
      `${currentUser.email}/${fileType}/${file.name}`
    );

    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressCallback(progress);
      },
      (error) => {
        errorCallback(error.message);
      },
      () => {
        getDownloadURL(storageRef).then((url) => {
          urlCallback(url);
        });
      }
    );
  };

  const handlePostUpload = async () => {
    // const UserSpecificPostRef = collection(
    //   db,
    //   "posts",
    //   currentUser.email,
    //   "post"
    // );
    const allPostRef = collection(db, "posts");

    if (description == "") {
      return;
    }

    let post = {
      avatar: currentUser.photoURL,
      email: currentUser.email,
      img: imageUrl,
      clip: clipUrl,
      audio: audioUrl,
      description: description,
      uid: currentUser.uid,
      time: serverTimestamp(),
      likes: 0,
      postedBy: currentUser.displayName,
    };
    // await addDoc(UserSpecificPostRef, post);
    await addDoc(allPostRef, post);

    setDescription("");

    setImageUrl("");

    setAudioUrl("");
    setClipUrl("");
  };

  return (
    <>
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full ">
                <img src={currentUser.photoURL} />
              </div>
            </div>

            <textarea
              placeholder="What's on your mind...."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea  bg-base-200 textarea-xs w-full max-w-xs"
            ></textarea>
          </div>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={imagePicker}
            onChange={handleImageChange}
          />
          <input
            type="file"
            hidden
            accept="video/*"
            ref={clipPicker}
            onChange={handleImageChange}
          />
          <input
            type="file"
            hidden
            accept="audio/*"
            ref={audioPicker}
            onChange={handleImageChange}
          />
          {profileImageUploadStarted && (
            <ProgressBar
              completedClassName="barCompleted"
              className="px-4 "
              labelClassName="labelProgress"
              // barContainerClassName="containerProgress"
              completed={progress}
            />
          )}
          {imageUrl !== "" ? (
            <div className="w-full customImgDiv flex justify-center m-auto items-center bg-base-200 px-2 max-w-xs">
              <figure>
                <input className="w-1/2" type="image" src={imageUrl} alt="" />
              </figure>
            </div>
          ) : (
            ""
          )}{" "}
          {clipUrl !== "" ? (
            <div className="w-full customImgDiv flex justify-center m-auto items-center bg-base-200 px-2 max-w-xs">
              <video width="750" height="500" controls>
                <source src={clipUrl} type="video/mp4" />
              </video>
            </div>
          ) : (
            ""
          )}
          {audioUrl !== "" ? (
            <div className="w-full customImgDiv flex justify-center m-auto items-center bg-base-200 px-2 max-w-xs">
              <audio src={audioUrl} controls />
            </div>
          ) : (
            ""
          )}
          <hr />
          <div className="grid grid-cols-4 gap-4">
            <div className="flex justify-center  items-center gap-2">
              <small
                onClick={handleImageClick}
                className="flex btn-ghost p-1 rounded items-center text-xs gap-1"
              >
                <BsFileImage /> Image
              </small>
            </div>
            <div className="flex justify-center  items-center gap-2">
              <small
                onClick={handleClipClick}
                className="flex btn-ghost p-1 rounded items-center gap-1"
              >
                <MdOutlineSlowMotionVideo /> Clip
              </small>
            </div>
            {/* <div className="flex  items-center gap-2">
              <small className="flex items-center gap-1">
                <IoMdAttach /> Attachment
              </small>
            </div> */}
            <div className="flex justify-center   items-center gap-2">
              <small
                onClick={handleAudioClick}
                className="flex btn-ghost rounded p-1 items-center gap-1"
              >
                <AiTwotoneAudio /> Audio
              </small>
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => {
                  handlePostUpload();
                }}
                className="bg-cyan-400 text-white hover:bg-cyan-600 p-1 text-sm rounded"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusUpdate;
