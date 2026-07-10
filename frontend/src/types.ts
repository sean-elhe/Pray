export type Prayer = {
  id: number;
  content: string;
  is_answered: boolean;
  created_at: string;
  name: string;
  is_public: boolean;
};

export type Notification = {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
};
