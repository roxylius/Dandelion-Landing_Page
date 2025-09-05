import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import EfficiencySection from "./components/EfficiencySection";
import WaitlistSection from "./components/WaitlistSection";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";

const App = () => {
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

export default App;
