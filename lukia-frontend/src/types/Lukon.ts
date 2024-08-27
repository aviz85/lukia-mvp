export interface Lukon {
  id?: string; // מניח שיש ID, למרות שלא מופיע ב-Swagger
  name: string;
  description: string;
  problem: string;
  solution: string;
  user_id: string;
  tags: string[]; // הוספנו את השדה tags
  createdAt?: Date; // הוספנו גם את createdAt כאופציונלי
}