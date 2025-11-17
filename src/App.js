import React, { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TheatreSelectionPage from "./pages/TheatreSelectionPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import SignUpPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";
import PaymentPage from "./pages/PaymentPage";

function App() {
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [userData, setUserData] = useState({});

  // Check for expired JWT token and clear localStorage if expired
  useEffect(() => {
    const localData = localStorage.getItem("jwt_token");
    if (localData) {
      try {
        const time = JSON.parse(localData);

        // Check token expiration every minute
        const intervalId = setInterval(() => {
          const now = new Date().getTime();
          const diff = now - time.time;

          // Clear localStorage if token is older than 1 hour
          if (diff > 60 * 60 * 1000) {
            localStorage.clear();
            clearInterval(intervalId);
          }
        }, 60000); // Check every minute instead of every second

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
      } catch (error) {
        // Invalid JSON in localStorage, clear it
        localStorage.clear();
      }
    }
  }, []);

  return (
    <div className="App" >
      {signup && (
        <SignUpPage
          setSignup={setSignup}
          checkSignup={signup}
          setLogin={setLogin}
          setUserData={setUserData}
          // checkLogin={login}
        />
      )}

      {!signup && (
        <BrowserRouter>
          <Header
            setLogin={setLogin}
            checkLogin={login}
            setSignup={setSignup}
            checkSignup={signup}
          />
          <Routes>
            <Route
              exact
              path="/"
              element={
                <LandingPage
                  setLogin={setLogin}
                  checkLogin={login}
                  setSignup={setSignup}
                  checkSignup={signup}
                  setUserData={setUserData}
                />
              }
            />
            <Route
              exact
              path="/theatreSelection"
              element={
                <TheatreSelectionPage
                  setLogin={setLogin}
                  checkLogin={login}
                  setSignup={setSignup}
                  checkSignup={signup}
                  setUserData={setUserData}
                />
              }
            />
            <Route
              exact
              path="/seatSelection"
              element={
                <SeatSelectionPage
                  setLogin={setLogin}
                  checkLogin={login}
                  setSignup={setSignup}
                  checkSignup={signup}
                  setUserData={setUserData}
                />
              }
            />
            <Route
              exact
              path="/user"
              element={
                <UserPage setUserData={setUserData} userData={userData} />
              }
            />
            <Route exact path="/payment" element={<PaymentPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
