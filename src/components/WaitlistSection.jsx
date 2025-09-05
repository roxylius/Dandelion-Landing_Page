import { ArrowRight, Twitter, X } from "lucide-react";

const WaitlistSection = () => {
  return (
    <div className="relative w-full py-20 bg-neutral-900 border-b border-neutral-800 overflow-hidden">
      {/* Background stars/dots effect */}
      {/* <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-60 right-10 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-1200"></div>
        <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-800"></div>
        <div className="absolute top-32 left-3/4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-400"></div>
      </div> */}

      <div className="container mx-auto px-6 relative z-10">
        {/* Coming Soon Badge */}
        <div className="text-center mb-8">
          <span className="bg-neutral-700 text-neutral-300 px-4 py-2 rounded-full text-sm font-medium">
            Coming soon!
          </span>
        </div>

        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-yellow-300 rounded-full transform rotate-45"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full transform -rotate-12"></div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Join The Waitlist
            {/* <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl">
              with Notion as CMS
            </span> */}
          </h2>
          {/* <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Join the waitlist to get early access of the product
            <br />
            and receive updates on the progress!
          </p> */}
        </div>

        {/* Waitlist Form */}
        <div className="max-w-md mx-auto mb-8">
          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors duration-300"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email Address"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors duration-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-neutral-900 font-semibold px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>
        </div>

        {/* Contact Links */}
        <div className="text-center">
          <p className="text-neutral-400 mb-4">For any queries, reach out at</p>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <X className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistSection;
