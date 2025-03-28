import React from 'react';

import styles from '../styles/Global';

const Button = ({ assetUrl, link }) => {
  return (
    <div 
      className={styles.btnBlack}
      href="./login"
    >
      <img src={assetUrl} alt="registration" className={styles.btnIcon} />
      <div className="flex flex-col justify-start ml-4">
        <p className={`${styles.btnText} font-bold text-sm`}>Start New Habit Today</p>
      </div>
    </div>
  )
}

export default Button