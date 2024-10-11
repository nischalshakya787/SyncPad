import React from "react";
import CreateCard from "./CreateCard";

const createItems = [
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b923ade298c7cb4936eb03b412ee37e9722d8da445c224a5237c0a7660060b6e?placeholderIfAbsent=true&apiKey=b5e41414aacf42a3bef6031063a6b7ae",
    title: "Create New Document",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b923ade298c7cb4936eb03b412ee37e9722d8da445c224a5237c0a7660060b6e?placeholderIfAbsent=true&apiKey=b5e41414aacf42a3bef6031063a6b7ae",
    title: "Create New Document",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b923ade298c7cb4936eb03b412ee37e9722d8da445c224a5237c0a7660060b6e?placeholderIfAbsent=true&apiKey=b5e41414aacf42a3bef6031063a6b7ae",
    title: "Create New Document",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b923ade298c7cb4936eb03b412ee37e9722d8da445c224a5237c0a7660060b6e?placeholderIfAbsent=true&apiKey=b5e41414aacf42a3bef6031063a6b7ae",
    title: "Create New Document",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/2761554201912df3d46ae588dd71d29950a761a735cde23c6ae86e156768dde6?placeholderIfAbsent=true&apiKey=b5e41414aacf42a3bef6031063a6b7ae",
    title: "Create New Document",
  },
];

const CreateSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center px-20 pt-10 pb-4 mt-3.5 w-full bg-gray-100 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col w-full max-w-[1218px] max-md:max-w-full">
        <h2 className="self-start text-xl font-medium text-gray-800">
          Start Creating
        </h2>
        <div className="flex flex-wrap gap-10 items-center mt-6 max-md:max-w-full">
          {createItems.map((item, index) => (
            <CreateCard key={index} imageSrc={item.image} title={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreateSection;
