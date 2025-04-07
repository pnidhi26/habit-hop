import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Download, SectionWrapper, Navbar, Topbar } from './components';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Community from './pages/Community';
import Plans from './pages/Plans';
import Habits from './pages/Habits';
import Settings from './pages/Settings';
import assets from './assets';
import styles from './styles/Global';

const HomePage = () => (
  <>
    <SectionWrapper 
      title="Organize, Execute, Triumph"
      description="Discover HabitHop app that helps you build positive life-changing habits. Effortlessly track your habits, reach your personal goals with analytics, and stay motivated every day."
      showBtn
      mockupImg={assets.homeHero}
      banner="banner"
    />
    <Download />
    <SectionWrapper 
      title="Key Features"
      description="Scientific studies show that tracking your progress can significantly boost your chances of successfully building and maintaining habits. 
      Fuel your journey with insightful metrics, celebrate your milestones, and stay motivated on your path to success.
      Analytics Dashboard, Leaderboard, Manage Habit Page etc."
      mockupImg={assets.feature}
      banner="banner02"
    />
    
    <div className="px-4 py-2 justify-center items-center bg-primary flex-col text-center banner04">
      <p className={`${styles.pText} ${styles.whiteText}`}>Habit Stacker Project - {" "}
      <span className="bold">CSCI 630, Group 1,  CSU Chico</span>
      </p>
    </div>
  </>
);

const AppLayout = () => (
  <div className="flex flex-col h-screen">
    <Topbar />
    <div className="flex h-full"> 
      <Navbar />
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/community" element={<Community />} />
          <Route path="/plans" element={<Plans />} />
        </Routes>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}
export default App;