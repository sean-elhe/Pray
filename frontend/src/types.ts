export type Prayer = {
  id: number;
  content: string;
  is_answered: boolean;
  created_at: string;
  user_name: string;
  is_public: boolean;

  category_id: number | null;
  category_name: string | null;
  category_color: string | null;
};

export type Notification = {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Category = {
  id: number;
  name: string;
  color: string;
};
