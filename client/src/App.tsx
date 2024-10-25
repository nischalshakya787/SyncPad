import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Auth, Document } from "./pages";
import { UserContextProvider } from "./UserContext";

function App() {
  return (
    <Router>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/document/:id" element={<Document />} />
        </Routes>
      </UserContextProvider>
    </Router>
  );
}

export default App;
