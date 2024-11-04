export type Notification = {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  type: "request" | "response";
  doc: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
