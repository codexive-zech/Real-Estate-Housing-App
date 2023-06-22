import { useState, useEffect } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
  Avatar,
} from "@material-tailwind/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Logo from "../assets/logo.png";
import avatarPerson from "../assets/avatar.svg";
import { useLocation, useNavigate } from "react-router-dom";

const NavbarTop = () => {
  const [openNav, setOpenNav] = useState(false);
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [pageUrl, setPageUrl] = useState("sign In");

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
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  useEffect(() => {
    handlePageUrl();
  }, [auth]);

  useEffect(() => {
    console.log(auth.currentUser);
  }, [auth.currentUser]);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-5 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-[5vw]">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <li
          className={`py-1 text-sm cursor-pointer  uppercase text-gray-500 font-semibold border-b-[3px] border-b-transparent ${
            getLocation("/") && " border-b-red-500 text-gray-900"
          }`}
          onClick={() => navigate("/")}
        >
          Home
        </li>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <li
          className={`py-1 text-sm  cursor-pointer  uppercase text-gray-500 font-semibold border-b-[3px] border-b-transparent ${
            getLocation("/offer") && " border-b-red-500 text-gray-900"
          }`}
          onClick={() => navigate("/offer")}
        >
          Offer
        </li>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <li
          className={`py-1 text-sm cursor-pointer  uppercase text-gray-500 font-semibold border-b-[3px] border-b-transparent ${
            // having both location url
            (getLocation("/sign-in") || getLocation("/profile")) &&
            "border-b-red-500 text-gray-900"
          }`}
          onClick={() => navigate("/profile")}
        >
          {pageUrl}
        </li>
      </Typography>
    </ul>
  );
  return (
    <>
      <Navbar className=" rounded-none bg-white mx-auto max-w-none sticky z-30 shadow-md">
        <div className=" flex items-center justify-between text-blue-gray-900 max-w-6xl mx-auto cursor-pointer">
          <img
            onClick={() => navigate("/")}
            src={Logo}
            className=" h-6"
            alt=""
          />
          <div className="hidden lg:block">{navList}</div>
          {auth.currentUser && (
            <div className="hidden lg:flex items-center ">
              <Avatar
                variant="circular"
                size="sm"
                alt={auth.currentUser.displayName}
                className="border border-[#E15659] p-0.5"
                src={auth.currentUser?.photoURL || avatarPerson}
              />
            </div>
          )}
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
        <MobileNav open={openNav} className=" mt-4 lg:mt-0">
          <div className="container mx-auto text-center ">{navList}</div>
        </MobileNav>
      </Navbar>
    </>
  );
};

export default NavbarTop;
