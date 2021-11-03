export interface IChatMenu {
  _id: string;
  participants: { firstName: string; lastName: string }[];
  title: string;
  message: {
    read: string[];
    departureDate: Date;
    _id: string;
    sender: string;
    text: string;
  };
  dontReadMessageCount: number;
}
