import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, Auth, Document } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/sign-up" element={<Auth />} />
        <Route path="/document" element={<Document />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
