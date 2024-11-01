export type Notification = {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  doc: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
