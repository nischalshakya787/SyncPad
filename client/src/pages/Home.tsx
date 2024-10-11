import { Header, CreateSection, RecentDocumentsSection } from "../components";

const Home = () => {
  return (
    <main className="flex overflow-hidden flex-col bg-gray-100">
      <Header />
      <CreateSection />
      <RecentDocumentsSection />
    </main>
  );
};

export default Home;
