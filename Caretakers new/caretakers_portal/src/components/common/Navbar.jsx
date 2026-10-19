
import React, { useState,useEffect } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Form, Input, Button } from "antd";
import { Link ,useNavigate} from 'react-router-dom'; // Import Link for routing
import logo from '../../assets/icon.png';
import CloseIcon from '../../assets/close.png';

const Navbar = () => {
    const [showAuthPortal, setAuthPortal] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
    const[showAdminlogin,setAdminlogin]=useState(false);
    const [adminPasskey, setAdminPasskey] = useState('');
    const navigate = useNavigate();//To redirect to Admin Dashboard on success
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // ✅ sets true if token exists
      }, []);
      

    const handleLogin = async (values) => {
        console.log("Login values:", values);
        try {
          const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
      
          if (!response.ok) {
            const errorText = await response.text(); // Get the response text
            console.error("Error response:", errorText); // Log the error response
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log("Login response data:", data); 
      
          if (data.token) {
            localStorage.setItem("token", data.token);
            setIsLoggedIn(true); 
            console.log("JWT token saved to localStorage");
          } else {
            console.warn("No token received in response!");
          }
      
          if (data.id) {
            localStorage.setItem("id", data.id); 
            console.log("User ID saved to localStorage:", data.id);
          } else {
            console.warn("No user ID received in response!");
          }
      
          toast.success("Login Successful!", {
            position: "top-right",
            autoClose: 5000,
            theme: "colored"
          });
      
          setAuthPortal(false); // Close the dialog on successful login
      
        } catch (error) {
          console.error("Login error:", error);
          toast.error("User not Registered.");
        }
      };

      const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false); // ✅ update state
        toast.success("Logged out successfully!");
        navigate("/"); // or to home
      };
      
      
  
    const handleAdminLogin = async (values) => {
        try {
            console.log("Attempting admin login with:", values);
           
            const response = await fetch("/auth/admin-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ passkey: values.passkey }),
            });
    
            console.log("Admin login response status:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Admin login error response:", errorText);
                
                if (response.status === 404) {
                    toast.error("Admin login endpoint not found. Please check server configuration.");
                } else {
                    toast.error(`Server error: ${response.status}`);
                }
                return;
            }
    
            const data = await response.json();
            toast.success("Admin Login Successful", {
                position: "top-right",
                autoClose: 5000,
                theme: "colored"
            });
            setAdminlogin(false);
            navigate('/admin-dashboard'); // Using navigate from useNavigate()
        } catch (error) {
            console.error("Admin login error:", error);
            toast.error("Admin Login unsuccessful");
        }
    };
    const handleSignup = async (values) => {
        try {
            const response = await fetch("/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Registered Successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored"
                });
                setAuthPortal(false);
               // navigate('/admin-dashboard'); // Close the dialog on successful signup
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("An error occurred during signup.");
        }
    };

    return (
        <div className='h-14 fixed py-3 w-full bg-cyan-600 flex items-center justify-between z-10'>
            <div className='flex items-center'>
                <img src={logo} className='w-10 h-10 mx-2' />
                <h6 className='text-white text-lg translate-y-0.7 font-semibold py-3'>CareConnect</h6>
            </div>
                    <Link to="/" className="relative px-10 text-gray-50 text-md group">
   Home
   <span className="absolute left-9 -bottom-1 w-0 h-[2px] bg-gray-300 transition-all duration-300 group-hover:w-13"></span> </Link>
 <Link to="/caregivers" className="relative px-10 text-gray-50 text-md  group">
   Find a caregiver
   <span className="absolute left-9 -bottom-1 w-0 h-[2px] bg-gray-300 transition-all duration-300 group-hover:w-30"></span>
 </Link>
 <Link to="/about" className="relative px-10 text-gray-50 text-md  group">
   About Us
   <span className="absolute left-8 -bottom-1 w-0 h-[2px] bg-gray-300 transition-all duration-300 group-hover:w-20"></span>
 </Link>
 <Link to="/contact" className="relative px-10 text-gray-50 text-md  group">
   Contact Us
   <span className="absolute left-9 -bottom-1 w-0 h-[2px] bg-gray-300 transition-all duration-300 group-hover:w-23"></span>
 </Link>

            <div className='flex gap-2.5 mb-5 -translate-x-2'>
            {!isLoggedIn ? (
    <Button
      type='ghost'
      className="w-[100px] mt-4 !text-cyan-600 !bg-white hover:!bg-gray-200 transition-all duration-300"
      onClick={() => setAuthPortal(true)}
    >
      Login
    </Button>
  ) : (
    <Button
      type='ghost'
      className="w-[100px] mt-4 !text-red-500 !bg-white hover:!bg-gray-200 transition-all duration-300"
      onClick={handleLogout}
    >
      Logout
    </Button>
  )}
  
            </div>

            <Dialog open={showAuthPortal} onClose={() => setAuthPortal(false)} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity"/>
                <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-sm bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 sm:h-[70vh]"
             >
                        <div className="px-6 py-12 lg:px-8 -mt-3">
                            <img src={CloseIcon} alt="Close" className="absolute w-5 h-5 top-4 right-4 cursor-pointer hover:bg-gray-100 transition-all duration-300" onClick={() => setAuthPortal(false)} />
                            <DialogTitle className="text-center text-2xl font-bold text-cyan-600">{isLogin ? "Login" : "Create an Account"}</DialogTitle>

                            <Form layout="vertical" className="mt-6" onFinish={isLogin ? handleLogin : handleSignup}>
                                <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter your email" }]}>
                                    <Input type="email" />
                                </Form.Item>

                                <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter your password" }]}>
                                    <Input.Password />
                                </Form.Item>

                                {!isLogin && (
                                    <Form.Item
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        dependencies={['password']}
                                        rules={[
                                            { required: true, message: "Please confirm your password" },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error("Passwords do not match!"));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                )}

                                <Button type='ghost' className='!bg-cyan-600 left-1/2 -translate-x-1/2 !text-white hover:!bg-cyan-700  !w-1/2' htmlType="submit">{isLogin ? "Login" : "Sign Up"}</Button>
                            </Form>

                            <div className="text-center mt-4">
                                <span className='text-gray-400'>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                                <Button type="link" className='!text-cyan-600 !font-medium hover:!text-cyan-500' onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? "Create an Account" : "Login"}
                                </Button>
                                <Button type="link" className='!text-cyan-600 !font-medium hover:!text-cyan-500' onClick={() => {setAdminlogin(true),setAuthPortal(false)}}>
                                    {isLogin ? "Admin Login" : ""}
                                </Button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
            <Dialog open={showAdminlogin} onClose={() => setAdminlogin(false)} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity"/>
                <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-sm bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 sm:h-[60vh]"
             >
                        <div className="px-6 py-12 lg:px-8 -mt-3">
                            <img src={CloseIcon} alt="Close" className="absolute w-5 h-5 top-4 right-4 cursor-pointer hover:bg-gray-100 transition-all duration-300" onClick={() => setAdminlogin(false)} />
                            <DialogTitle className="text-center text-2xl font-bold text-cyan-600">Admin Login</DialogTitle>

                            <Form layout="vertical" className="mt-6" onFinish={handleAdminLogin}>
                            <Form.Item
                                    name="passkey"
                                    label="Admin Passkey"
                                    rules={[{ required: true, message: "Please enter the admin passkey" }]}
                                >
                                   <Input.Password/>
                                   </Form.Item>
                                
                               

                            


                                
                                <Button type='ghost' className='!bg-cyan-600 left-1/2 -translate-x-1/2 !text-white hover:!bg-cyan-700  !w-1/2' htmlType="submit">Login</Button>
                            </Form>

                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};

export default Navbar;