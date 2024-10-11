import React from "react";
import DocumentCard from "./DocumentCard";

const recentDocuments = [
  { title: "Name of the docs", date: "Sep 22, 2024" },
  { title: "Name of the docs", date: "Sep 22, 2024" },
  { title: "Name of the docs", date: "Sep 22, 2024" },
  { title: "Name of the docs", date: "Sep 22, 2024" },
];

const RecentDocumentsSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center px-20 pt-10 pb-20 mt-14 w-full bg-gray-100 max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col w-full max-w-[1226px] max-md:max-w-full">
        <h2 className="self-start text-xl font-medium text-gray-800">
          Recent Documents
        </h2>
        <div className="flex flex-wrap gap-10 items-center mt-6 max-md:max-w-full">
          {recentDocuments.map((doc, index) => (
            <DocumentCard key={index} title={doc.title} date={doc.date} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentDocumentsSection;
