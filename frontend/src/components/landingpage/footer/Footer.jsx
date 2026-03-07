import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-4 font-sans relative bottom-0 w-full">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row justify-between w-full max-w-6xl mb-4">
          <div className="flex-1 mx-4 mb-4 md:mb-0">
            <h3 className="text-yellow-500 mb-2 text-lg font-semibold">About CODESPHERE</h3>
            <p className="text-gray-300">
              CODESPHERE is a global platform for coders to solve challenges,
              compete on leaderboards, and build their coding skills.
            </p>
          </div>
          <div className="flex-1 mx-4 mb-4 md:mb-0">
            <h3 className="text-yellow-500 mb-2 text-lg font-semibold">Quick Links</h3>
            <ul className="list-none p-0">
              <li><a href="/problems" className="text-white hover:text-yellow-500 transition-colors duration-300">Problems</a></li>
              <li><a href="/rankings" className="text-white hover:text-yellow-500 transition-colors duration-300">Rankings</a></li>
              <li><a href="/collab" className="text-white hover:text-yellow-500 transition-colors duration-300">Collab</a></li>
              <li><a href="/login" className="text-white hover:text-yellow-500 transition-colors duration-300">Login</a></li>
            </ul>
          </div>
          <div className="flex-1 mx-4">
            <h3 className="text-yellow-500 mb-2 text-lg font-semibold">Contact Us</h3>
            <p className="text-gray-300">Email: garvitgoyal83@gmail.com</p>
            <p className="text-gray-300">Phone: +91 7976166814</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-400">&copy; 2025 CODESPHERE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
