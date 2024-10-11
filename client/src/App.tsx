import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Auth, Document } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/sign-up" element={<Auth />} />
        <Route path="/document" element={<Document />} />
      </Routes>
    </Router>
  );
}

export default App;
