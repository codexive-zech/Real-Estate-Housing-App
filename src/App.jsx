import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Profile, Offer, SignIn, SignUp } from "./pages";
import { Header } from "./components";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="offer" element={<Offer />} />
          <Route path="sign-up" element={<SignIn />} />
          <Route path="sign-in" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
