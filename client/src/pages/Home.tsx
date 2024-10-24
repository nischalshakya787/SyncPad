import { toast, ToastContainer } from "react-toastify";
import { Header, CreateSection, RecentDocumentsSection } from "../components";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
  }, [location.state]);

  return (
    <main className="flex overflow-hidden flex-col bg-gray-100">
      <ToastContainer />
      <Header />
      <CreateSection />
      <RecentDocumentsSection />
    </main>
  );
};

export default Home;
