import React from 'react';

import styles from '../styles/Global';
import assets from '../assets';

const Download = () => {
  return (
    <div className={`${styles.section} ${styles.bgWhite}`}>
      <div className={`${styles.subSection} flex-col text-center`}>
        <div>
          <h1 className={`${styles.h1Text} ${styles.blackText}`}>Build Better habits,</h1>
          <h1 className={`${styles.h1Text} ${styles.blackText}`}>Build a Better Life</h1>
          <p className={`${styles.pText} ${styles.blackText}`}>Harness the power of our personalized habit tracker app to streamline your everyday routines and achieve your goals.</p>
        </div>
        
        <button className={styles.btnPrimary} href="./login">Join a New Habit Today</button>
        <br></br>
        <br></br>
        <div className={styles.flexCenter}>
          <img 
            src={assets.scene}
            alt="download_png"
            className={styles.fullImg}
          />
        </div>
      </div>
    </div>
  )
}

export default Download