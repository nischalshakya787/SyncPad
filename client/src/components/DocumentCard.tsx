import React from "react";
import { DocumentCardProps } from "../types/Document";
import document from "../assets/document.svg";
const DocumentCard: React.FC<DocumentCardProps> = ({ title, date }) => {
  return (
    <div className="min-w-[240px] w-[254px] rounded-xl border-2 border-solid border-black border-opacity-20 create">
      <div className="bg-white rounded-xl">
        {/* Image Section */}
        <div className="flex items-center justify-center h-[250px]">
          <img
            loading="lazy"
            src={document}
            alt="Document Icon"
            className="object-contain w-16 h-16"
          />
        </div>
        {/* Content Section */}
        <div className="flex flex-col px-5 py-4 mb-1 bg-white border-t border-solid border-black border-opacity-20">
          <h4 className="text-sm font-medium text-gray-800">{title}</h4>
          <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/54ceb38265b89d68d796355ec20e92c89de0be74d9887ea041a13b5c519d342b?placeholderIfAbsent=true&apiKey=b5e41414aacf42a3bef6031063a6b7ae"
              alt=""
              className="object-contain w-3 h-3"
            />
            <time>{date}</time>
          </div>
          <div className="div">
            <button className="mt-4 text-xs text-blue-500 hover:underline ">
              View Collaborators
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
