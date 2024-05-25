import React from 'react'
import { Link } from 'react-router-dom'
import nepal from '../images/flags/nepal.png' // Update the path to your image


const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg text-white">
      <span className="text-sm sm:text-center">&copy; 2024 <a href="http://localhost:3000/" className="hover:underline hover:text-green-200">JobQuest™</a>. All Rights Reserved.</span>
      
      <div className="flex flex-col md:flex-row items-center mt-3 md:mt-0 space-y-3 md:space-y-0 md:space-x-6">
        <div className="flex items-center space-x-3">
          <select className="bg-white text-black p-2 rounded">
            <option value="english">English</option>
            <option value="nepali">नेपाली</option>
          </select>
          <img src={nepal} alt="Country Flag" className="w-6 h-6" />
        </div>
        
        <div className="flex items-center space-x-3">
          <i className="fas fa-phone text-xl"></i>
          <span className="text-sm">9815038876</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

