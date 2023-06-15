import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Contact = ({ userRef, listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const getUserFromListing = async () => {
    const docRef = doc(db, "users", userRef);
    const snapShot = await getDoc(docRef);
    if (snapShot.exists()) {
      setLandlord(snapShot.data());
    } else {
      toast.error("Count not get Landlord Details");
    }
  };
  useEffect(() => {
    getUserFromListing();
  }, [userRef]);
  console.log(landlord);
  return (
    <>
      <div className="mt-6">
        <p className=" font-medium capitalize">
          Contact {landlord?.name} For the {listing?.propertyName.toLowerCase()}
        </p>

        <textarea
          name="message"
          cols="30"
          className=" border-2 border-gray-500 rounded-sm px-3 py-1 w-full mt-2 text-gray-700 transition-all duration-200 ease-in-out bg-white focus:bg-white focus:text-gray-700 focus:border-slate-300 shadow-md"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <a
          href={`mailto:${landlord?.email.toLowerCase()}?Subject=${
            listing?.propertyName
          }&body=${message}`}
        >
          <button className=" bg-blue-700 px-4 py-2 text-white w-full rounded-md text-lg font-semibold lg:text-xl">
            Send Message
          </button>
        </a>
      </div>
    </>
  );
};

export default Contact;
