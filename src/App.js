import React, { useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TheatreSelectionPage from "./pages/TheatreSelectionPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import SignUpPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";
import PaymentPage from "./pages/PaymentPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BlockchainContextProvider } from "./blockchain";

function AppContent() {
  const { signup } = useAuth();

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
    <div className="App">
      {signup && <SignUpPage />}

      {!signup && (
        <BrowserRouter>
          <Header />
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route exact path="/theatreSelection" element={<TheatreSelectionPage />} />
            <Route exact path="/seatSelection" element={<SeatSelectionPage />} />
            <Route exact path="/user" element={<UserPage />} />
            <Route exact path="/payment" element={<PaymentPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BlockchainContextProvider>
        <AppContent />
      </BlockchainContextProvider>
    </AuthProvider>
  );
}

export default App;
