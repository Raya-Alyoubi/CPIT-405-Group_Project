import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Departments from "./pages/Departments";
import DepartmentDetail from "./pages/DepartmentDetail";
import Likes from "./pages/Likes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/:id" element={<DepartmentDetail />} />
            <Route path="/likes" element={<Likes />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
