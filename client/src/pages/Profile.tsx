import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { User } from "../types/User";
import { Link } from "react-router-dom";

const Profile = () => {
  // Placeholder user data
  const [userData, setUserData] = useState<User>();

  const userInfo = useContext(UserContext);
  if (!userInfo) {
    throw Error("Cant load userInfo");
  }
  const { user, documents } = userInfo;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/auth/user?id=${user?.id}`
        );
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      fetchUser();
    }
  }, []);
  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-6">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <img src={""} alt="Profile" className="w-24 h-24 rounded-full mr-6" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {userData?.username}
            </h1>
            {/* <p className="text-gray-600">{userData?.bio}</p> */}
            <p className="text-gray-600">
              Passionate about real-time collaboration and coding.
            </p>
            <p className="text-gray-500 mt-2">{userData?.email}</p>{" "}
            {/* Display email */}
          </div>
        </div>

        {/* Recent Documents Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Documents
          </h2>
          <ul className="space-y-3">
            {documents.map((doc) => (
              <Link to={`/document/${doc._id}`} key={doc._id}>
                <li
                  key={doc._id}
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <h3 className="text-lg font-medium text-blue-700">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last edited: {doc.updatedAt}
                  </p>
                </li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Settings Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
          <button className="w-full text-left p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition text-yellow-700 font-medium">
            Account Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
