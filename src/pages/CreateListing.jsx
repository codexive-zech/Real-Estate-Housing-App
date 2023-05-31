import { useState } from "react";
import { Spinner } from "../components";
import { toast } from "react-toastify";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [listingData, setListingData] = useState({
    type: "rent",
    propertyName: "",
    bedrooms: 5,
    bathrooms: 3,
    furnished: false,
    parkingSpot: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: [],
  });
  const {
    type,
    propertyName,
    bedrooms,
    bathrooms,
    furnished,
    parkingSpot,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = listingData;

  const handleImages = (e) => {
    const files = e.target.files;
    if (files.length > 6) {
      toast.error("Maximum of 6 Images are Allowed");
      return;
    }
    setListingData((prevState) => ({
      ...prevState,
      images: [...files],
    })); // handle new images been added
  }; // implemented functionality to handle number of images sent to the DB and display error

  function handleListingChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setListingData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/Boolean/Number
    if (!e.target.files) {
      setListingData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function handlingListingCreation(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    } // checking to see if the discounted price is bigger than the regular price (Display an Error)

    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
    } // checking to see if the number of images been uploaded is more than 6 (Display an Error)

    let geolocation = {};
    if (!geolocationEnabled) {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    } // setting manual geolocation

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage(); // get the storage from firebase
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`; // setup filename
        const storageRef = ref(storage, filename); // the storage-reference has both the storage gotten and the filename
        const uploadTask = uploadBytesResumable(storageRef, image); // uploading each image into he firebase storage
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          }, // uploading process
          (error) => {
            reject(error);
          }, // reject the promise and display an msg when they is an error
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                resolve({ name: image.name, downloadURL }); // Extracting relevant data from File object
              }) // provide a downloadable url for each image been upload
              .catch((error) => {
                reject(error);
              }); // reject the promise and display an msg when they is an error
          }
        );
      });
    }

    try {
      const imgUrls = await Promise.all(
        images.map((image) => storeImage(image))
      ); // iterate over all the images to be uploaded

      const listingDataCopy = {
        ...listingData,
        imgUrls,
        geolocation,
        timeStamp: serverTimestamp(),
      }; // create a new copy for all the data provided in the listing form before add it to the DB

      delete listingDataCopy.images; // deleting the images been added from the collection since it is already inside of the storage with a URL

      !listingDataCopy.offer && delete listingDataCopy.discountedPrice; // deleting the discount price field when they is no offer provided in listing
      await addDoc(collection(db, "listings"), listingDataCopy); // creating a new collection for the property listing
      setLoading(false);
      navigate(
        `category/${listingDataCopy.type}/name/${listingDataCopy.propertyName}`
      ); // redirect to this url when listing is created successfully
      toast.success("Property Listing Created Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Images not uploaded. Error: " + error.message); // Add error.message for specific error details
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className=" relative my-8">
      <div className=" w-[85vw] max-w-6xl mx-auto">
        <h2 className=" text-center text-2xl lg:text-3xl uppercase font-bold mt-12">
          Create a Home Listing
        </h2>
        <div className="w-full lg:max-w-lg mt-6 mx-auto ">
          <form onSubmit={handlingListingCreation}>
            {/* Sell and Rent Button */}
            <div className=" mt-10">
              <p className=" font-bold text-xl md:text-2xl uppercase">
                Sell/Rent
              </p>
              <div className="flex items-center space-x-8 my-3">
                <button
                  type="button"
                  id="type"
                  value="sell"
                  onClick={handleListingChange}
                  className={` w-full  py-4 px-8 shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 text-xl font-semibold uppercase focus:shadow-md rounded-sm  ${
                    type === "sell"
                      ? "  text-white bg-slate-600"
                      : "text-black bg-white"
                  }`}
                >
                  Sell
                </button>
                <button
                  type="button"
                  id="type"
                  value="rent"
                  onClick={handleListingChange}
                  className={` w-full  py-4 px-8 shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 text-xl font-semibold uppercase  focus:shadow-md rounded-sm ${
                    type === "rent"
                      ? "  text-white bg-slate-600"
                      : "text-black bg-white"
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>
            {/* Property Name Input */}
            <div className=" mt-10">
              <p className=" font-bold text-xl md:text-2xl uppercase">
                Property Name
              </p>
              <input
                type="text"
                id="propertyName"
                minLength={2}
                maxLength={30}
                value={propertyName}
                onChange={handleListingChange}
                placeholder="Property Name"
                className=" py-3 px-5 w-full bg-white text-xl rounded-md border border-slate-300 outline-slate-500 my-3"
                required
              />
            </div>
            {/* Bedroom and Bathroom */}
            <div className=" mt-10">
              <div className=" flex items-center justify-between">
                <div>
                  <p className=" font-bold text-xl md:text-2xl uppercase">
                    Bedrooms
                  </p>
                  <input
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="50"
                    value={bedrooms}
                    onChange={handleListingChange}
                    className=" py-2 px-4 w-full bg-white text-lg text-center rounded-md border border-slate-300 outline-slate-500 my-3"
                    required
                  />
                </div>
                <div>
                  <p className=" font-bold text-xl md:text-2xl uppercase">
                    Bathrooms
                  </p>
                  <input
                    type="number"
                    id="bathrooms"
                    min="1"
                    max="50"
                    value={bathrooms}
                    onChange={handleListingChange}
                    className=" py-2 px-4 w-full bg-white text-lg text-center rounded-md border border-slate-300 outline-slate-500 my-3"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Furnished */}
            <div className=" mt-10">
              <p className=" font-bold text-xl md:text-2xl uppercase">
                Furnished
              </p>
              <div className=" flex items-center space-x-8 my-3">
                <button
                  type="button"
                  id="furnished"
                  value={true}
                  onClick={handleListingChange}
                  className={` w-full  py-4 px-8 shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 text-xl font-semibold uppercase focus:shadow-md rounded-sm ${
                    furnished
                      ? "  text-white bg-slate-600"
                      : "text-black bg-white"
                  } `}
                >
                  Yes
                </button>
                <button
                  type="button"
                  id="furnished"
                  value={false}
                  onClick={handleListingChange}
                  className={` w-full  py-4 px-8 shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 text-xl font-semibold uppercase focus:shadow-md rounded-sm ${
                    !furnished
                      ? "  text-white bg-slate-600"
                      : "text-black bg-white"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            {/* Parking Spot */}
            <div className=" mt-10">
              <p className="font-bold text-xl md:text-2xl uppercase">
                Parking Spot
              </p>
              <div className=" flex items-center space-x-8 my-3">
                <button
                  type="button"
                  id="parkingSpot"
                  value={true}
                  onClick={handleListingChange}
                  className={` w-full  py-4 px-8 shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 text-xl font-semibold uppercase focus:shadow-md rounded-sm ${
                    parkingSpot
                      ? "  text-white bg-slate-600"
                      : "text-black bg-white"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  id="parkingSpot"
                  value={false}
                  onClick={handleListingChange}
                  className={` w-full  py-4 px-8 shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 text-xl font-semibold uppercase focus:shadow-md rounded-sm ${
                    !parkingSpot
                      ? "  text-white bg-slate-600"
                      : "text-black bg-white"
                  } `}
                >
                  No
                </button>
              </div>
            </div>
            {/* Address */}
            <div className=" mt-10">
              <p className=" font-bold text-xl md:text-2xl uppercase">
                Address
              </p>
              <textarea
                type="text"
                id="address"
                minLength="3"
                maxLength="50"
                value={address}
                onChange={handleListingChange}
                placeholder="Address"
                className=" py-3 px-5 w-full bg-white text-lg rounded-md border border-slate-300 outline-slate-500 my-3"
                required
              ></textarea>
            </div>
            {/* Latitude and Longitude */}
            {!geolocationEnabled && (
              <div className=" mt-10">
                <div className=" flex items-center justify-between">
                  <div>
                    <p className=" font-bold text-xl md:text-2xl uppercase">
                      Home Latitude
                    </p>
                    <input
                      type="number"
                      id="latitude"
                      min="-90"
                      max="90"
                      value={latitude}
                      onChange={handleListingChange}
                      className=" py-2 px-8 w-full bg-white text-lg text-center rounded-md border border-slate-300 outline-slate-500 my-3"
                      required
                    />
                  </div>
                  <div>
                    <p className=" font-bold text-xl md:text-2xl uppercase">
                      Home Longitude
                    </p>
                    <input
                      type="number"
                      id="longitude"
                      min="-180"
                      max="180"
                      value={longitude}
                      onChange={handleListingChange}
                      className=" py-2 px-8 w-full bg-white text-lg text-center rounded-md border border-slate-300 outline-slate-500 my-3"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Description */}
            <div className=" mt-10">
              <p className=" font-bold text-xl md:text-2xl uppercase">
                Description
              </p>
              <textarea
                type="text"
                id="description"
                value={description}
                minLength="3"
                maxLength="150"
                onChange={handleListingChange}
                placeholder="Description"
                className=" py-3 px-5 w-full bg-white text-lg rounded-md border border-slate-300 outline-slate-500 my-3"
                required
              ></textarea>
            </div>
            <div className=" mt-10">
              <p className=" font-bold text-xl md:text-2xl uppercase">Offer</p>
              <div className=" flex items-center space-x-10 my-3">
                <button
                  id="offer"
                  value={true}
                  onClick={handleListingChange}
                  className={` w-full  py-4 px-8 shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 text-xl font-semibold uppercase focus:shadow-md rounded-sm ${
                    offer ? "  text-white bg-slate-600" : "text-black bg-white"
                  }`}
                >
                  Yes
                </button>
                <button
                  id="offer"
                  value={false}
                  onClick={handleListingChange}
                  className={`w-full  py-4 px-8 shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 text-xl font-semibold uppercase focus:shadow-md rounded-sm ${
                    !offer ? "  text-white bg-slate-600" : "text-black bg-white"
                  } `}
                >
                  No
                </button>
              </div>
            </div>
            {/* Regular Price */}
            <div className=" mt-10">
              <p className=" text-xl md:text-2xl uppercase font-bold">
                Regular Price
              </p>
              <div className=" flex items-center space-x-5">
                <input
                  type="number"
                  id="regularPrice"
                  value={regularPrice}
                  onChange={handleListingChange}
                  min={50}
                  max={400000000000}
                  className="p-2 w-full lg:w-[10vw] bg-white text-lg text-center rounded-md border border-slate-300 outline-slate-500 my-3"
                  required
                />
                {type === "rent" ? (
                  <p className=" text-xl uppercase font-semibold w-full whitespace-nowrap text-slate-700">
                    ₦ / Month
                  </p>
                ) : null}
              </div>
            </div>
            {/* Discount Price */}
            {offer ? (
              <div className=" mt-10">
                <p className=" text-xl md:text-2xl uppercase font-bold">
                  Discounted Price
                </p>
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={handleListingChange}
                  min={50}
                  max={400000000000}
                  className="p-2 w-[40vw] lg:w-[10vw] bg-white text-lg text-center rounded-md border border-slate-300 outline-slate-500 my-3"
                  required={offer}
                />
              </div>
            ) : null}
            {/* Property Image */}
            <div className=" mt-5">
              <p className=" font-bold text-xl md:text-2xl uppercase">Images</p>
              <p className=" font-semibold text-lg capitalize my-1.5 whitespace-nowrap text-slate-600">
                The First Image will be the cover (max 6)
              </p>
              <input
                type="file"
                id="images"
                className=" w-full py-3 lg:py-2 px-6 lg:px-4 bg-white border border-slate-300 rounded-md focus:bg-white focus:border-slate-300 shadow-md focus:shadow-md transition-all duration-300 cursor-pointer file:cursor-pointer file:bg-slate-700 file:text-white file:border-none file:rounded-md file:p-1"
                accept=".jpg,.png,.jpeg"
                multiple
                required
                onChange={handleImages}
              />
            </div>
            <button
              type="submit"
              className=" w-full py-2 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md mt-10 text-xl uppercase text-white font-bold focus:bg-blue-600 shadow-md mb-3"
            >
              Submit Listing
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateListing;
