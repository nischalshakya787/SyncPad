import { Button, InputField } from "../components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import key from "../assets/4c358706a1bed3348d3637a964e9b5efa950bbdf6d5ea34a2cf5c78953a839a8.svg";
import { useFormik } from "formik";
import { validationSchema } from "../schema";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProps } from "../types/Auth";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLaoding] = useState<boolean>(false);
  const isLogin = location.pathname === "/login";
  const { values, handleChange, handleBlur, touched, errors, handleSubmit } =
    useFormik({
      initialValues: {
        username: "",
        email: "",
        password: "",
      },
      validationSchema: validationSchema(isLogin),
      onSubmit: (values) => {
        if (isLogin) {
          handleLogin(values);
        } else {
          handleSignup(values);
        }
      },
    });
  const userData = useContext(UserContext);
  if (!userData) {
    throw Error("Error");
  }
  const { setUser, setUserId } = userData;
  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/profile", {
        method: "GET",
        credentials: "include", //Includes cookiee
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        setUser(null);
        setUserId(null);
      }

      const data = await response.json();
      setUser(data.user);
      setUserId(data.user.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleLogin = async (values: AuthProps) => {
    const { username, password } = values;
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      //If the email is verified by the user it will navigate to the home page
      if (!data.status) {
        toast.error(data.message);
      }
      if (data.status) {
        fetchUserData();
        navigate("/", {
          state: { toastMessage: "Login successful!", from: "login" },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSignup = async (values: AuthProps) => {
    const { username, email, password } = values;

    try {
      setIsLaoding(true);
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      setIsLaoding(false);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        return;
      }
      const data = await response.json();

      if (data.status) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <main className="flex overflow-hidden flex-col justify-center items-center px-20 py-16 text-xl font-semibold bg-gray-100 max-md:px-5">
        <section className="flex flex-col items-center py-20 max-w-full bg-white rounded-lg border-2 border-solid border-black border-opacity-30 w-[900px]">
          <div className="flex flex-col items-start self-stretch px-20 w-full text-gray-800 max-md:px-5 max-md:max-w-full">
            <h1 className="text-4xl font-extrabold max-md:max-w-full">
              {isLogin ? "Sign in To Your Account" : "Create your account"}
            </h1>
            <p className="mt-3.5 text-stone-500">
              {isLogin
                ? "Welcome back! Please enter your details"
                : "join us today and be part of our community"}
            </p>

            <form className="w-full" onSubmit={handleSubmit}>
              {isLogin ? (
                <InputField
                  label="Username"
                  type="text"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.username && errors.username
                      ? errors.username
                      : undefined
                  }
                />
              ) : (
                <>
                  <InputField
                    label="Username"
                    type="text"
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
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.email && errors.email ? errors.email : undefined
                    }
                  />
                </>
              )}
              <InputField
                label="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.password && errors.password
                    ? errors.password
                    : undefined
                }
              />
              {isLogin && (
                <div className="flex gap-3.5 self-end mt-4 text-base text-black">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/4c358706a1bed3348d3637a964e9b5efa950bbdf6d5ea34a2cf5c78953a839a8?placeholderIfAbsent=true&apiKey=b5e41414aacf42a3bef6031063a6b7ae"
                    alt=""
                    className="object-contain shrink-0 w-4 aspect-square"
                  />
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              )}
              <Button
                text={isLogin ? "Sign in" : "Sign up"}
                isLoading={isLoading}
              />
            </form>
          </div>
          {isLogin && (
            <>
              <p className="mt-12 text-lg text-black max-md:mt-10">
                Don't have account?{" "}
                <a href="/signup" className="underline">
                  Sign up here
                </a>
              </p>
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default Auth;
