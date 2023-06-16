import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { ListingItem } from "../components";

const Offer = () => {
  const [offerListings, setOfferListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const fetchOfferListings = async () => {
    try {
      setLoading(true);
      const offerListingsRef = collection(db, "listings");
      const offerListingsQuery = query(
        offerListingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(8)
      );
      const offerListingsSnapShot = await getDocs(offerListingsQuery);
      const lastVisibleListing =
        offerListingsSnapShot.docs[offerListingsSnapShot.docs.length - 1];
      setLastFetchedListing(lastVisibleListing);
      let listings = [];
      offerListingsSnapShot.forEach((listingsDoc) => {
        return listings.push({
          id: listingsDoc.id,
          data: listingsDoc.data(),
        });
      });
      setOfferListings(listings);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferListings();
  }, []);

  const fetchMoreListings = async () => {
    try {
      setLoading(true);
      const offerListingsRef = collection(db, "listings");
      const offerListingsQuery = query(
        offerListingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(4),
        startAfter(lastFetchedListing)
      );
      const offerListingsSnapShot = await getDocs(offerListingsQuery);
      const lastVisibleListing =
        offerListingsSnapShot.docs[offerListingsSnapShot.docs.length - 1];
      setLastFetchedListing(lastVisibleListing);
      let listings = [];
      offerListingsSnapShot.forEach((listingsDoc) => {
        return listings.push({
          id: listingsDoc.id,
          data: listingsDoc.data(),
        });
      });
      setOfferListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!offerListings || offerListings.length === 0) {
    return (
      <>
        <div className=" h-screen flex items-center justify-center">
          <h1 className=" text-xl lg:text-2xl font-bold text-center">
            No Listing Offer
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      {offerListings !== null && offerListings.length > 0 && (
        <>
          <div className=" w-[90vw] max-w-6xl mx-auto">
            <h1 className=" text-center mt-10 mb-5 text-xl md:text-2xl lg:text-3xl font-bold uppercase">
              Offers
            </h1>
            <ul className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-3 ">
              {offerListings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                );
              })}
            </ul>
          </div>
        </>
      )}
      {lastFetchedListing && (
        <div className=" flex items-center justify-center my-8">
          <button
            className=" px-5 py-2 bg-blue-600 active:bg-blue-700 hover:bg-blue-400 focus:bg-blue-400 transition-colors duration-300 text-white focus:text-white rounded-md font-medium"
            onClick={fetchMoreListings}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
};

export default Offer;
