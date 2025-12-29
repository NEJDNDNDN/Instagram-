
export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  type: 'intro' | 'content' | 'visual' | 'qa' | 'summary';
  icon?: string;
  image?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}
