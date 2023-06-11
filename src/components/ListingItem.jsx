import { Link } from "react-router-dom";
import { MdEdit, MdLocationOn } from "react-icons/md";
import Moment from "react-moment";
import imageNotFound from "../assets/image-not-found.png";
import { FaTrash } from "react-icons/fa";

const ListingItem = ({ listing, id, onEdit, onDelete }) => {
  return (
    <>
      <li className=" relative bg-white shadow-sm hover:shadow-md transition-shadow duration-300 mb-5 rounded-md overflow-hidden">
        <Link to={`category/${listing.type}/${id}`}>
          <img
            src={listing.imgUrls[0]?.downloadURL || imageNotFound}
            alt={`${listing.propertyName}`}
            className=" h-[170px] w-full object-cover transition hover:scale-105 duration-200"
            loading="lazy"
          />
          <Moment
            fromNow
            className=" absolute top-3 left-3 bg-[#3377cc] uppercase font-medium p-1  text-white text-sm rounded-md"
          >
            {listing.timestamp?.toDate()}
          </Moment>
          <div className=" w-full p-4">
            <div className=" flex items-center space-x-4">
              <MdLocationOn className=" text-green-600 text-lg md:text-2xl  w-6 h-6" />
              <p className=" font-semibold truncate text-lg text-gray-600">
                {listing.address}
              </p>
            </div>
            <p className=" font-bold truncate text-xl capitalize">
              {listing.propertyName}
            </p>
            <p className="text-[#457b9d] font-semibold mt-3">
              ₦
              {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.type === "rent" && " / Month"}
            </p>
            <div className="flex items-center justify-between mt-3">
              {/* bed and bath */}
              <div className=" flex items-center space-x-6 font-bold">
                <p className=" font-bold text-sm">
                  {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                </p>
                <p className=" font-bold text-sm">
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} Baths`
                    : "1 Bath"}
                </p>
              </div>
            </div>
          </div>
        </Link>
        {onEdit && (
          <MdEdit
            className=" absolute bottom-4 right-10 flex items-center text-green-500 cursor-pointer"
            onClick={() => onEdit(listing.id)}
          />
        )}
        {onDelete && (
          <FaTrash
            className=" absolute bottom-4 right-3 flex items-center text-red-500 cursor-pointer"
            onClick={() => onDelete(listing.id)}
          />
        )}
      </li>
    </>
  );
};

export default ListingItem;
