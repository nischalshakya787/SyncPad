import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Auth, Document } from "./pages";
import { UserContext, UserContextProvider } from "./UserContext";
import { useContext, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <UserContextProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserContextProvider>
  );
}

function AppRoutes() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("AppRoutes must be used within a UserContextProvider");
  }

  const { user, setUser } = context;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          setUser(null);
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [user, setUser]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route
        path="/document/:id"
        element={
          <ProtectedRoute>
            <Document />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
