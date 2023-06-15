import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "./Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Navigation,
  Autoplay,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListing] = useState(null);
  SwiperCore.use([Navigation, Autoplay, Pagination]); // initialize the core properties of Swiper
  const navigate = useNavigate();

  const fetchListingPropertyLimit = async () => {
    try {
      setIsLoading(true); // change the loading state since it's fetching
      const listingRef = collection(db, "listings"); // get a reference for the listings collection
      const listingQuery = query(
        listingRef,
        orderBy("timestamp", "desc"),
        limit(4)
      ); // make a query to the firebase store getting just the last 4 added listings
      const listingSnapShot = await getDocs(listingQuery); // make an api request to fetch the listing
      let listings = [];
      listingSnapShot.forEach((listingDoc) => {
        listings.push({
          id: listingDoc.id,
          data: listingDoc.data(),
        });
      }); // iterate over the listings gotten from making a api call
      setListing(listings);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListingPropertyLimit();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (!listings || listings.length === 0) {
    return <></>;
  }
  console.log(listings);
  return (
    <>
      {listings !== null && (
        // Swiper
        <Swiper
          pagination={{ type: "progressbar" }}
          navigation
          autoplay={{ delay: 3000 }}
          slidesPerView={1}
          modules={[EffectFade]}
          effect="fade"
        >
          {listings.map(({ data, id }) => {
            return (
              <SwiperSlide
                key={id}
                onClick={() => navigate(`category/${data.type}/${id}`)}
              >
                <div
                  style={{
                    backgroundImage: `url(${data.imgUrls[0]?.downloadURL})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    width: "100%",

                    overflow: "hidden",
                  }}
                  className=" relative h-[300px] md:h-[350px]"
                ></div>
                <p className=" absolute top-3 left-3 bg-[#457b9d] p-1.5 text-white rounded-br-2xl font-medium  text-base md:text-lg lg:text-xl capitalize">
                  {data.propertyName}
                </p>
                <p className=" absolute bottom-3 left-3 bg-[#e63946] p-1.5 text-white rounded-tr-2xl font-medium  text-base md:text-lg lg:text-xl">
                  ₦
                  {data.offer
                    ? data.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : data.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {data.type === "rent" ? " /Month" : null}
                </p>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </>
  );
};

export default Slider;
