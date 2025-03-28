import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Global';

const Button = ({ assetUrl }) => {
  return (
    <Link 
      to="/login"
      className={styles.btnBlack}
    >
      <img src={assetUrl} alt="registration" className={styles.btnIcon} />
      <div className="flex flex-col justify-start ml-4">
        <p className={`${styles.btnText} font-bold text-sm`}>Start New Habit Today</p>
      </div>
    </Link>
  )
}

export default Button;