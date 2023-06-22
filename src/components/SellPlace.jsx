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

const SellPlace = () => {
  const [sellListing, setSellListings] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPlaceForRentListing = async () => {
    try {
      setLoading(true);
      const rentPlaceListingsRef = collection(db, "listings");
      const rentPlaceListingsQuery = query(
        rentPlaceListingsRef,
        where("type", "==", "sell"),
        orderBy("timestamp", "desc"),
        limit(4)
      );
      const rentPlaceListingsSnapShot = await getDocs(rentPlaceListingsQuery);
      let listings = [];
      rentPlaceListingsSnapShot.forEach((rentListingDoc) => {
        return listings.push({
          id: rentListingDoc.id,
          data: rentListingDoc.data(),
        });
      });
      setSellListings(listings);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlaceForRentListing();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <>
        {sellListing && sellListing.length > 0 && (
          <>
            <div className=" my-8 w-[90vw] max-w-6xl mx-auto">
              <h3 className=" text-xl md:text-2xl lg:text-3xl font-bold capitalize">
                Place For Sale
              </h3>
              <Link
                to="/category/sell"
                className=" text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium text-sm md:text-base my-4"
              >
                Show More Places For Sale
              </Link>
              <ul className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-3 ">
                {sellListing.map((listing) => {
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
      </>
    </>
  );
};

export default SellPlace;
