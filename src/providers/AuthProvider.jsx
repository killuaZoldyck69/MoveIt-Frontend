/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase.config";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const provider = new GoogleAuthProvider();
  const axiosPublic = useAxiosPublic();
  // console.log("user-->", user);

  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logoutUser = () => {
    return signOut(auth);
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const profileUpdate = (updateData) => {
    setLoading(true);
    return updateProfile(auth.currentUser, updateData);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userInfo = { email: currentUser.email };

        try {
          const response = await axiosPublic.post("/jwt", userInfo);

          if (response.data.token) {
            localStorage.setItem("access-token", response.data.token);
            console.log("JWT token stored successfully");
          } else {
            console.warn("Token not received from server");
          }
        } catch (error) {
          console.error(
            "Error generating JWT token:",
            error.response?.data || error.message
          );
        }
      } else {
        localStorage.removeItem("access-token");
        console.log("User logged out, token removed");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  const authInfo = {
    user,
    setUser,
    loading,
    dataLoading,
    setDataLoading,
    setLoading,
    loginWithGoogle,
    loginUser,
    logoutUser,
    createUser,
    profileUpdate,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
