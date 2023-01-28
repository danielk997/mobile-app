export interface Question {
  id: number;
  content: string;
  answers: Answer[];
  correct: AnswerId;
}

export type AnswerId = 'a' | 'b' | 'c' | 'd';

export interface Answer {
  id: AnswerId;
  content: string;
}

export interface AnsweredQuestion {
  id: number;
  answered: boolean;
  correct: boolean;
}
