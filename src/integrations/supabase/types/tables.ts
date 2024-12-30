export interface Categories {
  created_at: string | null;
  id: string;
  name: string;
}

export interface Comments {
  author: string;
  content: string;
  created_at: string;
  id: string;
  name: string;
  post_id: string;
}

export interface FooterContent {
  id: string;
  about_text: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_facebook: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Pages {
  content: string | null;
  created_at: string | null;
  id: string;
  last_updated: string | null;
  slug: string;
  title: string;
}

export interface PostDuplications {
  created_at: string | null;
  id: string;
  original_id: string;
}

export interface Posts {
  author: string;
  category_id: string | null;
  content: string | null;
  created_at: string | null;
  date: string | null;
  id: string;
  image: string | null;
  published: boolean | null;
  title: string;
  updated_at: string | null;
}