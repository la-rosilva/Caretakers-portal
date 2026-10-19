
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { AnimatePresence, motion } from "framer-motion";
import FindACaregiver from "../common/Find_a_caregiver";
import Landing from "../common/Landing";
import AboutUs from "../common/AboutUs";
import CaretakerForm from "../common/caretaker_form";
import ContactUs from "../common/contactus";
import NewApplications from './NewApplications';
import ViewBookings from "./ViewBookings";
const PageWrapper = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );

export default function AdminDashboard() {
    const location = useLocation();

  return (
    <AdminLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="home" />} />
              <Route path="home" element={<PageWrapper><Landing isAdmin={true} /></PageWrapper>} />
              <Route path="caregivers" element={<PageWrapper><FindACaregiver /></PageWrapper>} />
              <Route path="about" element={<PageWrapper><AboutUs /></PageWrapper>} />
              <Route path="caretaker_form" element={<PageWrapper><CaretakerForm /></PageWrapper>} />
              <Route path="new_applications" element={<NewApplications />} />
              <Route path="view_bookings" element={<PageWrapper><ViewBookings /></PageWrapper>} />
              <Route path="contact" element={<PageWrapper><ContactUs /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
    </AdminLayout>
  );
}
