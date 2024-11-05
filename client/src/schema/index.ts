import * as Yup from "yup";

export const validationSchema = (isLogin: boolean) => {
  return Yup.object({
    username: Yup.string().required("Username is required"),
    email: isLogin
      ? Yup.string().notRequired()
      : Yup.string()
          .email("Please enter a valid Email")
          .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at lease 6 characters long"),
  });
};

// Schema for editing profile information
export const profileSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

// Schema for changing password
export const passwordSchema = Yup.object({
  password: Yup.string().required("Current password is required"),
  repassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  new_password: Yup.string()
    .min(8, "New password must be at least 8 characters")
    .required("New password is required"),
});
