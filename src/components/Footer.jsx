import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <div className=" relative">
      <div className=" flex items-center justify-center bg-white text-black p-5">
        <p className=" font-bold text-xl flex items-center">
          Copyright 2023. Made With <FaHeart /> By Codexive Zech
        </p>
      </div>
    </div>
  );
};

export default Footer;
