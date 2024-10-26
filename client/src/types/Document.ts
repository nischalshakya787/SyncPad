export interface DocumentCardProps {
  title: string;
  date: string;
}

export interface Document {
  _id: string;
  title: string;
  value: string;
  creator: string;
  collab: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
