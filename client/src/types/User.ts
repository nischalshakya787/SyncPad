export interface UserProps {
  iat: number;
  id: string;
  username: string;
}

export interface User {
  _id: string; // MongoDB ObjectId as a string
  username: string; // Username of the user
  email: string; // User's email address
  password: string; // Hashed password
  createdAt: string; // Date string for when the user was created
  updatedAt: string; // Date string for when the user was last updated
  __v: number; // Version key (used by Mongoose)
}
