// NotFound.js
import { Link } from "react-router-dom";
import { CSSProperties } from "react"; // Import CSSProperties

const NotFound = () => {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>404</h1>
      <p style={messageStyle}>Page Not Found</p>
      <Link to="/" style={linkStyle}>
        Go back to Home
      </Link>
    </div>
  );
};

// CSS properties defined using CSSProperties type
const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center",
  color: "#333",
};

const headingStyle: CSSProperties = {
  fontSize: "6rem",
  marginBottom: "1rem",
};

const messageStyle: CSSProperties = {
  fontSize: "1.5rem",
  marginBottom: "1rem",
};

const linkStyle: CSSProperties = {
  textDecoration: "none",
  color: "#3B82F6", // You can change the color to fit your theme
  fontWeight: "bold",
};

export default NotFound;
