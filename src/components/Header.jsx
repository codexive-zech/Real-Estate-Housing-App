import { useEffect, useState } from "react";
import realtorLogo from "../assets/realtor-logo.svg";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageUrl, setPageUrl] = useState("sign In");
  const auth = getAuth();

  const handlePageUrl = () => {
    onAuthStateChanged(auth, (user) => {
      // change the Url navigation bar based on if user is authenticated or not
      if (user) {
        setPageUrl("Profile");
      } else {
        setPageUrl("Sign In");
      }
    });
  }; // functionality handling changes in Page-Url

  function getLocation(urlPath) {
    if (urlPath === location.pathname) {
      return true;
    }
  }

  useEffect(() => {
    handlePageUrl();
  }, [auth]);

  return (
    <header className=" bg-white shadow-md sticky z-20">
      <nav className=" flex items-center justify-between w-[90vw] max-w-6xl mx-auto  ">
        <div className=" flex items-center">
          <img
            src={realtorLogo}
            alt=""
            className="h-6"
            onClick={() => navigate("/")}
          />
        </div>
        <ul className=" flex items-center space-x-10 md:space-x-14">
          <li
            className={`py-4 text-sm md:text-md cursor-pointer  uppercase text-gray-500 font-semibold border-b-[3px] border-b-transparent ${
              getLocation("/") && " border-b-red-500 text-slate-900"
            }`}
            onClick={() => navigate("/")}
          >
            Home
          </li>
          <li
            className={`py-4 cursor-pointer text-sm md:text-md uppercase text-gray-500 font-semibold border-b-[3px] border-b-transparent ${
              getLocation("/offer") && "border-b-red-500 text-slate-900 "
            }`}
            onClick={() => navigate("/offer")}
          >
            Offer
          </li>
          <li
            className={`py-4 cursor-pointer text-sm md:text-md uppercase text-gray-500 font-semibold border-b-[3px] border-b-white ${
              // having both location url
              (getLocation("/sign-in") || getLocation("/profile")) &&
              "border-b-red-500 text-slate-900"
            }`}
            onClick={() => navigate("/profile")} // start with when user is authenticated
          >
            {pageUrl}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
