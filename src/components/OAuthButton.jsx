import { FcGoogle } from "react-icons/fc";

const OAuthButton = () => {
  return (
    <>
      <button
        className=" mt-3 w-full bg-red-500 py-2 px-5 rounded-md font-semibold uppercase shadow-md hover:bg-red-600 active:bg-red-700 transition-all duration-300 text-white mb-3 flex items-center justify-center"
        type="submit"
      >
        <FcGoogle className=" bg-white rounded-full text-2xl p-1 mr-3" />
        Continue With Google
      </button>
    </>
  );
};

export default OAuthButton;
