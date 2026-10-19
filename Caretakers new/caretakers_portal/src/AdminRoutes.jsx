// import { Routes, Route, useLocation } from "react-router-dom";
// import { AnimatePresence, motion } from "framer-motion";

// import AdminNavbar from "./components/AdminDashboard/Admin";
// import FindACaregiver from "./components/common/Find_a_caregiver";
// import AboutUs from "./components/common/AboutUs";
// import CaretakerForm from "./components/common/caretaker_form";
// import Landing from "./components/common/Landing";
// import NewApplications from '.components/AdminDashboard/NewApplications'; // adjust path as needed



// export default function AdminRoutes() {
//   const location = useLocation();

//   return (
//     <>
//          <AdminNavbar/>
//          <AnimatePresence mode="wait">
//            <Routes location={location} key={location.pathname}>
//              <Route path="/admin-dashboard/home" element={<PageWrapper><Landing/></PageWrapper>} />
//              <Route path="/admin-dashboard/caregivers" element={<PageWrapper><FindACaregiver /></PageWrapper>} />
//              <Route path="/admin-dashboard/about" element={<PageWrapper><AboutUs /></PageWrapper>} />
//              <Route path="/admin-dashboard/caretaker_form" element={<CaretakerForm />} />

//            </Routes>
//          </AnimatePresence>

//          </>
//   );
// }
