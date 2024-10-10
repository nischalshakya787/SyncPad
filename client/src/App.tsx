import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={} />
        <Route path="/login" element={} />
        <Route path="/sign-up" element={} />
        <Route path="/document" element={} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
