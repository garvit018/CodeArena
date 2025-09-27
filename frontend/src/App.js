import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthContext } from "./context/authContext";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import LandingPage from "./components/landingpage/LandingPage";
import Navbar from "./components/landingpage/nav/Navbar";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Profile from "./pages/profile/Profile";
import Problems from "./pages/Problems/Problems";
import RankingsPage from "./pages/Rankings/Rankings";
import ProblemTable from "./pages/Problems/ProblemTable";
import ProblemService from "./services/ProblemService";
import Workspace from "./components/Workspace/Workspace";

// Authenticated Route Wrapper
const AuthenticatedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const isLoggedIn = user || localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// Public Route Wrapper (e.g., for Login/Signup)
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/home" /> : children;
};

// Layout Wrapper for Authenticated Routes
const AuthenticatedLayout = () => (
  <>
    <Navbar />
    <Outlet /> {/* Child routes will render here */}
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Authenticated Routes */}
        <Route element={<AuthenticatedRoute><AuthenticatedLayout /></AuthenticatedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/problemtable" element={<ProblemTable />} />
          <Route path="/rankings" element={<RankingsPage />} />

          {/* Nested routes under /problems */}
          <Route path="/problems" element={<ProblemService />} />
          <Route path="/problem/:problemId" element={<Workspace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
