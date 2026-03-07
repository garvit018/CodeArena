import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthContext } from "./context/authContext.jsx";
import Home from "./pages/Home.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import LandingPage from "./components/landingpage/LandingPage.jsx";
import Navbar from "./components/landingpage/nav/Navbar.jsx";
import Login from "./components/Login/Login.jsx";
import Signup from "./components/Signup/Signup.jsx";
import Profile from "./pages/profile/Profile.jsx";
import RankingsPage from "./pages/Rankings/Rankings.jsx";
import ProblemTable from "./pages/Problems/ProblemTable.jsx";
import ProblemService from "./services/ProblemService.jsx";
import Workspace from "./components/Workspace/Workspace.jsx";

const AuthenticatedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const isLoggedIn = user || localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/home" /> : children;
};
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
