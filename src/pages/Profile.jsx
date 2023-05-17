import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = loggedUser;

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
    toast.success("Logged Out Successfully");
  };
  return (
    <>
      <section className=" relative">
        <div className=" w-[90vw] max-w-6xl mx-auto flex items-center justify-center flex-col">
          <h1 className=" text-2xl lg:text-4xl font-semibold uppercase text-center mt-8">
            My Profile
          </h1>
          <div className=" w-[50%] mt-6">
            <form>
              <input
                type="text"
                className=" w-full px-4 py-3 mb-6 text-xl text-gray-800 border border-gray-300 rounded-md bg-white"
                id="name"
                value={name}
                disabled
              />
              <input
                type="text"
                className=" w-full px-4 py-3 mb-4 text-xl text-gray-800 border border-gray-300 rounded-md bg-white"
                id="email"
                value={email}
                disabled
              />
              <div className=" flex items-center justify-between text-sm md:text-lg whitespace-nowrap">
                <p className="  ">
                  Do You Wish To Change Name?
                  <span className="text-red-600 hover:text-red-700 transition-colors duration-300 cursor-pointer font-semibold ml-2">
                    Edit
                  </span>
                </p>
                <p
                  className=" font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer"
                  onClick={handleLogout}
                >
                  Sign Out
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
