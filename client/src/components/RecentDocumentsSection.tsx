import React, { useEffect, useState } from "react";
import DocumentCard from "./DocumentCard";

interface RecentDocsProps {
  id: string | undefined;
}
interface Document {
  _id: string;
  title: string;
  value: string;
  creator: string;
  collab: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const RecentDocumentsSection: React.FC<RecentDocsProps> = ({ id }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  console.log(documents);

  useEffect(() => {
    if (id) {
      const fetchDocuments = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/document/fetch?id=${id}`,
            {
              method: "GET",
            }
          );

          const data = await response.json();
          setDocuments(data || []); // Ensure data is an array
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      };

      fetchDocuments();
    }
  }, [id]); // Only run this effect when `id` changes

  return (
    <section className="flex flex-col items-center px-20 pt-10 pb-20 mt-14 w-full bg-gray-100 max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col w-full max-w-[1226px] max-md:max-w-full">
        <h2 className="self-start text-xl font-medium text-gray-800">
          Recent Documents
        </h2>
        <div className="flex flex-wrap gap-10 items-center mt-6 max-md:max-w-full">
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <DocumentCard
                key={index}
                title={doc.title}
                date={doc.createdAt.split("T")[0]}
              />
            ))
          ) : (
            <p>No recent documents found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentDocumentsSection;
