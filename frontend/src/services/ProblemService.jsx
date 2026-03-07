import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/landingpage/nav/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProblemTable from "../pages/Problems/ProblemTable";

function ProblemService() { // Uppercase first letter
    const [problems, setProblems] = useState([]);
  
    useEffect(() => {
      async function fetchProblems() {
        try {
          const response = await axios.get(
            `https://codearena-653z.onrender.com/api/problems`
          );
          setProblems(response.data.problems);
          toast.success("Problems fetched successfully");
        } catch (error) {
          toast.error("Failed to fetch problems");
          console.error(error);
        }
      }
  
      fetchProblems();
    }, []);
  
    return (
      <>
        <Navbar />
        <ProblemTable problems={problems} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    );
  }
  
export default ProblemService;
