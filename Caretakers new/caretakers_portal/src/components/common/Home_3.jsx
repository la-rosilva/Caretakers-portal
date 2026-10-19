import React from 'react';
import topquote from '../../assets/top-quote.png';
import bottomquote from '../../assets/bottom-quote.png';
import review1 from '../../assets/profile9.jpg';
import review2 from '../../assets/profile10.jpg';
import review3 from '../../assets/profile11.jpg';
import review4 from '../../assets/profile12.jpg';
import review5 from '../../assets/profile13.jpg';

import { Splide, SplideSlide } from '@splidejs/react-splide';  
import '@splidejs/splide/dist/css/splide.min.css';  

const testimonials = [
  { 
    id: 1, 
    image: review1, 
    name: "Rudra", 
    text: "Finding a trustworthy caretaker for my elderly mother was stressful until I found this platform. The caretakers are kind, professional, and genuinely care about their clients. I can't express how much peace of mind this has given our family!" 
  },
  { 
    id: 2, 
    image: review2, 
    name: "Daniel Gomes", 
    text: "I needed assistance for my father who has Alzheimer's, and this service exceeded all expectations. The caretaker assigned to us is incredibly patient and attentive. My father has never been happier, and I finally feel relieved knowing he's in good hands." 
  },
  { 
    id: 3, 
    image: review3, 
    name: "Michael Francis ", 
    text: "I recently hired a caretaker through this platform to assist my disabled brother, and I couldn't be happier with the experience. The professionalism and compassion shown by the caretaker have made a significant difference in our lives. Highly recommend this service to anyone in need."
  },
    { 
      id: 4, 
      image: review4, 
      name: "Kavya", 
      text: "My husband and I both work full-time, and we were struggling to find reliable care for my aging grandmother. The caretaker we found here has been nothing short of amazing—kind, respectful, and always punctual. This service has truly been a blessing for our family!" 
    },
    { 
      id: 5, 
      image: review5, 
      name: "Avni", 
      text: "As someone recovering from surgery, I needed temporary home care assistance. The caretaker assigned to me was incredibly supportive, helping with everything from mobility to daily tasks. I highly recommend this platform to anyone in need of compassionate care!" 
    }
  ];
  
const Home3 = () => {
  return (
    <div className="flex relative flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
    
    <h1 className='text-cyan-600 text-center text-5xl top-20 absolute mb-10 font-semibold'>What our customers say?</h1>

   
      <div className=" bg-white shadow-lg rounded-md h-[300px] p-6 w-full max-w-2xl">
     
        <img src={topquote} className="absolute top-20 md:top-15 left-0 md:left-[300px] w-40 md:w-50 opacity-30" alt="Top Quote" />
        <img src={bottomquote} className="absolute right-0 bottom-25 md:bottom-[200px]  w-35 md:right-70 md:translate-y-30 md:w-50 rotate-360 opacity-30" alt="Bottom Quote" />

        <Splide options={{ perPage: 1, arrows: true, pagination: true }}>
          {testimonials.map((review) => (
            <SplideSlide key={review.id} className="flex flex-col items-center">
              <div className="flex items-center space-x-4">
                {/* Profile Image */}
                <img src={review.image} className="w-40 h-40 rounded-full object-cover" alt={review.name} />

                {/* Testimonial Text */}
                <div className="flex flex-col">
                  <p className="text-gray-700 text-lg">{review.text}</p>

                  {/* Name & Ratings */}
                  <div className="mt-2">
                    <p className="text-gray-900 font-semibold">{review.name}</p>
                    <div className="text-yellow-500 text-xl flex">
                      <span>&#9733;</span>
                      <span>&#9733;</span>
                      <span>&#9733;</span>
                      <span>&#9733;</span>
                      <span>&#9733;</span>
                    </div>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide> 
      </div>
    </div>
  );
};

export default Home3;
