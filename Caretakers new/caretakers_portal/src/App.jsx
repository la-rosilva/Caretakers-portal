import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from './UserRoutes';               // <-- New
import AdminDashboard from './components/AdminDashboard/Admin'; // Main admin wrapper
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
      </Routes>
      <ToastContainer theme="colored"/>
    </Router>
  );
}
