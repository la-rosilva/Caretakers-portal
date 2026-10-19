import { useEffect, useRef, useState } from "react";

import { Form, Input, DatePicker, Select, Upload, Button, Radio, InputNumber,Cascader } from "antd";
import { toast } from 'react-toastify';

import moment from 'moment'; // ES6 import syntax
import { SearchOutlined } from '@ant-design/icons'; // Add this import


import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'


import CloseIcon from '../../assets/close.png';

import About from '../../assets/user.png';
import React from "react";




const CaretakerForm = () => {
  const [form] = Form.useForm();
  const [cards, setCards] = useState([]); // Store the fetched data
  const [showProfile, setShowProfile] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]); //added new
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showBookingportal,setBookingportal]=useState(false);


  useEffect(() => {
    fetch("/auth/cards") // Request to fetch data
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => setCards(data)) // Store the response data in the state
      .catch((error) => console.error("Error fetching data:", error)); // Handle errors
  }, []);



  const getProfessionalTitle = (pr_sp) => {
    console.log('Original pr_sp:', pr_sp);  
    
    const map = {
      'physiotherapy': 'Physiotherapist',
      'elderly care': 'Geriatrician',
      'child care': 'Babysitter',
      'dementia care': 'Dementia Care Specialist',
      'housekeeping': 'Housekeeper',
      'culinary assistance': 'Cook',
      'nursing': 'Nurse',
      'post-surgery assistance': 'Postoperative Caregiver'
    };
    
    const cleanedPrSp = pr_sp.toLowerCase().trim();  // Clean the input
    console.log('Cleaned pr_sp:', cleanedPrSp);  // Log cleaned input
    
    return map[cleanedPrSp] || 'No Title Available';
  };
  

  const filteredCards = cards.filter(card => {
    const searchTermLower = searchTerm.toLowerCase();
    const mappedTitle = getProfessionalTitle(card.pr_sp); 
    return (
      card.first_name.toLowerCase().includes(searchTermLower) ||
      card.last_name.toLowerCase().includes(searchTermLower) ||
      mappedTitle.toLowerCase().includes(searchTermLower) || 
      (card.emp_type && card.emp_type.toLowerCase().includes(searchTermLower)) // For languages
    );
  });

  
  

  
  const handleConfirmBooking = async (formValues) => {
    try {
      console.log("Form values:", formValues);
  
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please Login!");
        return;
      }
  
      if (!selectedProfile) {
        toast.error("Please select a caretaker profile first!");
        return;
      }
  
      if (!selectedProfile?.c_id) {
        toast.error("Caretaker ID is missing or invalid!");
        return;
      }
  
      const userId = localStorage.getItem('id'); 
      console.log("Stored user ID in localStorage:", localStorage.getItem('id'));
      console.log("Stored token in localStorage:", localStorage.getItem('token'));

      if (!userId) {
        toast.error("User ID is not available. Please log in!");
        return;
      }
  
      const payload = {
        c_id: selectedProfile?.c_id,
        customer_name: formValues.full_name,
        customer_phone_number: formValues.phone_number,
        start_date: moment(formValues.start_date).format('YYYY-MM-DD'),
        days_per_week: formValues.days_per_week || 0,
        hours_worked: formValues.hours_per_day || 0,
        is_full_time: selectedProfile?.emp_type?.toLowerCase() === "full-time",
        user_id: parseInt(userId), 
      };
  
      console.log("Payload being sent:", payload);
  
      const response = await fetch('/auth/book-caretaker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Booking confirmed", responseData);
        toast.success("Booking confirmed successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error booking caretaker", errorData);
        toast.error(`Error: ${errorData.message || "Booking failed!"}`);
      }
    } catch (error) {
      console.error("Error during form submission", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  
 

  const handleOpenProfile = (card) => {
   
    setSelectedProfile(card);
    setShowProfile(true); 
  };

  
  
  


  const handleBookingPortal = (card) => {
    const token = localStorage.getItem('token');
  
    if (!token || token === "undefined" || token.trim() === "") {
      toast.error("Please Log in", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
  
 
    setSelectedProfile(card);
    setBookingportal(true);
  };
  
  const generateAbout = (card) => {
    const base = `Meet ${card.first_name} ${card.last_name}, a reliable and experienced professional with expertise in ${card.pr_sp.toLowerCase()}. With ${card.prev_exp} year${card.prev_exp !== 1 ? 's' : ''} of hands-on experience, and at ${card.age} years old, ${card.gender === "male" ? "he" : "she"} is known for dedication, attention to detail, and a strong passion for helping others through everyday tasks with care and professionalism.`;
  
    const additional = card.additional_specializations?.length > 0
      ? ` ${card.gender === "male" ? "He" : "She"} also has additional specialization${card.additional_specializations.length > 1 ? 's' : ''} in ${card.additional_specializations.join(", ")}.`
      : "";
  
    const langs = card.languages?.length > 0
      ? ` ${card.gender === "male" ? "He" : "She"} can communicate in ${card.languages.join(", ")}.`
      : "";
  
    return base + additional + langs;
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (value) => {
    console.log('Search term:', value);
  };

 
  
  

  
  

  
 






  return (
    <div className="pattern min-h-screen p-6 relative">
       <Input
        value={searchTerm}
        onChange={handleSearchChange}
        onSearch={handleSearch}
        placeholder="Search by name, specialization,work schedule"
        prefix={<SearchOutlined />} 
        allowClear 
         className="rounded-md top-15 transition-all duration-300 focus:shadow-md focus:border-blue-400"
        size="large" 
      />
      
      <div className="py-30 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {filteredCards.map((card, index) => {
        console.log('Current Card:', card); // This shows the whole card data.
        console.log('Specialization (pr_sp):', card.pr_sp); 
  
  const isAvailable = card.availability;

  return (
    <div key={index} className="bg-gray-50 rounded-sm shadow-md flex flex-col items-center transition-transform duration-200 hover:scale-105">
      <div className="w-30 h-30 rounded-full overflow-hidden mx-auto mt-5">
       
      <img
    src={`/${card.profile_image.replace(/\\/g, '/')}`}
    alt={`${card.first_name} ${card.last_name}`}
    className="w-full h-full object-cover"
  />
      </div>

      {/* RENDER CARETAKER DETAILS */}
      <h3 className="text-lg">{card.first_name} {card.last_name}</h3>
      <p className='text-gray-600'>{getProfessionalTitle(card.pr_sp)}</p>
    

      {/* Buttons */}
      <div className='p-2 ml-8 flex flex-col items-center justify-center'>
  <div className="flex justify-center items-center">
    <button
      onClick={() => handleOpenProfile(card)}
      className="relative mb-5 mx-3 border border-cyan-600 -translate-x-5 text-cyan-600 px-1 py-1 hover:text-cyan-600 hover:opacity-60 transition-all duration-300 rounded-sm"
    >
      View Profile
    </button>

    <button
      onClick={() => handleBookingPortal(card)}
      disabled={!isAvailable}
      className={`relative mb-5 -translate-x-5 px-2 py-1 rounded-sm transition-all duration-300 ${
        isAvailable
          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
      }`}
    >
      Book Now
    </button>
  </div>

  {!isAvailable && (
    <div className="text-red-600 bg-red-200 -translate-x-3 rounded-sm px-5  text-sm mt-[-10px]">
      Currently Unavailable
    </div>
  )}
</div>

    </div>
  );
})}

         <Dialog open={showProfile} onClose={() => setShowProfile(false)} className="relative z-10">
         <DialogBackdrop
    transition
    className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-400 data-[leave]:duration-400 data-[enter]:ease-out data-[leave]:ease-in"
  />

        <div className="fixed inset-0 z-10 overflow-hidden flex items-center justify-center p-4">
        <DialogPanel
        transition
        className="relative transform overflow-hidden rounded-sm bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 sm:h-[60vh]"
      >

            <div className="bg-white p-6">
            <img
                src={CloseIcon}
                className="w-7 h-7 absolute -top-1 right-5 ml-auto cursor-pointer mt-4 hover:bg-gray-100 transition-all duration-400"
                onClick={() => setShowProfile(false)}
                alt="Close"
              />
              {selectedProfile && (
                <div className='flex h-[50vh]'>
                  <div className='w-1/2 flex flex-col p-5'>
                  <img
                 src={`/${selectedProfile.profile_image.replace(/\\/g, '/')}`}
                 alt={`${selectedProfile.first_name} ${selectedProfile.last_name}`}
                 className="w-64 h-64 mt-5 object-cover rounded-sm"
                  />


                    <h2 className="mt-4 text-2xl font-bold text-cyan-600">{selectedProfile.first_name} {selectedProfile.last_name}</h2>
              <p className="text-lg text-gray-600">{getProfessionalTitle(selectedProfile.pr_sp)}</p>
              <p className='text-sm text-gray-500 top-2 relative'>Work Schedule: {selectedProfile.emp_type}</p>
              
             
            </div>
                  <div className='w-3/4 flex flex-col p-10 mr-10'>
                  
                  <div className='flex flex-col top-15 absolute'>
                  <div className='flex flex-row gap-1 items-center'>
                    <div className='w-8 h-8 flex bg-gray-200 rounded-full items-center justify-center -translate-x-2'>
                  <img src={About} className='w-5 h-5 '/>
                  </div>
                
                   <h3 className='text-cyan-600 top-10'>About</h3>
                  
                  
                   </div>
                   <p className='text-gray-700 text-md top-15 relative -translate-x-4'>
                   {generateAbout(selectedProfile)}</p>
                   

                  </div>
                    </div>
                </div>
              )}
              
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog open={showBookingportal} onClose={() => setBookingportal(false)} className="relative z-10">
         <DialogBackdrop
    transition
    className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-400 data-[leave]:duration-400 data-[enter]:ease-out data-[leave]:ease-in"
  />

        <div className="fixed inset-0 z-10 overflow-hidden flex items-center justify-center p-4">
        <DialogPanel
        transition
        className="relative transform overflow-hidden rounded-sm bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-3xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 sm:h-[70vh]"
      >

            <div className="bg-white p-6">
            <img
                src={CloseIcon}
                className="w-7 h-7 absolute -top-1 right-5 ml-auto cursor-pointer mt-4 hover:bg-gray-100 transition-all duration-400"
                onClick={() => setBookingportal(false)}
                alt="Close"
              />

{console.log("Selected Profile:", selectedProfile)}

<Form
  onFinish={handleConfirmBooking} // This is the function that will handle form submission
  layout="vertical">

{selectedProfile?.emp_type?.toLowerCase() === "full-time" ? (
  // Full-time booking form
  <>
    <h2 className="text-lg font-semibold mt-6 mb-4 text-cyan-600">Full-time Booking Details</h2>
    <div className="grid grid-cols-2 gap-4">
      {/* Personal Information */}
      <Form.Item name="full_name" label="Enter Your Name" rules={[{ required: true }]}>
        <Input placeholder="Enter full name" />
      </Form.Item>
      <Form.Item name="email" label="Email ID">
        <Input type="useremail" placeholder="Enter email ID" />
      </Form.Item>
      <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }]}>
        <Input type="tel" placeholder="Enter phone number" />
      </Form.Item>

      {/* Booking Details */}
        <Form.Item name="start_date" label="Start date" rules={[{ required: true, message: "Please select your date of birth" }]}> 
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      
      
    </div>
  </>
) : (
  // Part-time booking form
  <>
    <h2 className="text-lg font-semibold mt-6 mb-4 text-cyan-600">Part-time Booking Details</h2>
    <div className="grid grid-cols-2 gap-4">
      {/* Personal Information */}
       <Form.Item name="full_name" label="Enter your name" rules={[{ required: true, message: "Please enter your full name" }]}> 
                    <Input placeholder="Enter your first name" />
                  </Form.Item>
        <Form.Item name="email" label="Enter Your Email Address"> 
                    <Input placeholder="Enter your email" />
                  </Form.Item>
      <Form.Item name="phone_number" label="Enter Your Phone number" rules={[{ required: true, message: "Please enter your phone number" }]}> 
                    <Input placeholder="Enter your phone number" />
                  </Form.Item>

      {/* Booking Details */}
      <Form.Item name="start_date" label="Start date" rules={[{ required: true, message: "Please select your date of birth" }]}> 
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
    
      <Form.Item name="days_per_week" label="Days per week" rules={[{ required: true }]}>
        <InputNumber min={1} max={7} />
      </Form.Item>
      <Form.Item name="hours_per_day" label="Hours per day" rules={[{ required: true }]}>
        <InputNumber min={1} max={24} />
      </Form.Item>
      
    </div>
  </>
)}


