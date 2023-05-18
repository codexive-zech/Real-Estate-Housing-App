import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeUserInfo, setChangeUserInfo] = useState(false);
  const [loggedUser, setLoggedUser] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = loggedUser;

  const handleNameChange = (e) => {
    setLoggedUser((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleProfileUpdate = async () => {
    console.log(changeUserInfo);
    console.log("Just Logging");
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        }); // updating the display name inside of the auth

        const docRef = doc(db, "users", auth.currentUser.uid); // make a copy of all the values available in the collection
        await updateDoc(docRef, {
          name,
        }); // update the name in the user doc of the firestore user collection
      } // update as long as the display name from auth is different from the name input value
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error("Could Not Update Profile");
    }
  };

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
                className={`w-full px-4 py-3 mb-6 text-xl text-gray-800 border border-gray-300 rounded-md bg-white ${
                  changeUserInfo ? "bg-green-200 focus:bg-green-200" : null
                }`}
                id="name"
                value={name}
                disabled={!changeUserInfo}
                onChange={handleNameChange}
              />
              <input
                type="text"
                className=" w-full px-4 py-3 mb-4 text-xl text-gray-800 border border-gray-300 rounded-md bg-white"
                id="email"
                value={email}
                disabled
              />
              <div className=" flex items-center justify-between text-sm md:text-lg whitespace-nowrap">
                <p>
                  Do You Wish To Change Name?
                  <span
                    className="text-red-600 hover:text-red-700 transition-colors duration-300 cursor-pointer font-semibold ml-2"
                    onClick={() => {
                      changeUserInfo ? handleProfileUpdate() : null;
                      setChangeUserInfo((prevState) => !prevState);
                    }}
                  >
                    {changeUserInfo ? "Apply Change" : "Edit"}
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
