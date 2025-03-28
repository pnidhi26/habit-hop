
import { Download, SectionWrapper } from './components';
import assets from './assets';
import styles from './styles/Global';

const App = () => {
  return (
    <>
      <SectionWrapper 
        title="Organize, Execute, Triumph"
        description="Discover HabitHop app that helps you build positive life-changing habits. Effortlessly track your habits, reach your personal goals with analytics, and stay motivated every day."
        showBtn
        mockupImg={assets.homeHero}
        banner="banner"
      />
      {/* <Features /> */}
      <Download />
      <SectionWrapper 
        title="Key Features"
        description="Scientific studies show that tracking your progress can significantly boost your chances of successfully building and maintaining habits. 
        Fuel your journey with insightful metrics, celebrate your milestones, and stay motivated on your path to success.
        Analytics Dashboard, Leaderboard, Manage Habit Page etc.
        "
        // mockupImg={assets.mockup}
        banner="banner02"
      />
      
      <div className="px-4 py-2 justify-center items-center bg-primary flex-col text-center banner04">
        <p className={`${styles.pText} ${styles.whiteText}`}>Habit Stacker Project - {" "}
        <span className="bold">CSCI 630, Group 1,  CSU Chico</span>
        </p>
      </div>
    </>
  );
}

export default App;
