import React from "react";

interface CreateCardProps {
  imageSrc: string;
  title: string;
  handleClick?: () => void;
}

const CreateCard: React.FC<CreateCardProps> = ({
  imageSrc,
  title,
  handleClick,
}) => {
  return (
    <div
      className="flex flex-col self-stretch my-auto rounded-none w-[202px]  cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-col justify-center items-center px-5 py-20 bg-white rounded-xl border border-solid border-black border-opacity-20 max-md:px-5 max-md:mr-2">
        <img
          loading="lazy"
          src={imageSrc}
          alt={title}
          className="object-contain aspect-square w-[84px]"
        />
      </div>
      <h3 className="mt-5 text-lg font-medium text-gray-800">{title}</h3>
    </div>
  );
};

export default CreateCard;
