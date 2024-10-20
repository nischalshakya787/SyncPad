import React from "react";
import CreateCard from "./CreateCard";
import svg from "../assets/b923ade298c7cb4936eb03b412ee37e9722d8da445c224a5237c0a7660060b6e.svg";

const CreateSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center px-20 pt-10 pb-4 mt-3.5 w-full bg-gray-100 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col w-full max-w-[1218px] max-md:max-w-full">
        <h2 className="self-start text-xl font-medium text-gray-800">
          Start Creating
        </h2>
        <div className="flex flex-wrap gap-10 items-center mt-6 max-md:max-w-full">
          <CreateCard imageSrc={svg} title="Create New Document" />
          <CreateCard imageSrc={svg} title="Create New Document" />
          <CreateCard imageSrc={svg} title="Create New Document" />
          <CreateCard imageSrc={svg} title="Create New Document" />
          <CreateCard imageSrc={svg} title="Create New Document" />
        </div>
      </div>
    </section>
  );
};

export default CreateSection;
