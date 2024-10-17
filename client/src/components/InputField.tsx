import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, type }) => {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mt-10">
      <label htmlFor={id} className="block mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="flex shrink-0 self-stretch w-full bg-white rounded-md border border-solid border-black border-opacity-30 h-[53px]"
      />
    </div>
  );
};

export default InputField;
