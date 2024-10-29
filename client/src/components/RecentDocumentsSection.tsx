import React, { useEffect, useState } from "react";
import DocumentCard from "./DocumentCard";
import { Link } from "react-router-dom";
import { Document } from "../types/Document";
import { UserProps } from "../types/User";

interface RecentDocsProps {
  user: UserProps | null;
}

const RecentDocumentsSection: React.FC<RecentDocsProps> = ({ user }) => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:3000/document/fetch?id=${user?.id}`,
            {
              method: "GET",
            }
          );

          const data = await response.json();
          console.log(data);
          setDocuments(data.document || []); // Ensure data is an array
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      } else {
        setDocuments([]);
      }
    };

    fetchDocuments();
  }, [user]); // Only run this effect when `id` changes

  return (
    <section className="flex flex-col items-center px-20 pt-10 pb-20 mt-14 w-full bg-gray-100 max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col w-full max-w-[1226px] max-md:max-w-full">
        <h2 className="self-start text-xl font-medium text-gray-800">
          Recent Documents
        </h2>
        <div className="flex flex-wrap gap-10 items-center mt-6 max-md:max-w-full">
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <Link to={`/document/${doc._id}`} key={doc._id}>
                <DocumentCard
                  key={index}
                  title={doc.title}
                  date={doc.createdAt.split("T")[0]}
                />
              </Link>
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
