const VerifyEmail = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Email Not Verified</h2>
      <p style={styles.message}>
        Please verify your email to activate your account. Check your inbox for
        a verification link.
      </p>
      <p style={styles.note}>
        If you didn’t receive an email, please check your spam folder or request
        a new verification email.
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const, // Cast to 'const' to fix TypeScript error
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "20px",
  },
  heading: {
    fontSize: "24px",
    color: "#1f2937",
    marginBottom: "10px",
  },
  message: {
    fontSize: "16px",
    color: "#4b5563",
    textAlign: "center" as const,
    maxWidth: "400px",
  },
  note: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "20px",
    textAlign: "center" as const,
  },
};

export default VerifyEmail;
