export type CommentProps = {
  message: string;
  selectionRange: {
    startOffset: number;
    endOffset: number;
  };
  isRessolved: boolean;
  _id: string;
};
