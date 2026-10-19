import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// import Navbar from "./components/common/Navbar";
// import FindACaregiver from "./components/common/Find_a_caregiver";
// import Landing from "./components/common/Landing";
// import AboutUs from "./components/common/AboutUs";
// import CaretakerForm from "./components/common/caretaker_form";
// import ContactUs from "./components/common/contactus";
// import Chatbot from './components/common/Chatbot'; // ✅ CORRECT
import { Navbar, FindACaregiver, Landing, AboutUs, CaretakerForm, ContactUs } from "./components/UserDashboard"
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

export default function UserRoutes() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Landing isAdmin={false} /></PageWrapper>} />
          <Route path="/caregivers" element={<PageWrapper><FindACaregiver /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><AboutUs /></PageWrapper>} />
          <Route path="/caretaker_form" element={<PageWrapper><CaretakerForm /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactUs /></PageWrapper>} />

        </Routes>
      
      </AnimatePresence>
    </>
  );
}
