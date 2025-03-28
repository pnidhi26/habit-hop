import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Global';
import assets from '../assets';
import Button from './Button';

const SectionWrapper = ({ title, description, showBtn, mockupImg, banner, reverse }) => {
  return (
    <div className={`min-h-screen ${styles.section} 
      ${reverse ? styles.bgWhite : styles.bgPrimary} 
      ${banner}`}>
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 flex justify-between p-6">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          HabitHop
        </div>
        
        {/* Login and Signup Buttons */}
        <div className="flex space-x-4">
          <Link 
            to="/login" 
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Existing SectionWrapper content */}
      <div className={`flex items-center 
        ${reverse ? styles.boxReverseClass : styles.boxClass} 
        w-11/12 sm:w-full minmd:w-3/4 mt-16`}> {/* Added mt-16 to prevent content from being hidden behind nav */}
        <div className={`${styles.descDiv} 
          ${reverse ? " fadeRightMini" : " fadeLeftMini"}
          ${reverse ? styles.textRight : styles.textLeft}
        `}>
          <h1 className={`
          ${reverse ? styles.blackText : styles.whiteText}
          ${styles.h1Text}`}>{title}</h1>
          <p className={`
          ${reverse ? styles.blackText : styles.whiteText}
          ${styles.descriptionText}`}>{description}</p>
          {showBtn && (
            <Button 
              assetUrl={assets.expo}
              href="./login"
            />
          )}
        </div>
        <div
          className={`flex-1 ${styles.flexCenter}p-8 sm:px-0`}
        >
          <img src={mockupImg} alt="mockup" className={`
           ${reverse ? " fadeLeftMini" : " fadeRightMini"}
          ${styles.sectionImg}`} />
        </div>
      </div>
    </div>
  )
}

export default SectionWrapper;