import React from 'react';
import Interview from '../../assets/interview.png';
import Wallet from '../../assets/wallet.png';
import Calender from '../../assets/calendar.png';

const Home_2 = () => {
  return (
    <div className='w-full h-full md:h-[80vh] bg-cyan-600'>
        <h1 className='text-white text-center text-5xl translate-y-10 mb-30 font-semibold'>Why Choose Us?</h1>
        <div className="flex justify-center items-center mt-24 px-36">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-cyan-600 text-2xl font-semibold rounded-md flex flex-col items-center text-center">
                <img src={Wallet} className='w-30 h-30'/><span className='text-white mt-3'>Cost-Effective & Transparent Pricing</span>
              <p className="text-white text-sm mt-10">High-quality care at affordable rates with no hidden charges. Choose the right caretaker within your budget.</p>
              </div>
              <div className="p-6 bg-cyan-600 text-2xl font-semibold rounded-md flex flex-col items-center text-center">
                <img src={Interview} className='w-30 h-30'/><span className='text-white mt-3'>Verified & Trusted Caretakers</span>
              <p className="text-white text-sm mt-18 ">Each caretaker is thoroughly screened, with background checks and certifications verified to guarantee peace of mind for both you and your loved ones</p>
              </div>
        
              <div className="p-6 bg-cyan-600  text-2xl font-semibold rounded-md flex flex-col items-center text-center">
                <img src={Calender} className='w-30 h-30'/><span className='text-white mt-3'>Personalized Search & Easy Booking</span>
              <p className="text-white text-sm mt-10">Find caretakers based on variuous features using smart filters for a hassle-free booking process.</p>
              </div>
        
              
            </div>
            </div>
           

      
    </div>
  )
}

export default Home_2
