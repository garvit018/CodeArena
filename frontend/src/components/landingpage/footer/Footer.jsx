import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white py-8 px-4 font-sans relative bottom-0 w-full border-t border-slate-800">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row justify-between w-full max-w-6xl mb-4">
          <div className="flex-1 mx-4 mb-4 md:mb-0">
            <h3 className="text-cyan-300 mb-2 text-lg font-semibold">
              About CodeArena
            </h3>
            <p className="text-slate-300">
              CodeArena is a global platform for coders to solve challenges,
              compete on leaderboards, and build their coding skills.
            </p>
          </div>
          <div className="flex-1 mx-4 mb-4 md:mb-0">
            <h3 className="text-cyan-300 mb-2 text-lg font-semibold">
              Quick Links
            </h3>
            <ul className="list-none p-0">
              <li>
                <Link
                  to="/problemtable"
                  className="text-slate-100 hover:text-cyan-300 transition-colors duration-300"
                >
                  Problems
                </Link>
              </li>
              <li>
                <Link
                  to="/rankings"
                  className="text-slate-100 hover:text-cyan-300 transition-colors duration-300"
                >
                  Rankings
                </Link>
              </li>
              <li>
                <Link
                  to="/home"
                  className="text-slate-100 hover:text-cyan-300 transition-colors duration-300"
                >
                  Collab
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-slate-100 hover:text-cyan-300 transition-colors duration-300"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1 mx-4">
            <h3 className="text-cyan-300 mb-2 text-lg font-semibold">
              Contact Us
            </h3>
            <p className="text-slate-300">Email: garvitgoyal83@gmail.com</p>
            <p className="text-slate-300">Phone: +91 7976166814</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-400">
            &copy; 2026 CodeArena. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
