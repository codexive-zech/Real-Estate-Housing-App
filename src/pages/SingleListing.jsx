import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { Contact, Spinner } from "../components";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper";
import "swiper/css/bundle";
import { FaShare, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { getAuth } from "firebase/auth";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const SingleListing = () => {
  const auth = getAuth();
  const { listingId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showLandlord, setShowLandlord] = useState(false);
  SwiperCore.use([Navigation, Pagination, Autoplay]); // initialize the needed functionality of the swiper

  const getSingleListing = async () => {
    try {
      setIsLoading(true); // change the loading state
      const singleListingRef = doc(db, "listings", listingId); // getting the document (Single Listing) of each listing in the collection
      const singleListingSnapshot = await getDoc(singleListingRef); // returning back a promise with the listing data
      if (singleListingSnapshot.exists()) {
        setListing(singleListingSnapshot.data()); // update listing state to promise data received
        setIsLoading(false); // change the loading state
        console.log(listing);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }; // getting single listing as doc from the collection

  useEffect(() => {
    getSingleListing();
  }, [listingId]);

  const handleLinkCopyToClipboard = () => {
    setShowAlert(true); // change the alert state
    navigator.clipboard.writeText(window.location.href); // copy the URL into the clipboard
    setTimeout(() => {
      setShowAlert(false); // change alert state
    }, 3000); // set a 3 sec timeout
  }; // handling copying of url to clipboard

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <main>
      {listing !== null && (
        <>
          <Swiper
            slidesPerView={1}
            navigation
            pagination={{ type: "progressbar" }}
            effect="fade"
            modules={[EffectFade]}
            autoplay={{ delay: 3000 }}
          >
            {listing.imgUrls.map((url, index) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    style={{
                      backgroundImage: `url(${listing.imgUrls[index]?.downloadURL})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      width: "100%",
                      height: "300px",
                      overflow: "hidden",
                    }}
                    className=" relative"
                  ></div>
                  <p className=" fixed top-[7%] lg:top-[13%] right-6 lg:right-16 z-10 bg-white p-4 rounded-full border-2 border-gray-[#a8dadc] cursor-pointer">
                    <FaShare
                      className=" text-sm lg:text-lg"
                      onClick={handleLinkCopyToClipboard}
                    />
                  </p>
                  {showAlert && (
                    <p className=" fixed top-[26%] lg:top-[35%] right-8 lg:right-16 z-10 bg-white p-1.5 rounded-md border-2 border-gray-[#a8dadc] font-medium transition-all duration-200 ease-out">
                      Link Copied
                    </p>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className=" w-[95vw] max-w-6xl mx-auto my-4 bg-white p-4 shadow-md rounded-md flex flex-col lg:flex-row justify-between gap-8">
            <div className=" w-full lg:max-w-3xl">
              <p className=" text-lg md:text-2xl font-semibold text-blue-800 mb-4">
                {listing.propertyName} - ₦
                {listing.offer
                  ? listing.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : listing.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.type === "rent" ? " / Month" : null}
              </p>
              <p className=" flex items-center gap-4 text-lg mb-4">
                <MdLocationPin className=" text-green-600 text-xl md:text-2xl" />{" "}
                {listing.address}
              </p>
              <div className=" flex items-center gap-4  mb-4">
                <p className=" p-1.5 bg-red-700 text-white text-center w-[40vw] lg:w-[15vw] rounded-md text-lg font-semibold">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
              </div>
              <p className=" text-sm md:text-lg mb-4">
                <span className="font-bold text-lg lg:text-xl">
                  Description -{" "}
                </span>
                {listing.description}
              </p>
              <ul className=" flex items-center gap-2 lg:gap-6 whitespace-nowrap">
                <li className="flex items-center gap-2 text-sm md:text-lg">
                  <FaBed />{" "}
                  {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                </li>
                <li className="flex items-center gap-1 text-sm  md:text-lg">
                  <FaBath />{" "}
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} Baths`
                    : "1 Bath"}
                </li>
                <li className="flex items-center gap-1 text-sm  md:text-lg">
                  <FaParking />{" "}
                  {listing.parking ? "Parking Spot" : "No Parking"}
                </li>
                <li className="flex items-center gap-1 text-sm  md:text-lg">
                  <FaChair />{" "}
                  {listing.furnished ? "Furnished" : "Not Furnished"}
                </li>
              </ul>
              {listing.userRef !== (auth.currentUser?.uid || null) &&
                !showLandlord && (
                  <button
                    className=" w-full px-7 py-3 text-white bg-blue-700 hover:bg-blue-800 shadow-sm hover:shadow-md rounded-md mt-6 text-lg lg:text-xl font-semibold capitalize"
                    onClick={() => setShowLandlord(true)}
                  >
                    Contact LandLord
                  </button>
                )}
              {showLandlord ? (
                <Contact userRef={listing.userRef} listing={listing} />
              ) : null}
            </div>
            {/* Map */}
            <div className=" w-full h-[400px] lg:h-[515px] z-10 overflow-x-hidden my-4 lg:my-0">
              <MapContainer
                center={[listing.latitude, listing.longitude]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[listing.latitude, listing.longitude]}>
                  <Popup>{listing.address}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default SingleListing;
