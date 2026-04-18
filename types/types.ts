

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
  comments: { count: number }[];
  retweeted_by?: {
    id: string;
    name: string;
    username: string;
  };
  retweet_key?: string;
};
