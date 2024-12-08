import React, { useContext } from "react";
import CreateCard from "./CreateCard";
import svg from "../assets/b923ade298c7cb4936eb03b412ee37e9722d8da445c224a5237c0a7660060b6e.svg";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { resumeTemplate } from "../constants";

const CreateSection: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("Header must be used within a UserContextProvider");
  }

  const { user } = context;

  //Creating a new Document
  const createDocument = async (template: string | undefined) => {
    try {
      const response = await fetch("http://localhost:3000/docs/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user?.username, template }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      navigate(`/document/${data.docsId}`);
    } catch (error) {}
  };
  return (
    <section className="flex flex-col items-center px-20 pt-10 pb-4 mt-3.5 w-full bg-[#f9fbfd] max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col w-full max-w-[1218px] max-md:max-w-full">
        <h2 className="self-start text-xl font-medium text-gray-800">
          Start Creating
        </h2>
        <div className="flex flex-wrap gap-10 items-center mt-6 max-md:max-w-full">
          <CreateCard
            imageSrc={svg}
            title="Blank Document"
            handleClick={() => createDocument(undefined)}
          />

          <CreateCard
            imageSrc={svg}
            title="Resume"
            handleClick={() => createDocument(resumeTemplate)}
          />
          <CreateCard imageSrc={svg} title="Create New Document" />
          <CreateCard imageSrc={svg} title="Create New Document" />
          <CreateCard imageSrc={svg} title="Create New Document" />
        </div>
      </div>
    </section>
  );
};

export default CreateSection;
