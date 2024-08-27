export interface Lukon {
  id: string;
  name: string;
  description: string;
  problem: string;
  solution: string;
  user_id: string;
  tags: string[]; // Change this to an array of strings
  createdAt?: Date; // Add this optional field
}