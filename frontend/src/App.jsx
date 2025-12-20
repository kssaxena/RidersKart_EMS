import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Route, Routes } from "react-router-dom";
import RegisterHead from "./components/ui/registerHead";
import LoginHead from "./components/ui/loginHead";
import Header from "./components/header";
import Hero from "./pages/hero/hero";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<LoginHead />} />
        <Route path="/register" element={<RegisterHead />} />
      </Routes>
    </>
  );
}

export default App;
