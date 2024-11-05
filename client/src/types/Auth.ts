export interface AuthProps {
  username: string;
  email: string;
  password: string;
}

export interface InputFieldProps {
  label: string;
  type: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string; // Ensure this is only string or undefined
  name?: string;
}
