import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import EfficiencySection from "./components/EfficiencySection";
import WaitlistSection from "./components/WaitlistSection";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import JobApplication from "./components/JobApplication";

// Home Page Component
const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
      </div>
      <EfficiencySection />
      <div className="max-w-7xl mx-auto px-6">
        <FeatureSection />
        {/* <Workflow /> */}
        {/* <Pricing /> */}
        {/* <Testimonials /> */}
      </div>
      <WaitlistSection />
      <div className="max-w-7xl mx-auto px-6">
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/careers/software-engineer-intern" element={<JobApplication />} />
      </Routes>
    </Router>
  );
};

export default App;
