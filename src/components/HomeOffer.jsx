import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import ListingItem from "./ListingItem";

const HomeOffer = () => {
  const [offerListings, setOfferListings] = useState(null);
  const [loading, setLoading] = useState(false);

  const getOfferListing = async () => {
    try {
      setLoading(true);
      const offerListingsRef = collection(db, "listings");
      const offerListingsQuery = query(
        offerListingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(4)
      );
      const offerListingSnapShot = await getDocs(offerListingsQuery);
      let listings = [];
      offerListingSnapShot.forEach((listingDoc) => {
        return listings.push({ id: listingDoc.id, data: listingDoc.data() });
      });
      setOfferListings(listings);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getOfferListing();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      {offerListings && offerListings.length > 0 && (
        <>
          <div className=" my-8 w-[90vw] max-w-6xl mx-auto">
            <h3 className=" text-xl md:text-2xl lg:text-3xl font-bold capitalize">
              Recent Offers
            </h3>
            <Link
              to="/offer"
              className=" text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium text-sm md:text-base my-4"
            >
              Show More Offers
            </Link>
            <ul className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-3 ">
              {offerListings.map((listing) => {
                return <ListingItem key={listing.id} listing={listing.data} />;
              })}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default HomeOffer;
