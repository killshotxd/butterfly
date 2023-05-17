import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../Firebase";
import { useState, useEffect } from "react";
const AdCard = () => {
  const [ads, setAds] = useState();
  console.log(ads);
  const getAds = async () => {
    const adCollectionRef = collection(db, "ad");

    const queryyPersonal = query(
      adCollectionRef,
      orderBy("timePeriod", "desc")
    );
    const unsubscribe = onSnapshot(queryyPersonal, (querySnapshot) => {
      const dbAd = [];
      querySnapshot.forEach((doc) => {
        dbAd.push({ ...doc.data(), did: doc.id });
      });
      setAds(dbAd);
    });

    return { unsubscribe };
  };

  useEffect(() => {
    getAds();
  }, []);

  return (
    <>
      {ads?.map((res) => (
        <>
          <div className="card w-full bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Sponsored</span>
                {/* <label htmlFor="my-modal-4">Create an Ad</label> */}
                {/* <small>Create an Ad</small> */}
              </div>
              <figure className="pt-4">
                <img src={res.img} alt="Shoes" className="rounded-xl w-4/5" />
              </figure>
              <div className="flex items-center pt-4 justify-between">
                <small className="font-semibold">{res.postedBy}</small>
                <small>{res.email}</small>
              </div>
              <div>
                <p className="text-xs">{res.descriptionAd}</p>
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  );
};

export default AdCard;
