import realtorLogo from "../assets/realtor-logo.svg";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  function getLocation(urlPath) {
    if (urlPath === location.pathname) {
      return true;
    }
  }

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
              getLocation("/sign-in") && "border-b-red-500 text-slate-900"
            }`}
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
