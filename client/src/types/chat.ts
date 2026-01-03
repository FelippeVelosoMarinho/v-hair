/**
 * Types for Chat Application
 */

// Tipos de consultores disponíveis
export type ConsultorType = 'hair' | 'baldness' | 'visagism';

// Informações de cada consultor
export interface ConsultorInfo {
  id: ConsultorType;
  name: string;
  description: string;
  icon: string;
  welcomeMessage: string;
  imagePrompt: string;
  theme: ConsultorTheme;
}

// Tema visual de cada consultor
export interface ConsultorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradientFrom: string;
  gradientTo: string;
  avatarBg: string;
  fontFamily?: string;
}

// Mensagem do chat
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  isLoading?: boolean;
  metadata?: {
    curvature?: string;
    confidence?: number;
    products?: Product[];
  };
}

// Conversa/Sessão de chat
export interface ChatSession {
  id: string;
  consultorType: ConsultorType;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  hasImage: boolean;
}

// Produto recomendado
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
  link?: string;
  category: 'hidratacao' | 'nutricao' | 'reconstrucao' | 'finalizacao';
}

// Resultado da classificação de cabelo
export interface HairClassificationResult {
  curvature: string;
  confidence: number;
  curvatureInfo?: {
    id: string;
    name: string;
    description: string;
    characteristics: string[];
    careTips: string[];
  };
}

// Estado do chat
export interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  consultorType: ConsultorType;
  isLoading: boolean;
  error: string | null;
}

// Ações do chat
export type ChatAction =
  | { type: 'SET_CONSULTOR'; payload: ConsultorType }
  | { type: 'CREATE_SESSION'; payload: ChatSession }
  | { type: 'SET_ACTIVE_SESSION'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: Message } }
  | { type: 'UPDATE_MESSAGE'; payload: { sessionId: string; messageId: string; updates: Partial<Message> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'DELETE_SESSION'; payload: string };
