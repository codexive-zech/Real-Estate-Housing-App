import { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FcHome } from "react-icons/fc";
import { ListingItem } from "../components";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeUserInfo, setChangeUserInfo] = useState(false);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = loggedUser;

  const handleNameChange = (e) => {
    setLoggedUser((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        }); // updating the display name inside of the auth

        const docRef = doc(db, "users", auth.currentUser.uid); // make a copy of all the values available in the collection
        await updateDoc(docRef, {
          name,
        }); // update the name in the user doc of the firestore user collection
      } // update as long as the display name from auth is different from the name input value
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error("Could Not Update Profile");
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
    toast.success("Logged Out Successfully");
  };

  const fetchUserListings = async () => {
    setIsLoading(true);
    const listingRef = collection(db, "listings"); // get a reference address for the listings collection
    const dataQuery = query(
      listingRef,
      where("userRef", "==", auth.currentUser.uid), // based on the userRef property-value in the collection
      orderBy("timestamp", "desc") // based on the timestamp the order should be new to old
    ); // make a GET query to the firebase collection
    const querySnapshot = await getDocs(dataQuery); // getting a snap shot of the GET query request
    let listings = [];
    querySnapshot.forEach((listingDoc) => {
      return listings.push({
        id: listingDoc.id,
        data: listingDoc.data(),
      }); // add(push) the single listing id and the value inside of each listing
    }); // iterate over all the listings collection gotten from that specific user
    setListings(listings);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`); // redirect to an edit page so as to edit listings
  };

  const onDelete = async (listingId) => {
    if (window.confirm("Are You Sure You Want To Delete")) {
      const listingRef = doc(db, "listings", listingId); // get a reference address for the listings
      await deleteDoc(listingRef); // deleting the listing from the collection
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      ); // filtering through to get the listing ID's that are not removed yet
      setListings(updatedListings); // updating/setting Listing state value
      toast.success("Successfully Deleted Listing"); // display a toast message
    }
  };

  return (
    <>
      <section className=" relative">
        <div className=" w-[90vw] max-w-6xl mx-auto flex items-center justify-center flex-col">
          <h1 className=" text-2xl lg:text-4xl font-semibold uppercase text-center mt-8">
            My Profile
          </h1>
          <div className=" lg:w-[50%] mt-6">
            <form>
              <input
                type="text"
                className={`w-full px-4 py-3 mb-6 text-xl text-gray-800 border border-gray-300 rounded-md bg-white ${
                  changeUserInfo ? "bg-green-200 focus:bg-green-200" : null
                }`}
                id="name"
                value={name}
                disabled={!changeUserInfo}
                onChange={handleNameChange}
              />
              <input
                type="text"
                className=" w-full px-4 py-3 mb-4 text-xl text-gray-800 border border-gray-300 rounded-md bg-white"
                id="email"
                value={email}
                disabled
              />
              <div className=" flex items-center justify-between text-sm md:text-lg whitespace-nowrap">
                <p>
                  Do You Wish To Change Name?
                  <span
                    className="text-red-600 hover:text-red-700 transition-colors duration-300 cursor-pointer font-semibold ml-2"
                    onClick={() => {
                      changeUserInfo ? handleProfileUpdate() : null;
                      setChangeUserInfo((prevState) => !prevState);
                    }}
                  >
                    {changeUserInfo ? "Apply Change" : "Edit"}
                  </span>
                </p>
                <p
                  className=" font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer"
                  onClick={handleLogout}
                >
                  Sign Out
                </p>
              </div>
            </form>
            <button
              type="submit"
              className=" mt-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md text-sm md:text-lg w-full rounded-md transition-colors duration-300 p-2 font-semibold uppercase text-white"
            >
              <Link
                to="/create-listing"
                className=" flex items-center justify-center gap-3"
              >
                <FcHome className=" bg-red-200 rounded-full p-1 text-2xl lg:text-3xl border" />
                Sell or Rent Your House
              </Link>
            </button>
          </div>
        </div>
        {/* Listings Goes Here */}
        <div className=" w-[90vw] max-w-6xl mx-auto ">
          <div className=" mt-12">
            {!isLoading && listings.length > 0 && (
              <>
                <h2 className=" text-xl lg:text-2xl font-semibold text-center">
                  My Property Listings
                </h2>
                <ul className=" grid md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
                  {listings.map((listing) => {
                    return (
                      <ListingItem
                        key={listing.id}
                        listing={listing.data}
                        id={listing.id}
                        onEdit={() => onEdit(listing.id)}
                        onDelete={() => onDelete(listing.id)}
                      />
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
