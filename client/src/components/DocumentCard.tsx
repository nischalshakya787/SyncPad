import React from "react";

interface DocumentCardProps {
  title: string;
  date: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ title, date }) => {
  return (
    <div className="flex flex-col self-stretch my-auto rounded-none min-w-[240px] w-[254px]">
      <div className="flex flex-col pt-64 w-full bg-white rounded-xl border border-solid border-black border-opacity-20 max-md:pt-24">
        <div className="flex px-5 py-3.5 bg-white rounded-none border border-solid border-black border-opacity-20">
          <div className="flex flex-col">
            <h4 className="text-sm text-gray-800">{title}</h4>
            <div className="flex gap-2 self-start mt-5 text-xs text-stone-500">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/54ceb38265b89d68d796355ec20e92c89de0be74d9887ea041a13b5c519d342b?placeholderIfAbsent=true&apiKey=b5e41414aacf42a3bef6031063a6b7ae"
                alt=""
                className="object-contain shrink-0 w-3 aspect-square"
              />
              <time>{date}</time>
            </div>
          </div>
          <button className="self-end mt-9 text-xs text-blue-500">
            View Collaborators
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
