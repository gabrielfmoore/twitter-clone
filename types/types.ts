

export type Tweet = {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
  image_path: string | null;
  profiles: {
    id: string;
    avatar_url: string;
    name: string;
    username: string;
  };
};
