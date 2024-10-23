import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from your local network
    port: 5173, // Optional: Specify the port if needed (default is 5173)
    // You can also set open to true if you want the browser to open automatically
    open: true,
  },
});
