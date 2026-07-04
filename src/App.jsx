import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./supabase";

import Navbar from "./komponen/Navbar";
import Footer from "./komponen/Footer";
import WelcomeModal from "./komponen/WelcomeModal";

import Home from "./halaman/Home";
import Portfolio from "./halaman/Portfolio";
import Commission from "./halaman/Commission";
import Order from "./halaman/Order";
import Ulasan from "./halaman/Ulasan";
import Reviews from "./halaman/Reviews";
import Admin from "./halaman/Admin";

export default function App() {
  const [visitorName, setVisitorName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const savedName = localStorage.getItem("visitor_name");

      if (session && savedName) {
        // Ada session Supabase yang valid → admin
        setVisitorName(savedName);
        setIsAdmin(true);
      } else if (savedName && !session) {
        // Ada nama tapi tidak ada session → visitor biasa
        setVisitorName(savedName);
        setIsAdmin(false);
      } else {
        // Belum pernah masuk → tampilkan modal
        setShowModal(true);
      }
      setAuthChecked(true);
    }

    checkSession();

    // Listen perubahan auth (kalau session expired / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleEnter(name, adminStatus) {
    setVisitorName(name);
    setIsAdmin(adminStatus);
    setShowModal(false);
  }

  async function handleLogout() {
    // Kalau ada session admin, akhiri juga session Supabase-nya
    if (isAdmin) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("visitor_name");
    setVisitorName(null);
    setIsAdmin(false);
    setShowModal(true);
  }

  // Tunggu auth check selesai dulu biar gak flicker
  if (!authChecked) return null;

  return (
    <BrowserRouter>
      {showModal && <WelcomeModal onEnter={handleEnter} />}

      <Navbar
        isAdmin={isAdmin}
        visitorName={visitorName}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={<Home visitorName={visitorName} isAdmin={isAdmin} />}
        />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/commission" element={<Commission />} />
        <Route path="/order" element={<Order visitorName={visitorName} />} />
        <Route path="/ulasan" element={<Ulasan visitorName={visitorName} />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/admin" element={<Admin isAdmin={isAdmin} />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
