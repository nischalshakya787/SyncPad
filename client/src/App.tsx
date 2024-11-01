import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Auth, Document } from "./pages";
import { UserContext, UserContextProvider } from "./UserContext";
import { useContext } from "react";

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

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/document/:id" element={<Document />} />
    </Routes>
  );
}

export default App;
