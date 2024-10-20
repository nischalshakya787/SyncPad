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
