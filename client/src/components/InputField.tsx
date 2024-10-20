import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string; // Ensure this is only string or undefined
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  onBlur,
  error,
}) => {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mt-6">
      <label htmlFor={id} className="mb-2 text-[18px]">
        {label}
      </label>
      <input
        type={type}
        id={id}
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
