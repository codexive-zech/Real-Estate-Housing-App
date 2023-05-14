import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const OAuthButton = () => {
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const auth = getAuth(); // initialize the authentication
      const provider = new GoogleAuthProvider(); // instantiate a new Google Auth Provider
      const result = await signInWithPopup(auth, provider); // signing in user based on the auth and provider
      const user = result.user; // get user signed in
      const docRef = doc(db, "users", user.uid); // make a copy of all the values available in the collection
      const docSnap = await getDoc(docRef); // setting the doc to the copy gotten initially

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        }); // set the new doc collection value
      } // checking to see if this new user is not available in the initial document

      toast.success("Signed In Successfully");
      navigate("/"); // redirect to home page when user is registered successfully
    } catch (error) {
      console.log(error);
      toast.error("Could Not Authorize with Google");
    }
  };

  return (
    <>
      <button
        onClick={handleGoogleAuth}
        className=" mt-3 w-full bg-red-500 py-2 px-5 rounded-md font-semibold uppercase shadow-md hover:bg-red-600 active:bg-red-700 transition-all duration-300 text-white mb-3 flex items-center justify-center"
        type="button"
      >
        <FcGoogle className=" bg-white rounded-full text-2xl p-1 mr-3" />
        Continue With Google
      </button>
    </>
  );
};

export default OAuthButton;
