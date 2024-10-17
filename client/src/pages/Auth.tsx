import React from "react";
import { Button, InputField } from "../components";

interface AuthProps {}

const Auth: React.FC<AuthProps> = () => {
  return (
    <main className="flex overflow-hidden flex-col justify-center items-center px-20 py-24 text-xl font-semibold bg-gray-100 max-md:px-5">
      <section className="flex flex-col items-center py-20 max-w-full bg-white rounded-lg border-2 border-solid border-black border-opacity-30 w-[900px]">
        <div className="flex flex-col items-start self-stretch px-20 w-full text-gray-800 max-md:px-5 max-md:max-w-full">
          <h1 className="text-4xl font-extrabold max-md:max-w-full">
            Sign in To Your Account
          </h1>
          <p className="mt-3.5 text-stone-500">
            Welcome back! Please enter your details
          </p>
          <form className="w-full">
            <InputField label="Email or Username" type="text" />
            <InputField label="Password" type="password" />
            <div className="flex gap-3.5 self-end mt-4 text-base text-black">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4c358706a1bed3348d3637a964e9b5efa950bbdf6d5ea34a2cf5c78953a839a8?placeholderIfAbsent=true&apiKey=b5e41414aacf42a3bef6031063a6b7ae"
                alt=""
                className="object-contain shrink-0 w-4 aspect-square"
              />
              <a href="#" className="basis-auto">
                Forgot Password?
              </a>
            </div>
            <Button text="Sign in" />
          </form>
        </div>
        <p className="mt-8 text-base text-stone-500">Or Sign in with</p>
        <button className="flex gap-5 px-4 py-2 mt-5 max-w-full whitespace-nowrap bg-white rounded-md border border-solid border-black border-opacity-30 text-stone-500 w-[140px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/23ccafae1aa7dbd2cc177e58cc25202ef4cd374c85b512558b62d76b1285bbe9?placeholderIfAbsent=true&apiKey=b5e41414aacf42a3bef6031063a6b7ae"
            alt=""
            className="object-contain shrink-0 w-6 aspect-square"
          />
          <span>Google</span>
        </button>
        <p className="mt-12 text-lg text-black max-md:mt-10">
          Don't have account?{" "}
          <a href="#" className="underline">
            Sign up here
          </a>
        </p>
      </section>
    </main>
  );
};

export default Auth;
