import { useState } from "react";

const CreateListing = () => {
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
  } = listingData;
  const handleListingChange = (e) => {
    setListingData({});
  };
  return (
    <section className=" relative my-8">
      <div className=" w-[85vw] max-w-6xl mx-auto">
        <h2 className=" text-center text-2xl lg:text-3xl uppercase font-bold mt-12">
          Create a Home Listing
        </h2>
        <div className="w-full lg:max-w-lg mt-6 mx-auto ">
          <form>
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
                  className={` w-full bg-white py-4 px-8 shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 text-xl font-semibold uppercase focus:bg-white focus:shadow-md rounded-sm  ${
                    type === "sell" && "  text-white bg-slate-800"
                  }`}
                >
                  Sell
                </button>
                <button
                  type="button"
                  id="type"
                  value="rent"
                  onClick={handleListingChange}
                  className={` w-full bg-white py-4 px-8 shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 text-xl font-semibold uppercase focus:bg-white focus:shadow-md rounded-sm ${
                    type === "rent" && "  text-white bg-slate-800"
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
                  className={` w-full bg-white shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 px-8 py-4 text-xl font-semibold uppercase rounded-sm ${
                    furnished && " text-white bg-slate-700"
                  } `}
                >
                  Yes
                </button>
                <button
                  type="button"
                  id="furnished"
                  value={false}
                  onClick={handleListingChange}
                  className={` w-full bg-white shadow-md hover:shadow-lg active:shadow-xl transition-shadow duration-300 px-8 py-4 text-xl font-semibold  uppercase rounded-sm ${
                    !furnished && " text-white bg-slate-700"
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
                  className={` w-full px-8 py-4 bg-white rounded-sm shadow-md hover:shadow-lg active:shadow-xl text-xl font-semibold  uppercase ${
                    parkingSpot && " text-white bg-slate-700"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  id="parkingSpot"
                  value={false}
                  onClick={handleListingChange}
                  className={` w-full px-8 py-4 bg-white rounded-sm shadow-md hover:shadow-lg active:shadow-xl text-xl font-semibold uppercase ${
                    !parkingSpot && " text-white bg-slate-700"
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
                maxLength="50"
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
                  className={` w-full px-8 py-4 bg-white rounded-sm shadow-md hover:shadow-lg active:shadow-xl text-xl font-semibold  uppercase ${
                    offer && "bg-slate-700 text-white"
                  }`}
                >
                  Yes
                </button>
                <button
                  id="offer"
                  value={false}
                  onClick={handleListingChange}
                  className={`w-full px-8 py-4 bg-white rounded-sm shadow-md hover:shadow-lg active:shadow-xl text-xl font-semibold  uppercase ${
                    !offer && "bg-slate-700 text-white"
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
                    $ / Month
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
