import React, { useContext } from "react";
import DocumentCard from "./DocumentCard";
import { Link } from "react-router-dom";
import { UserProps } from "../types/User";
import { UserContext } from "../UserContext";

interface RecentDocsProps {
  user: UserProps | null;
}

const RecentDocumentsSection: React.FC<RecentDocsProps> = ({ user }) => {
  const document = useContext(UserContext);

  if (!document) {
    throw new Error("AppRoutes must be used within a UserContextProvider");
  }

  const { documents } = document;

  return (
    <section className="flex flex-col items-center px-20 pt-10 pb-20 mt-14 w-full bg-[#f9fbfd] max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col w-full max-w-[1226px] max-md:max-w-full">
        {user ? (
          <>
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
          </>
        ) : (
          <p>Please log in to view Recent Documents</p>
        )}
      </div>
    </section>
  );
};

export default RecentDocumentsSection;
