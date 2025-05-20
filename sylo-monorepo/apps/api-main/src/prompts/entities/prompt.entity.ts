export interface Prompt {
  id: string; // uuid
  user_id: string; // uuid
  title: string;
  content: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}
