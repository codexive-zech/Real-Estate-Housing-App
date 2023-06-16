import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { ListingItem, Spinner } from "../components";

const Category = () => {
  const [categoryListings, setCategoryListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetchedListings, setLastFetchedListings] = useState(null);
  const { categoryName } = useParams();

  const fetchListingsCategory = async () => {
    try {
      setLoading(true);
      const listingsCategoryRef = collection(db, "listings");
      const listingsCategoryQuery = query(
        listingsCategoryRef,
        where("type", "==", categoryName),
        limit(8)
      );
      const listingsCategorySnapShot = await getDocs(listingsCategoryQuery);
      const lastVisibleListing =
        listingsCategorySnapShot.docs[listingsCategorySnapShot.docs.length - 1];
      setLastFetchedListings(lastVisibleListing);
      let categoryListings = [];
      listingsCategorySnapShot.forEach((categoryListingDoc) => {
        return categoryListings.push({
          id: categoryListingDoc.id,
          data: categoryListingDoc.data(),
        });
      });
      setCategoryListings(categoryListings);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingsCategory();
  }, [categoryName]);

  const fetchMoreListings = async () => {
    try {
      setLoading(true);
      const listingsCategoryRef = collection(db, "listings");
      const listingsCategoryQuery = query(
        listingsCategoryRef,
        where("type", "==", categoryName),
        limit(4),
        startAfter(lastFetchedListings)
      );
      const listingsCategorySnapShot = await getDocs(listingsCategoryQuery);
      const lastVisibleListing =
        listingsCategorySnapShot.docs[listingsCategorySnapShot.docs.length - 1];
      setLastFetchedListings(lastVisibleListing);
      let categoryListings = [];
      listingsCategorySnapShot.forEach((categoryListingDoc) => {
        return categoryListings.push({
          id: categoryListingDoc.id,
          data: categoryListingDoc.data(),
        });
      });
      setCategoryListings((prevState) => [...prevState, ...categoryListings]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!categoryListings || categoryListings.length === 0) {
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
      {categoryListings !== null && categoryListings.length > 0 && (
        <>
          <div className=" w-[90vw] max-w-6xl mx-auto">
            <h1 className=" text-center mt-14 mb-7 text-xl md:text-2xl lg:text-3xl font-bold uppercase">
              {categoryName === "rent" ? "Places For Rent" : "Places For Sale"}
            </h1>
            <ul className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-3 ">
              {categoryListings.map((listing) => {
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
      {lastFetchedListings && (
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

export default Category;
