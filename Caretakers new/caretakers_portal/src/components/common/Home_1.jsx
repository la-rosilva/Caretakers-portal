import React from 'react'

import Dementia from '../../assets/dementia.png'
import Physiotherapy from '../../assets/physiotherapy.png'
import Elderly from '../../assets/elderly.png'
import Nanny from '../../assets/nanny.png'
import Housekeeping from '../../assets/housekeeping.png'
import PostSurgery from '../../assets/postsurgery.png'
import MealPrep from '../../assets/cooking.png'
import Nurse from '../../assets/nursing.png'


const Home_1 = () => {
  return (
    <div className='w-full min-h-screen bg-gray-100'>
       
       <h1 className='text-cyan-600 text-center text-5xl translate-y-10 mt-5 mb-10 font-semibold underline underline-offset-15 decoration-cyan-600 decoration-[1.5px]'>We provide</h1>

<div className="flex justify-center items-center mt-24 px-10">

    
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
    <div className="p-6 bg-white text-cyan-600 text-2xl font-semibold rounded-md flex flex-col items-center text-center"><img src={Nurse} className='w-12 h-12 mb-10'/><span className='whitespace-nowrap'>Nursing Services</span>
      <p className="text-gray-600 text-sm mt-2">Providing compassionate and professional nursing care to support health and well-being at home</p>
      </div>
      <div className="p-6 bg-white text-cyan-600 text-2xl font-semibold rounded-md flex flex-col items-center text-center"><img src={Dementia} className='w-10 h-10 mb-10'/><span className='whitespace-nowrap'>Dementia Care</span>
      <p className="text-gray-600 text-sm mt-2 ">Providing compassionate care and support for individuals with dementia.</p>
      </div>

      <div className="p-6 bg-white text-cyan-600 text-2xl font-semibold rounded-md flex flex-col items-center text-center"><img src={Physiotherapy} className='w-10 h-10 mb-10'/><span className='whitespace-nowrap'>Physiotherapy Support</span>
      <p className="text-gray-600 text-sm mt-2">Restoring mobility and strength with expert physiotherapy services</p>
      </div>
      
      <div className="p-6 bg-white text-cyan-600 text-2xl font-semibold rounded-md flex flex-col items-center text-center"><img src={Elderly} className='w-12 h-12 mb-10'/><span className='whitespace-nowrap'>Geriatric Care</span>
      <p className="text-gray-600 text-sm mt-2">Tailored care services to support elderly individuals with dignity and comfort</p>
      </div>

      



    </div>

    

  

  </div>
  <div className="flex justify-center items-center mt-10 px-10">

    
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
      <div className="p-6 bg-white text-cyan-600 text-2xl font-semibold rounded-md flex flex-col items-center text-center"><img src={Housekeeping} className='w-12 h-12 mb-10'/><span className='whitespace-nowrap'>Housekeeping Services</span>
      <p className="text-gray-600 text-sm mt-2 ">Ensuring a clean and organized home environment for your comfort</p>
      </div>

      <div className="p-6 bg-white text-cyan-600 text-2xl font-semibold rounded-md flex flex-col items-center text-center"><img src={Nanny} className='w-12 h-12 mb-10'/><span className='whitespace-nowrap'>Child Care</span>
      <p className="text-gray-600 text-sm mt-2">Reliable babysitting services for your little ones when you need it most</p>
      </div>

      <div className="p-6 bg-white text-cyan-600 text-2xl font-semibold rounded-md flex flex-col items-center text-center"><img src={PostSurgery} className='w-12 h-12 mb-10'/><span className='whitespace-nowrap'>Post-Surgery Assistance</span>
      <p className="text-gray-600 text-sm mt-2">Helping you recover quickly and safely with tailored post-surgery care</p>
      </div>
      
      <div className="p-6 bg-white text-cyan-600 text-2xl font-semibold rounded-md flex flex-col items-center text-center"><img src={MealPrep} className='w-12 h-12 mb-10'/><span className='whitespace-nowrap'>Culinary Assistance</span>
      <p className="text-gray-600 text-sm mt-2">Nutritious and delicious meal preparation tailored to dietary needs</p>
      </div>

      
    </div>

    

  

  </div>
</div>

        
      
    
  )
}

export default Home_1
