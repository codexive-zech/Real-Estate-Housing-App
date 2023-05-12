import { Link } from "react-router-dom";
import { OAuthButton } from "../components";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import signUp from "../assets/sign_in.svg";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [registerUser, setRegisterUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setRegisterUser((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleShowPassword = () => {
    setShowPassword((prevPWState) => !prevPWState);
  };

  const { name, email, password } = registerUser;

  const handleUserSignup = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth(); // initialize the authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // create user detail based on email and password
      updateProfile(auth.currentUser, {
        displayName: name,
      }); // update the display name for authenticated users to the name provided by the user
      const user = userCredential.user;
      const registerUserCopy = { ...registerUser }; // get all register user value
      delete registerUserCopy.password; // delete the password from the register user collection before sending to the database
      registerUserCopy.timestamp = serverTimestamp(); // adding a registration timestamp fro each user
      await setDoc(doc(db, "users", user.uid), registerUserCopy); // adding the registered user to the database
      toast.success("Signed In Successfully");
      setTimeout(() => {
        navigate("/");
      }, 300); // redirect to home page when user is registered successfully
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };
  return (
    <div className=" ">
      <section className="">
        <h1 className=" text-center mt-12 font-bold text-3xl uppercase">
          Create An Account
        </h1>
        <div className=" flex items-center justify-center lg:space-x-10 py-10 w-[90vw] max-w-6xl mx-auto ">
          <div className=" hidden lg:flex lg:items-center lg:w-[45%] ">
            <img src={signUp} alt="" className="h-[60vh] w-full" />
          </div>
          <div className=" w-full lg:w-[45%] mt-5 lg:mt-0">
            <form onSubmit={handleUserSignup}>
              <input
                type="text"
                placeholder="Name"
                className=" w-full px-4 py-2 text-lg border border-gray-600 outline-slate-700 rounded-md mb-6 bg-white text-slate-500"
                id="name"
                value={name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Email"
                className=" w-full px-4 py-2 text-lg border border-gray-600 outline-slate-700 rounded-md mb-6 bg-white text-slate-500"
                id="email"
                value={email}
                onChange={handleInputChange}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className=" w-full px-4 py-2 text-lg border border-gray-600 outline-gray-500 rounded-md mb-6 bg-white "
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
                  Have an account
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

export default SignUp;