<Form.Item className="text-center">
  <Button type="primary" htmlType="submit" className="w-1/2 p-5  !bg-cyan-600">
    Confirm Booking
  </Button>
</Form.Item>
</Form>


              
            </div>
          </DialogPanel>
        </div>
      </Dialog>




      </div>
    </div>
  );
}
export default CaretakerForm





  

// const profilecard = [
 
//   { id: 1, description: "Physiotherapist", title: "Reyansh", src: Profile1, content: "Lana Del Rey is a famous singer." },
//   { id: 2, description: "Nurse", title: "Anupama", src: Profile4, content: "Babbu Maan is a Punjabi singer." },
//   { id: 3, description: "Cook", title: "Nithya", src: Profile3, content: "Your artist description." },
//   { id: 4, description: "Postoperative Caregiver", title: "Sahana", src: Profile7, content: "Your artist description." },
//   { id: 5, description: "Nurse", title: "Anjali", src: Profile15, content: "Lana Del Rey is a famous singer." },
//   { id: 6, description: "Cook", title: "Smitha", src: Profile5, content: "Babbu Maan is a Punjabi singer." },
//   { id: 7, description: "Housekeeper", title: "Megha", src: Profile6, content: "Your artist description." },
//   { id: 8, description: "Geriatrician", title: "Vivaan", src: Profile8, content: "Your artist description." },
//   { id: 9, description: "Nurse", title: "Rhea", src: Profile16, content: "Your artist description." },
//   { id: 10, description: "Nurse", title: "Harini", src: Profile17, content: "Your artist description." },
//   { id: 11, description: "Nurse", title: "Shreya", src: Profile18, content: "Your artist description." },
//   { id: 12, description: "Housekeeper", title: "Varsha", src: Profile19, content: "Your artist description." },
//   { id: 13, description: "Cook", title: "Aparna", src: Profile20, content: "Your artist description." },
//   { id: 14, description: "Geriatrician", title: "Siddharth", src: Profile21, content: "Your artist description." },
//   { id: 15, description: "Geriatrician", title: "Preetham", src: Profile22, content: "Your artist description." },
//   { id: 16, description: "Geriatrician", title: "Ramesh", src: Profile23, content: "Your artist description." },
//   { id: 17, description: "Physiotherapist", title: "Shubman", src: Profile24, content: "Your artist description." },
//   { id: 18, description: "Physiotherapist", title: "Tarun", src: Profile25, content: "Your artist description." },
//   { id: 19, description: "Physiotherapist", title: "Daksh", src: Profile26, content: "Your artist description." },
//   { id: 20, description: "Physiotherapist", title: "Mrunal", src: Profile27, content: "Your artist description." },
//   { id: 21, description: "Physiotherapist", title: "Divya", src: Profile28, content: "Your artist description." },
//   { id: 22, description: "Geriatrician", title: "Devaki", src: Profile29, content: "Your artist description." },
//   { id: 23, description: "Physiotherapist", title: "Neha", src: Profile30, content: "Your artist description." },
//   { id: 24, description: "Nurse", title: "Radha", src: Profile31, content: "Your artist description." },
//   { id: 25, description: "Housekeeper", title: "Jyoti", src: Profile32, content: "Your artist description." },
//   { id: 26, description: "Babysitter", title: "Sunidhi", src: Profile33, content: "Your artist description." },
//   { id: 27, description: "Physiotherapist", title: "Shreyas", src: Profile34, content: "Your artist description." },
//   { id: 28, description: "Geriatritian", title: "Rohit", src: Profile35, content: "Your artist description." },
//   { id: 29, description: "Dementia Caregiver", title: "Raghav", src: Profile36, content: "Your artist description." },
//   { id: 30, description: "Cook", title: "Smriti", src: Profile37, content: "Your artist description." },
//   { id: 31, description: "Cook", title: "Sanya", src: Profile38, content: "Your artist description." },
//   { id: 32, description: "Babysitter", title: "Isha", src: Profile39, content: "Your artist description." },
//   { id: 33, description: "Housekeeper", title: "Rekha", src: Profile40, content: "Your artist description." },
//   { id: 34, description: "Physiotherapist", title: "Ritika", src: Profile41, content: "Your artist description." },
//   { id: 35, description: "Housekeeper", title: "Pooja", src: Profile42, content: "Your artist description." },
//   { id: 36, description: "Postoperative Caregiver", title: "Manish", src: Profile43, content: "Your artist description." },
//   { id: 37, description: "Postoperative Caregiver", title: "Radhika", src: Profile44, content: "Your artist description." },
//   { id: 38, description: "Physiotherapist", title: "Yash", src: Profile45, content: "Your artist description." },
//   { id: 39, description: "Physiotherapist", title: "Ehan", src: Profile46, content: "Your artist description." },
//   { id: 40, description: "Housekeeper", title: "Anirudh", src: Profile47, content: "Your artist description." },
//   { id: 41, description: "Physiotherapist", title: "Tanvi", src: Profile48, content: "Your artist description." },
//   { id: 42, description: "Physiotherapist", title: "Kiran", src: Profile49, content: "Your artist description." },
//   { id: 43, description: "Cook", title: "Devi", src: Profile50, content: "Your artist description." },
//   { id: 44, description: "Geriatrician", title: "Nitin", src: Profile51, content: "Your artist description." },
//   { id: 45, description: "Physiotherapist", title: "Rahul", src: Profile52, content: "Your artist description." },
//   { id: 46, description: "Physiotherapist", title: "Rajiv", src: Profile53, content: "Your artist description." },
//   { id: 47, description: "Dementia Caregiver", title: "Atharv", src: Profile54, content: "Your artist description." },
//   { id: 48, description: "Babysitter", title: "Paridhi", src: Profile55, content: "Your artist description." },
//   { id: 49, description: "Housekeeper", title: "Aparna", src: Profile56, content: "Your artist description." },
//   { id: 50, description: "Postoperative Caregiver", title: "Meera", src: Profile57, content: "Your artist description." },
//   { id: 51, description: "Housekeeper", title: "Sanya", src: Profile58, content: "Your artist description." }
// ]


// At the top of your file
