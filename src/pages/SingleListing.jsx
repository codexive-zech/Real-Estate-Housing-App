import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { Spinner } from "../components";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";

const SingleListing = () => {
  const { categoryType, listingId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  SwiperCore.use([Navigation, Pagination, Autoplay]); // initialize the needed functionality of the swiper

  const getSingleListing = async () => {
    try {
      setIsLoading(true); // change the loading state
      const singleListingRef = doc(db, "listings", listingId); // getting the document (Single Listing) of each listing in the collection
      const singleListingSnapshot = await getDoc(singleListingRef); // returning back a promise with the listing data
      if (singleListingSnapshot.exists()) {
        setListing(singleListingSnapshot.data()); // update listing state to promise data received
        setIsLoading(false); // change the loading state
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
                <p className=" fixed top-[13%] right-16 z-10 bg-white p-4 rounded-full border-2 border-gray-[#a8dadc] cursor-pointer">
                  <FaShare
                    className=" text-sm lg:text-lg"
                    onClick={handleLinkCopyToClipboard}
                  />
                </p>
                {showAlert && (
                  <p className=" fixed top-[35%] right-16 z-10 bg-white p-1.5 rounded-md border-2 border-gray-[#a8dadc] font-medium transition-all duration-200 ease-out">
                    Link Copied
                  </p>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </main>
  );
};

export default SingleListing;
