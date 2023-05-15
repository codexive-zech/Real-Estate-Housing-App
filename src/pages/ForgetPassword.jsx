import { Link } from "react-router-dom";
import { OAuthButton } from "../components";
import forgotPassword from "../assets/sign_in.svg";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth(); // initialize the authentication
      await sendPasswordResetEmail(auth, email); // sending an email to an authorized user based on the email
      toast.success("Email Sent Successfully");
    } catch (error) {
      toast.error("Invalid Email");
    }
  };

  return (
    <div className=" ">
      <section className="">
        <h1 className=" text-center mt-12 font-bold text-3xl uppercase">
          Forgot Password
        </h1>
        <div className=" flex items-center justify-center lg:space-x-10 py-10 w-[90vw] max-w-6xl mx-auto ">
          <div className=" hidden lg:flex lg:items-center lg:w-[45%] ">
            <img src={forgotPassword} alt="" className="h-[60vh] w-full" />
          </div>
          <div className=" w-full lg:w-[45%] mt-5 lg:mt-0">
            <form onSubmit={handleForgotPassword}>
              <input
                type="text"
                placeholder="Email"
                className=" w-full px-4 py-2 text-lg border border-gray-600 outline-slate-700 rounded-md mb-6 bg-white text-slate-500"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className=" flex items-center justify-between whitespace-nowrap text-sm md:text-md lg:text-lg capitalize mb-6">
                <p>
                  Did not forget password
                  <span className=" text-red-600 hover:text-red-700 active:text-red-800 transition-colors duration-300 ease-in-out ml-1">
                    <Link to="/sign-in">Login</Link>
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
                Reset Password
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

export default ForgetPassword;
