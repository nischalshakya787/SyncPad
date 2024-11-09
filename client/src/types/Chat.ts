import { UserListProps } from "./User";

export type ChatBoxProps = {
  isChatBox: boolean;
  setIsChatBox: React.Dispatch<React.SetStateAction<boolean>>;
  docId: string | undefined;
  userId: string | undefined;
  persona: string | undefined;

  username: string | undefined;
  userList: UserListProps[];
};
export type Chat = Array<{
  senderId: string;
  message: string;
  username: string | undefined;
  persona: string | undefined;
  timestamp: string;
}>;
