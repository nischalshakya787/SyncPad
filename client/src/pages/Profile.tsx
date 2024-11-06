import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { User } from "../types/User";
import { Link } from "react-router-dom";
import profile from "../assets/image/profile.jpg";
import { useFormik } from "formik";
import { passwordSchema, profileSchema } from "../schema";
import { InputField } from "../components";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  // Placeholder user data
  const [userData, setUserData] = useState<User>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
  }, [user]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-6">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <img
            src={profile}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-6"
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {userData?.username}
            </h1>
            <p className="text-gray-600">{userData?.description}</p>
            <p className="text-gray-500 mt-2">{userData?.email}</p>{" "}
          </div>
        </div>

        {/* Recent Documents Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Documents
          </h2>
          {documents.length === 0 ? (
            <p className="mx-2 text-gray-600">No Documents Found.</p>
          ) : (
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
          )}
        </div>

        {/* Settings Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
          <button
            className="w-full text-left p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition text-yellow-700 font-medium"
            onClick={() => setIsModalOpen(true)}
          >
            Account Settings
          </button>
        </div>
      </div>
      {isModalOpen && (
        <AccountSetting
          setIsModalOpen={setIsModalOpen}
          userData={userData}
          setUserData={setUserData}
        />
      )}
    </div>
  );
};

type AccountSettingProps = {
  setIsModalOpen: (value: boolean) => void;
  userData: User | undefined;
  setUserData: (value: User) => void;
};
type valueProps = {
  email: string | undefined;
  username: string | undefined;
  description: string | undefined;
  password: string;
  new_password: string;
};

const AccountSetting = ({
  setIsModalOpen,
  userData,
  setUserData,
}: AccountSettingProps) => {
  const [option, setOption] = useState<string>("profile");

  // Select schema based on the option
  const validationSchema =
    option === "profile" ? profileSchema : passwordSchema;

  const { values, handleChange, handleBlur, touched, errors, handleSubmit } =
    useFormik({
      initialValues: {
        email: userData?.email,
        username: userData?.username,
        description: userData?.description,
        password: "",
        new_password: "",
      },
      validationSchema,
      onSubmit: (values) => {
        // Handle form submission based on option
        if (option === "profile") {
          handleProfile(values);
        } else {
          handlePassword(values);
        }
      },
    });
  const handleProfile = async (values: valueProps) => {
    const { username, email, description } = values;
    try {
      const response = await fetch(
        `http://localhost:3000/auth/update-profile/${userData?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
          body: JSON.stringify({ username, email, description }),
        }
      );
      if (response.ok) {
        toast.success("Profile Updated Successfully");
        const data = await response.json();
        setUserData(data.user);
        setIsModalOpen(false);
      } else {
        toast.error("Failed to Update Profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePassword = async (values: valueProps) => {
    const { password, new_password } = values;
    try {
      await fetch(
        `http://localhost:3000/auth/change-password/${userData?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
          body: JSON.stringify({ password, new_password }),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Account Settings</p>
          <button
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <div className="action flex items-center justify-center gap-10">
            <button
              className="bg-blue-200 p-2 rounded"
              onClick={() => setOption("profile")}
            >
              Edit Profile
            </button>
            <button
              className="bg-red-200 p-2 rounded"
              onClick={() => setOption("password")}
            >
              Change Password
            </button>
          </div>

          {/* Render inputs based on selected option */}
          <form onSubmit={handleSubmit}>
            {option === "profile" ? (
              <>
                <InputField
                  label="Username"
                  type="text"
                  name="username" // <-- Add name attribute
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.username && errors.username
                      ? errors.username
                      : undefined
                  }
                />
                <InputField
                  label="Email"
                  type="email"
                  name="email" // <-- Add name attribute
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.email && errors.email ? errors.email : undefined
                  }
                />
                <label className="mt-4 text-gray-700">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  className={`mt-2 p-2 border rounded-md w-full ${
                    touched.description && errors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></textarea>
                {touched.description && errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </>
            ) : (
              <>
                <InputField
                  label="Current Password"
                  type="password"
                  name="password" // <-- Add name attribute
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.password && errors.password
                      ? errors.password
                      : undefined
                  }
                />
                <InputField
                  label="New Password"
                  type="password"
                  name="new_password" // <-- Add name attribute
                  value={values.new_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.new_password && errors.new_password
                      ? errors.new_password
                      : undefined
                  }
                />
              </>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
              type="submit"
            >
              {option === "profile" ? "Save Changes" : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
