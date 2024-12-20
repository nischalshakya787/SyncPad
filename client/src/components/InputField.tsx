import React from "react";
import { InputFieldProps } from "../types/Auth";

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  onBlur,
  error,
  name,
}) => {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mt-4">
      <label htmlFor={id} className="mb-2 text-[18px]">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className={`flex shrink-0 self-stretch w-full bg-white rounded-md border-2 focus:outline-none  px-4 ${
          error ? "border-red-400" : "border-gray-300"
        } h-[53px]`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
