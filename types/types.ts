export type TTransaction = {
  id: string;
  user_id: string;
  name: string;
  category: TCategory;
  price: number;
  created_at: string;
  updated_at: string;
};

export type TCategory = {
  id: string;
  name: string;
  user_id: string;
  user_made: boolean;
  created_at: string;
  updated_at: string;
};
