import { useNavigate, useParams } from "react-router-dom";
import UserHomeCard from "../Home/UserHomeCard";
import { useRef, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { db, storage } from "../../../Firebase";
import ProgressBar from "@ramonak/react-progress-bar";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { BsFileImage } from "react-icons/bs";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
const AdPage = () => {
  const navigate = useNavigate();
  const loc = useParams();

  const imagePicker = useRef();
  const { currentUser } = UserAuth();
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [profileImageUploadStarted, setProfileImageUploadStarted] =
    useState(false);
  const [description, setDescription] = useState("");

  const handleImageClick = () => {
    imagePicker.current.click();
  };

  // GETTING FILES
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const fileType = file.type;
    const isImage = fileType.includes("image");
    // const isClip = fileType.includes("video");
    // const isAudio = fileType.includes("audio");

    if (!file) return;
    setProfileImageUploadStarted(true);
    uploadImage(
      file,
      (progress) => {
        setProgress(Math.round(progress));
      },
      (url) => {
        if (isImage) {
          setImageUrl(url);
        } else {
          console.log("error");
        }

        // setImageUrl(url);
        uploadImage(url);

        setProfileImageUploadStarted(false);
        setProgress(0);
      },
      (err) => {
        console.log("Error->", err);
        setProfileImageUploadStarted(false);
      }
    );
  };

  // UPLOAD TO FIREBASE STORAGE
  const uploadImage = (file, progressCallback, urlCallback, errorCallback) => {
    if (!file) {
      errorCallback("File not found");
      return;
    }
    const fileType = file.type;
    const storageRef = ref(
      storage,
      `${currentUser.email}/ad/${fileType}/${file.name}`
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

  // UPLOADING Ad TO FIREBASE DB
  const handleAdUpload = async () => {
    let am = {
      price: parseInt(loc.amount),
    };

    const allPostRef = collection(db, "ad");
    if (description == "") {
      toast.error("Please Enter a description!");
      return;
    }
    const response = await axios.post(
      "https://faithful-rose-baseball-cap.cyclic.app/razorpay",
      am
    );
    const data = response.data;

    console.log(data);

    let leftDays;
    if (loc.amount == 100) {
      leftDays = 1;
    } else if (loc.amount == 250) {
      leftDays = 3;
    } else if (loc.amount == 600) {
      leftDays = 7;
    }

    const options = {
      key: "rzp_test_9g4dciaUtMMQMT",
      currency: data.currency,
      amount: data.amount,
      description: "Wallet transaction",
      image:
        "https://lh5.googleusercontent.com/a49iOM_H_VAb3pxVscYwuk7CWsqF7n2pxs6IeB0MKWt5K4adnD_yjl2dB74LH8AnJ8E=w2400",
      order_id: data.id,
      handler: function (response) {
        let dataReceipt = {
          currency: data.currency,
          email: currentUser.email,
          amount: data.amount,
          description: "Wallet transaction",
          order_id: data.id,
          PAYMENT_ID: response.razorpay_payment_id,
          ORDER_ID: response.razorpay_order_id,
          img: imageUrl,
          descriptionAd: description,
          uid: currentUser.uid,
          time: serverTimestamp(),
          timePeriod: leftDays,
          postedBy: currentUser.displayName,
        };
        console.log(response);
        addDoc(allPostRef, dataReceipt);
        toast.success("Ad Published successfully!");
        navigate("/");
        // alert("PAYMENT ID:" + response.razorpay_payment_id);
        // alert("ORDER ID:" + response.razorpay_order_id);
      },
      prefill: {
        name: "Mohd Hassan",
        email: "hassanansari211@gmail.com",
        contact: "7071707194",
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();

    setDescription("");

    setImageUrl("");
  };

  return (
    <>
      <Toaster />
      <div className="py-4 mx-auto bg-base-200 min-h-screen container px-10">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 max-md:justify-center max-md:grid-cols-2 lg:grid-cols-2 gap-8">
          <UserHomeCard />

          <div className="card w-full bg-base-100 shadow-md">
            <div className="card-body">
              {/* Image */}
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={imagePicker}
                  onChange={handleImageChange}
                />
                {profileImageUploadStarted && (
                  <ProgressBar
                    completedClassName="barCompleted"
                    className="px-4 "
                    labelClassName="labelProgress"
                    completed={progress}
                  />
                )}

                {imageUrl !== "" ? (
                  <div className="w-full customImgDiv flex justify-center m-auto items-center bg-base-200 px-2 max-w-xs">
                    <figure>
                      <input
                        className="w-full"
                        type="image"
                        src={imageUrl}
                        alt=""
                      />
                    </figure>
                  </div>
                ) : (
                  ""
                )}

                <div className="flex justify-center  items-center gap-2">
                  <small
                    onClick={handleImageClick}
                    className="flex btn-ghost p-1 rounded items-center text-xs gap-1"
                  >
                    <BsFileImage /> Upload Ad Image to Show
                  </small>
                </div>
              </div>
              {/* Image */}

              <div className="flex gap-3 justify-center m-auto w-full">
                <textarea
                  placeholder="Enter Description...."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea  bg-base-200 textarea-xs w-full max-w-xs"
                ></textarea>

                <div className="flex justify-center items-center gap-2 ">
                  <button
                    onClick={() => {
                      handleAdUpload();
                    }}
                    className="bg-cyan-400 text-white hover:bg-cyan-600 p-1 h-full text-sm rounded"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdPage;
