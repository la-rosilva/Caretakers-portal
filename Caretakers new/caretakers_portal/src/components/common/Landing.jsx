

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {useTypewriter,Cursor} from 'react-simple-typewriter';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.jpg';
import img4 from '../../assets/img4.jpg';
import img5 from '../../assets/img5.jpg';
import img6 from '../../assets/img6.jpg';
import img7 from '../../assets/img7.jpg';
import img8 from '../../assets/img8.jpg';
import img9 from '../../assets/img9.jpg';
//import Navbar from './Navbar'
import Home1 from './Home_1'
import Home2 from './Home_2'
import Home3 from './Home_3'


const Landing = ({isAdmin=false}) => {
  console.log("isAdmin:",isAdmin);
  const navigate=useNavigate();
  const [text]=useTypewriter({
    words: ["Support!", "Ease!", "Hope!"],
    loop:true,
    typeSpeed:150,
    deleteSpeed:100,
    delaySpeed:1000,


  });
  // const handleJoinClick=()=>{
    
  //   if(isAdmin){
  //     navigate("/admin-dashboard/caretaker_form");
  //   }else{
  //     navigate("/caretaker_form");
  //   }
  // }
  
  const handleJoinClick = () => {
    const token = localStorage.getItem('token');
  
    if (!token || token === "undefined" || token.trim() === "") {
      toast.error("Please Log in", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
  
  
    if (isAdmin) {
      navigate("/admin-dashboard/caretaker_form");
    } else {
      navigate("/caretaker_form");
    }
  };
  

  return (
    <>
    
    <div className="pattern min-h-screen relative">
    {/* <Navbar className='fixed'/> */}
    
   
    
  
    
    <section className="w-full px-8 grid grid-cols-1  md:grid-cols-2 items-center translate-y-30 gap-8 max-w-6xl mx-auto">
    <button onClick={handleJoinClick}className='fixed bottom-0 translate-y-10 -translate-x-40 left-2 bg-emerald-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-emerald-600 transition-all duration-400'>Join as a Caretaker</button>
    
        
      <div>
     
       
        <h3 className="text-3xl md:text-6xl -mt-12 md:-ml-12 font-semibold leading-tight relative md:left-[-100px] text-gray-600 ">
        Bringing your days to life with {" "}
       
        <span className="text-cyan-600 font-bold italic" style={{fontFamily: "Finger Paint"}}>{text}</span>
      
        <span>
          <Cursor className='cursor-style' cursorStyle='|' cursorBlinkSpeed={100}/>
        </span>
        </h3>
        <p className="text-base md:text-lg text-slate-700 my-4 md:my-6 typewriter-effect">
          
        </p>
        {/* <button className="bg-pink-900 text-white font-medium py-2 px-4 rounded transition-all hover:bg-indigo-600 active:scale-95">
          Find a class
        </button> */}
      </div>
      <ShuffleGrid />
    </section>
    </div>
    <Home1/>
    <Home2/>
    <Home3/>
    </>
   
  );
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: img1,
  },
  {
    id: 2,
    src: img2,
  },
  {
    id: 3,
    src: img3,
  },
  {
    id: 4,
    src: img4,
  },
  {
    id: 5,
    src: img5,
  },
  {
    id: 6,
    src: img6,
  },
  {
    id: 7,
    src: img7,
  },
  {
    id: 8,
    src: img8,
  },
  {
    id: 9,
    src: img9,
  },
 
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.8, type: "spring" }}
      className="w-full h-full"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 4000);
  };

  return (
    <div className="grid grid-cols-3 grid-rows-3 h-[500px] w-[700px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default Landing;

