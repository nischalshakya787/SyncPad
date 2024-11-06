import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation for email field
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setError("");

    try {
      // const response = await fetch('/api/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // const result = await response.json();

      // if (result.success) {
      setMessage("A password reset link has been sent to your email.");
      // } else {
      //   setError('Failed to send reset link. Please try again.');
      // }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <label htmlFor="email" className="block text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          required
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full mt-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
