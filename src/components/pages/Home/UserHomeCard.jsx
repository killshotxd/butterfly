/* eslint-disable react-hooks/exhaustive-deps */
import { UserAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { GrEdit, GrUserSettings } from "react-icons/gr";
import { GoLocation } from "react-icons/go";
import { MdWork } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../Firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
const UserHomeCard = (state) => {
  const notUser = state.state;

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [userInfo, setUserinfo] = useState();
  const { currentUser } = UserAuth();

  const [handleLocation, setHandleLocation] = useState("");
  const [handleDesignation, setHandleDesignation] = useState("");
  const [handleLinkedin, setHandleLinkedin] = useState("");
  const [handleGithub, setHandleGithub] = useState("");

  // GET USER INFO
  const getUserInfo = async () => {
    const { email } = currentUser;
    if (notUser?.email) {
      const userRef = doc(db, "users", notUser?.email);

      // Get user document snapshot
      const userDocSnapshot = await getDoc(userRef);

      // Check if the user document exists
      if (userDocSnapshot.exists()) {
        // Get user data
        const userData = userDocSnapshot.data();

        // Get user sub-collections
        const notifyCollectionRef = collection(
          db,
          "users",
          notUser?.email,
          "Profile"
        );

        // Listen for changes in the user sub-collection
        const unsubscribe = onSnapshot(notifyCollectionRef, (querySnapshot) => {
          const userCollectionData = querySnapshot.docs.map((doc) => ({
            did: doc.id,
            ...doc.data(),
          }));

          // Combine user data and user sub-collection data
          const userInfo = {
            ...userData,
            Details: userCollectionData,
          };

          setUserinfo(userInfo);

          return userInfo;
        });

        return unsubscribe;
      } else {
        console.log("User document does not exist.");
      }
    } else {
      const userRef = doc(db, "users", email);

      // Get user document snapshot
      const userDocSnapshot = await getDoc(userRef);

      // Check if the user document exists
      if (userDocSnapshot.exists()) {
        // Get user data
        const userData = userDocSnapshot.data();

        // Get user sub-collections
        const notifyCollectionRef = collection(db, "users", email, "Profile");

        // Listen for changes in the user sub-collection
        const unsubscribe = onSnapshot(notifyCollectionRef, (querySnapshot) => {
          const userCollectionData = querySnapshot.docs.map((doc) => ({
            did: doc.id,
            ...doc.data(),
          }));

          // Combine user data and user sub-collection data
          const userInfo = {
            ...userData,
            Details: userCollectionData,
          };

          setUserinfo(userInfo);

          return userInfo;
        });

        return unsubscribe;
      } else {
        console.log("User document does not exist.");
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // ADD INFO LINKS TO DB

  const addLocation = async () => {
    if (handleLocation == "") {
      toast.error("Please Enter Location!");
      return;
    }
    const { email } = currentUser;
    const detailRef = doc(db, "users", email);
    let loc = {
      location: handleLocation,
    };

    await setDoc(detailRef, loc, { merge: true });
    getUserInfo();
    toast.success("Location updated successfully!");
  };
  const addDesignation = async () => {
    if (handleDesignation == "") {
      toast.error("Please Enter Designation!");
      return;
    }
    const { email } = currentUser;
    const detailRef = doc(db, "users", email);
    let loc = {
      designation: handleDesignation,
    };

    await setDoc(detailRef, loc, { merge: true });
    getUserInfo();
    toast.success("Designation updated successfully!");
  };

  const addLinkedin = async () => {
    if (handleLinkedin == "") {
      toast.error("Please Enter Linkedin Url!");
      return;
    }
    const { email } = currentUser;
    const detailRef = doc(db, "users", email);
    let loc = {
      linkedin: handleLinkedin,
    };

    await setDoc(detailRef, loc, { merge: true });
    getUserInfo();
    toast.success("Linkedin Profile updated successfully!");
  };

  const addGithub = async () => {
    if (handleGithub == "") {
      toast.error("Please Enter Github Url!");
      return;
    }
    const { email } = currentUser;
    const detailRef = doc(db, "users", email);
    let loc = {
      github: handleGithub,
    };

    await setDoc(detailRef, loc, { merge: true });
    getUserInfo();
    toast.success("Github Profile updated successfully!");
  };

  // ADD INFO LINKS TO DB

  return (
    <>
      <Toaster />
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          {/* NAME,Friends */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="avatar online">
                <div className="w-10 rounded-full">
                  {notUser ? (
                    <img src={notUser.avatar} />
                  ) : (
                    <img src={currentUser.photoURL} />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{userInfo?.name}</span>
                <span className="text-xs">
                  {/* {userInfo?.friends?.length} Friends */}
                  {userInfo?.email}
                </span>
              </div>
            </div>

            {pathname == "/profile" || pathname == "/message" ? (
              ""
            ) : (
              <span
                onClick={() => navigate("/profile", { state: userInfo })}
                className="hover:bg-slate-300 p-1 rounded-full"
              >
                <GrUserSettings />
              </span>
            )}
          </div>
          {/* NAME,Friends */}
          <hr />
          {/* LOCATION */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <small className="flex items-center gap-2">
                <GoLocation />{" "}
                {userInfo?.location ? userInfo.location : "Location"}
              </small>
              {pathname == "/profile" &&
              currentUser?.email == notUser?.email ? (
                <label
                  htmlFor="location"
                  className="hover:bg-slate-300 text-sm p-1 rounded-full"
                >
                  <GrEdit />
                </label>
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center justify-between">
              <small className="flex items-center gap-2">
                <MdWork />{" "}
                {userInfo?.designation ? userInfo.designation : "Designation"}
              </small>
              {pathname == "/profile" &&
              currentUser?.email == notUser?.email ? (
                <label
                  htmlFor="designation"
                  className="hover:bg-slate-300 text-sm p-1 rounded-full"
                >
                  <GrEdit />
                </label>
              ) : (
                ""
              )}
            </div>
          </div>
          {/* LOCATION */}
          <hr />

          {/* PROFILE VIEWS/IMPRESSIONS */}
          <small className="flex items-center justify-between">
            Profile Views in last 7 days
            <span className="font-semibold">21</span>{" "}
          </small>
          <small className="flex items-center justify-between">
            Impressions in last 7 days
            <span className="font-semibold">1021</span>
          </small>
          {/* PROFILE VIEWS/IMPRESSIONS */}
          <hr />
          {/* SOCIAL LINKS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <FaLinkedin size={25} />
              </div>
              <div className="flex flex-col">
                <small className="font-semibold">LinkedIn</small>
                <small className="text-gray-400">Network Platform</small>
              </div>
            </div>
            {pathname == "/profile" ? (
              <div className="flex items-center gap-2">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={userInfo?.linkedin}
                  className="hover:bg-slate-300 p-1 rounded-full"
                >
                  <FiExternalLink />
                </a>
                {currentUser?.email == notUser?.email ? (
                  <label
                    htmlFor="linkedin"
                    className="hover:bg-slate-300 text-sm p-1 rounded-full"
                  >
                    <GrEdit />
                  </label>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <a
                target="_blank"
                rel="noreferrer"
                href={userInfo?.linkedin}
                className="hover:bg-slate-300 p-1 rounded-full"
              >
                <FiExternalLink />
              </a>
            )}
          </div>
          {/* SOCIAL LINKS */}
          {/* SOCIAL LINKS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <FaGithub size={25} />
              </div>
              <div className="flex flex-col">
                <small className="font-semibold">Github</small>
                <small className="text-gray-400">Developers Platform</small>
              </div>
            </div>

            {pathname == "/profile" ? (
              <div className="flex items-center gap-2">
                <a
                  target="_blank"
                  href={userInfo?.github}
                  rel="noreferrer"
                  className="hover:bg-slate-300 p-1 rounded-full"
                >
                  <FiExternalLink />
                </a>
                {currentUser?.email == notUser?.email ? (
                  <label
                    htmlFor="github"
                    className="hover:bg-slate-300 text-sm p-1 rounded-full"
                  >
                    <GrEdit />
                  </label>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <a
                target="_blank"
                href={userInfo?.github}
                rel="noreferrer"
                className="hover:bg-slate-300 p-1 rounded-full"
              >
                <FiExternalLink />
              </a>
            )}
          </div>
          {/* SOCIAL LINKS */}
        </div>
      </div>

      {/* LOCATION */}
      <input type="checkbox" id="location" className="modal-toggle" />
      <label htmlFor="location" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold text-center">Location</h3>
          <div className="m-auto flex items-center justify-center py-2">
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setHandleLocation(e.target.value)}
            />
          </div>
          <div className=" py-2 text-center">
            <label
              htmlFor="location"
              onClick={() => addLocation()}
              className="p-2 bg-cyan-400 text-white rounded btn-ghost "
            >
              Save
            </label>
          </div>
        </label>
      </label>

      {/* LOCATION */}

      {/* Designation */}
      <input type="checkbox" id="designation" className="modal-toggle" />
      <label htmlFor="designation" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold text-center">Designation</h3>
          <div className="m-auto flex items-center justify-center py-2">
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setHandleDesignation(e.target.value)}
            />
          </div>
          <div className=" py-2 text-center">
            <label
              htmlFor="designation"
              onClick={() => addDesignation()}
              className="p-2 bg-cyan-400 text-white rounded btn-ghost "
            >
              Save
            </label>
          </div>
        </label>
      </label>
      {/* Designation */}

      {/* Linkedin */}
      <input type="checkbox" id="linkedin" className="modal-toggle" />
      <label htmlFor="linkedin" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold text-center">LinkedIn</h3>
          <div className="m-auto flex items-center justify-center py-2">
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setHandleLinkedin(e.target.value)}
            />
          </div>
          <div className=" py-2 text-center">
            <label
              htmlFor="linkedin"
              onClick={() => addLinkedin()}
              className="p-2 bg-cyan-400 text-white rounded btn-ghost "
            >
              Save
            </label>
          </div>
        </label>
      </label>
      {/* Linkedin */}

      {/* Github */}
      <input type="checkbox" id="github" className="modal-toggle" />
      <label htmlFor="github" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold text-center">Github</h3>
          <div className="m-auto flex items-center justify-center py-2">
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setHandleGithub(e.target.value)}
            />
          </div>
          <div className=" py-2 text-center">
            <label
              htmlFor="github"
              onClick={() => addGithub()}
              className="p-2 bg-cyan-400 text-white rounded btn-ghost "
            >
              Save
            </label>
          </div>
        </label>
      </label>

      {/* Github */}
    </>
  );
};

export default UserHomeCard;
