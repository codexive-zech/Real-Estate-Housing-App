import signIn from "../assets/sign_in.svg";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { OAuthButton } from "../components";

const SignIn = () => {
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setLoginUser((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleShowPassword = () => {
    setShowPassword((prevPWState) => !prevPWState);
  };

  const { email, password } = loginUser;
  return (
    <div className=" ">
      <section className="">
        <h1 className=" text-center mt-12 font-bold text-3xl uppercase">
          Sign In
        </h1>
        <div className=" flex items-center justify-center lg:space-x-10 py-10 w-[90vw] max-w-6xl mx-auto ">
          <div className=" hidden lg:flex lg:items-center lg:w-[45%] ">
            <img src={signIn} alt="" className="h-[60vh] w-full" />
          </div>
          <div className=" w-full lg:w-[45%] mt-5 lg:mt-0">
            <form>
              <input
                type="text"
                placeholder="Email"
                className=" w-full px-4 py-2 text-lg border border-gray-600 outline-gray-500 rounded-md mb-6"
                id="email"
                value={email}
                onChange={handleInputChange}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className=" w-full px-4 py-2 text-lg border border-gray-600 outline-gray-500 rounded-md mb-6"
                  id="password"
                  value={password}
                  onChange={handleInputChange}
                />
                {showPassword ? (
                  <AiFillEyeInvisible
                    onClick={handleShowPassword}
                    className=" absolute right-3 top-3 text-xl cursor-pointer"
                  />
                ) : (
                  <AiFillEye
                    onClick={handleShowPassword}
                    className=" absolute right-3 top-3  text-xl cursor-pointer"
                  />
                )}
              </div>
              <div className=" flex items-center justify-between whitespace-nowrap text-sm md:text-md lg:text-lg capitalize mb-6">
                <p>
                  You do not have an account
                  <span className=" text-red-600 hover:text-red-700 active:text-red-800 transition-colors duration-300 ease-in-out ml-1">
                    <Link to="/sign-up">Register</Link>
                  </span>
                </p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors duration-300 ease-in-out"
                >
                  Forgot Password
                </Link>
              </div>
              <button
                className=" w-full bg-blue-500 py-2 px-5 rounded-md font-semibold uppercase shadow-md hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 text-white mb-3"
                type="submit"
              >
                Sign In
              </button>
              <div className=" flex items-center before:flex-1 before:border-t before:border-gray-400 after:flex-1 after:border-t after:border-gray-400 ">
                <p className=" text-center font-bold mx-4">OR</p>
              </div>
              <OAuthButton />
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
