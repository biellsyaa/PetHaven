import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import PetList from "./pages/PetList";
import PetDetail from "./pages/PetDetail";

import LoginShelter from "./pages/shelter/LoginShelter";
import RegisterShelter from "./pages/shelter/RegisterShelter";
import DashboardShelter from "./pages/shelter/DashboardShelter";
import AddPet from "./pages/shelter/AddPet";
import ShelterProfile from "./pages/shelter/ShelterProfile";

import LoginAdmin from "./pages/admin/LoginAdmin";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Verification from "./pages/admin/Verification";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="container">
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/:id" element={<PetDetail />} />

          {/* SHELTER AUTH */}
          <Route path="/shelter/login" element={<LoginShelter />} />
          <Route path="/shelter/register" element={<RegisterShelter />} />

          {/* SHELTER PROTECTED ROUTES */}
          <Route
            path="/shelter/dashboard"
            element={
              <ProtectedRoute role="shelter">
                <DashboardShelter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shelter/add-pet"
            element={
              <ProtectedRoute role="shelter">
                <AddPet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shelter/profile"
            element={
              <ProtectedRoute role="shelter">
                <ShelterProfile />
              </ProtectedRoute>
          }
          />

          {/* ADMIN AUTH */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* ADMIN PROTECTED ROUTES */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verification"
            element={
              <ProtectedRoute role="admin">
                <Verification />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}