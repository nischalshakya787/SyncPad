const Profile = () => {
  // Placeholder user data
  const userData = {
    username: "Nischal",
    bio: "Passionate about real-time collaboration and coding.",
    profilePic: "https://via.placeholder.com/150", // Replace with user's profile picture URL
  };

  const recentDocuments = [
    { id: 1, title: "Project Proposal", date: "2024-10-20" },
    { id: 2, title: "Meeting Notes", date: "2024-11-02" },
    { id: 3, title: "Research Paper", date: "2024-10-18" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-6">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <img
            src={userData.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-6"
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {userData.username}
            </h1>
            <p className="text-gray-600">{userData.bio}</p>
          </div>
        </div>

        {/* Recent Documents Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Documents
          </h2>
          <ul className="space-y-3">
            {recentDocuments.map((doc) => (
              <li
                key={doc.id}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <h3 className="text-lg font-medium text-blue-700">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-500">Last edited: {doc.date}</p>
              </li>
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
