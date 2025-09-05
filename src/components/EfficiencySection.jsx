import { ArrowRight } from "lucide-react";
import phoneImg from "../assets/phone.png";
import laptopImg from "../assets/laptop.png";
import tabletImg from "../assets/tablet.png";

const EfficiencySection = () => {
  const statisticsData = [
    {
      percentage: "70%",
      title: "Reduction",
      description: "in time-to-hire by",
      highlight: "streamlining the candidate experience.",
      buttonText: "Improve your time-to-hire",
      image: phoneImg,
    },
    {
      percentage: "97%",
      title: "Reduction", 
      description: "in scheduling administration work,",
      highlight: "freeing resources.",
      buttonText: "Reduce your admin work",
      image: laptopImg,
    },
    {
      percentage: "50%",
      title: "Increase",
      description: "in hiring velocity in",
      highlight: "high-volume, high-turnover roles.",
      buttonText: "Speed up your hiring",
      image: tabletImg,
    },
  ];

  return (
    <div className="relative w-full bg-neutral-900 border-b border-neutral-800 min-h-[900px]">
      <div className="container mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-white">
            Do more{" "}
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text">
              with less
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-neutral-300 mt-6 max-w-4xl mx-auto leading-relaxed">
            With our simple, easy-to-use interface and powerful workflows, expect
            effortless efficiency and productivity gains.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {statisticsData.map((stat, index) => (
            <div key={index} className="text-center">
              {/* Device Image */}
              <div className="relative rounded-lg mb-6 h-64 border border-neutral-700 hover:border-orange-500 transition-colors duration-300 overflow-hidden">
                <img 
                  src={stat.image} 
                  alt={`${stat.title} device`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-neutral-900 bg-opacity-30"></div>
              </div>
              
              {/* Percentage */}
              <div className="mb-4">
                <span className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text">
                  {stat.percentage}
                </span>
                <h3 className="text-2xl lg:text-3xl font-semibold text-white mt-2">
                  {stat.title}
                </h3>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-neutral-300 text-base">
                  {stat.description}{" "}
                  <span className="italic font-medium text-green-400">
                    {stat.highlight}
                  </span>
                </p>
              </div>

              {/* Action Button */}
              <button className="group inline-flex items-center gap-2 border border-green-500 text-green-400 px-6 py-3 rounded-full hover:bg-green-500 hover:text-neutral-900 transition-all duration-300 font-medium">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                {stat.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EfficiencySection;
