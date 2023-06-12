import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, PrivateRoute, Spinner } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense } from "react";
import SingleListing from "./pages/SingleListing";

const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Offer = lazy(() => import("./pages/Offer"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const EditListing = lazy(() => import("./pages/EditListing"));

function App() {
  return (
    <>
      <Router>
        <Header />
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/offer" element={<Offer />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/create-listing" element={<PrivateRoute />}>
              <Route path="/create-listing" element={<CreateListing />} />
            </Route>
            <Route path="/category" element={<PrivateRoute />}>
              <Route
                path="/category/:categoryType/:listingId"
                element={<SingleListing />}
              />
            </Route>
            <Route path="/edit-listing" element={<EditListing />}>
              <Route
                path="/edit-listing/:listingId"
                element={<EditListing />}
              />
            </Route>
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
