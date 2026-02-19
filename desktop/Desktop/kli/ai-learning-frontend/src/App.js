import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Exam from "./pages/Exam";
import Review from "./pages/Review";
import Chat from "./pages/Chat";
import Videos from "./pages/Videos";
import "./styles/global.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/exam" element={<Exam />} />
                      <Route path="/review" element={<Review />} />
                      <Route path="/videos" element={<Videos />} />
                      <Route path="/chat" element={<Chat />} />
                    </Routes>
                  </main>
                  <footer className="app-footer">
                    <p>© 2024 AI Learning Platform. All rights reserved.</p>
                  </footer>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
