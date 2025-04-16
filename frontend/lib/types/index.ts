export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface TextProcess {
  id: number;
  input_text: string;
  output_text: string;
  process_type: string;
  created_at: string;
}

export interface TextProcessHistory {
  items: TextProcess[];
  total: number;
}

export type ProcessType = "summary" | "bullet_points";
