import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuthUser() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [checkLoadingStatus, setCheckLoadingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      }
      setCheckLoadingStatus(false);
    });
  }, []);

  return { userLoggedIn, checkLoadingStatus };
}
