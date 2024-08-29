export interface Lukon {
  id: string;
  name: string;
  description: string;
  problem: string;
  solution: string;
  tags: string[];
  user_id: string;
  is_deleted?: boolean;
  deleted_at?: string;
  createdAt?: Date;
}