'use client';

import * as React from 'react';
import {
  ChatState,
  ChatAction,
  ChatSession,
  Message,
  ConsultorType,
} from '@/types/chat';
import { CONSULTORES } from '@/config/consultores';
import { classifyHair } from '@/lib/api';

// Generate simple IDs without external deps
const generateId = () => Math.random().toString(36).substring(2, 15);

// Initial state
const initialState: ChatState = {
  sessions: [],
  activeSessionId: null,
  consultorType: 'hair',
  isLoading: false,
  error: null,
};

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CONSULTOR':
      return {
        ...state,
        consultorType: action.payload,
        activeSessionId: null,
      };

    case 'CREATE_SESSION':
      return {
        ...state,
        sessions: [action.payload, ...state.sessions],
        activeSessionId: action.payload.id,
      };

    case 'SET_ACTIVE_SESSION':
      return {
        ...state,
        activeSessionId: action.payload,
      };

    case 'ADD_MESSAGE': {
      const { sessionId, message } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: [...session.messages, message],
                updatedAt: new Date(),
                hasImage: session.hasImage || !!message.imageUrl,
              }
            : session
        ),
      };
    }

    case 'UPDATE_MESSAGE': {
      const { sessionId, messageId, updates } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: session.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, ...updates } : msg
                ),
                updatedAt: new Date(),
              }
            : session
        ),
      };
    }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== action.payload),
        activeSessionId:
          state.activeSessionId === action.payload
            ? null
            : state.activeSessionId,
      };

    default:
      return state;
  }
}

// Context
interface ChatContextValue {
  state: ChatState;
  activeSession: ChatSession | null;
  setConsultor: (type: ConsultorType) => void;
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  sendMessage: (content: string, imageFile?: File) => Promise<void>;
  handleImageUpload: (file: File) => void;
}

const ChatContext = React.createContext<ChatContextValue | null>(null);

// Provider
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(chatReducer, initialState);

  const activeSession = React.useMemo(
    () =>
      state.sessions.find((s) => s.id === state.activeSessionId) || null,
    [state.sessions, state.activeSessionId]
  );

  const setConsultor = React.useCallback((type: ConsultorType) => {
    dispatch({ type: 'SET_CONSULTOR', payload: type });
  }, []);

  const createNewSession = React.useCallback(() => {
    const consultor = CONSULTORES[state.consultorType];
    const welcomeMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: consultor.welcomeMessage,
      timestamp: new Date(),
    };

    const newSession: ChatSession = {
      id: generateId(),
      consultorType: state.consultorType,
      title: `Nova conversa`,
      messages: [welcomeMessage],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasImage: false,
    };

    dispatch({ type: 'CREATE_SESSION', payload: newSession });
  }, [state.consultorType]);

  const selectSession = React.useCallback((sessionId: string) => {
    dispatch({ type: 'SET_ACTIVE_SESSION', payload: sessionId });
  }, []);

  const deleteSession = React.useCallback((sessionId: string) => {
    dispatch({ type: 'DELETE_SESSION', payload: sessionId });
  }, []);

  const sendMessage = React.useCallback(
    async (content: string, imageFile?: File) => {
      if (!state.activeSessionId) return;

      let imageUrl: string | undefined;
      
      // Convert file to base64 for display
      if (imageFile) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content || (imageFile ? 'Imagem enviada para análise' : ''),
        timestamp: new Date(),
        imageUrl,
      };

      dispatch({
        type: 'ADD_MESSAGE',
        payload: { sessionId: state.activeSessionId, message: userMessage },
      });

      // Add loading message
      const loadingMessageId = generateId();
      const loadingMessage: Message = {
        id: loadingMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      };

      dispatch({
        type: 'ADD_MESSAGE',
        payload: { sessionId: state.activeSessionId, message: loadingMessage },
      });

      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        let responseContent = '';
        let metadata: { curvature?: string; confidence?: number } | undefined;
        
        if (imageFile && state.consultorType === 'hair') {
          // Call the real API for hair classification
          try {
            const result = await classifyHair(imageFile);
            
            // Check if no detection was made
            if (result.curvature === 'Não detectado' || result.confidence === 0) {
              responseContent = `Analisei sua imagem! 🔍

${result.message || 'Não foi possível detectar a curvatura do cabelo na imagem.'}

**Dicas para uma melhor análise:**
• Tire uma foto mais próxima do cabelo
• Garanta boa iluminação natural
• Evite fotos muito escuras ou desfocadas
• O cabelo deve estar visível e em destaque na imagem

Envie outra foto para eu tentar novamente!`;
            } else {
              const curvatureInfo = result.curvature_info;
              metadata = {
                curvature: result.curvature,
                confidence: result.confidence,
              };

              // Build response with real data
              responseContent = `Analisei sua imagem! 🔍

Baseado na foto enviada, identifiquei que seu cabelo é do tipo **${result.curvature}${curvatureInfo?.name ? ` - ${curvatureInfo.name}` : ''}**.

**Confiança da análise:** ${Math.round(result.confidence * 100)}%

${curvatureInfo ? `**Descrição:**
${curvatureInfo.description}

**Características identificadas:**
${curvatureInfo.characteristics.map(c => `• ${c}`).join('\n')}

**Dicas de cuidados:**
${curvatureInfo.care_tips.map(t => `• ${t}`).join('\n')}

${curvatureInfo.porosity ? `**Porosidade típica:** ${curvatureInfo.porosity}` : ''}` : ''}

Gostaria de saber mais sobre produtos específicos ou técnicas de finalização para seu tipo de cabelo?`;
            }
          } catch (apiError) {
            // If API fails, provide a fallback message
            console.error('API Error:', apiError);
            responseContent = `Desculpe, não consegui analisar sua imagem no momento. 

**Possíveis motivos:**
• A API de classificação pode estar offline
• A imagem pode não estar em um formato suportado
• Não foi possível detectar cabelo na imagem

Por favor, tente novamente com uma foto frontal clara do seu cabelo, ou verifique se o servidor está rodando em http://localhost:8001`;
          }
        } else if (imageFile) {
          responseContent = `Recebi sua imagem! 📸

Esta funcionalidade (${state.consultorType === 'baldness' ? 'análise de calvície' : 'visagismo'}) ainda está em desenvolvimento. 

Em breve, poderei fornecer análises detalhadas para seu caso!`;
        } else {
          responseContent = `Entendi! Posso ajudar com mais informações sobre esse assunto. 

Me conte mais sobre o que você gostaria de saber!`;
        }

        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            sessionId: state.activeSessionId,
            messageId: loadingMessageId,
            updates: {
              content: responseContent,
              isLoading: false,
              metadata,
            },
          },
        });

        // Update session title if it's the first real message
        const session = state.sessions.find(s => s.id === state.activeSessionId);
        if (session && session.title === 'Nova conversa' && content) {
          // Could update title based on first message
        }

      } catch {
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            sessionId: state.activeSessionId,
            messageId: loadingMessageId,
            updates: {
              content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
              isLoading: false,
            },
          },
        });
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao processar mensagem' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.activeSessionId, state.consultorType, state.sessions]
  );

  const handleImageUpload = React.useCallback(
    (file: File) => {
      // If no active session, create one first
      if (!state.activeSessionId) {
        const consultor = CONSULTORES[state.consultorType];
        const welcomeMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: consultor.welcomeMessage,
          timestamp: new Date(),
        };

        const newSession: ChatSession = {
          id: generateId(),
          consultorType: state.consultorType,
          title: `Análise de ${consultor.name.toLowerCase()}`,
          messages: [welcomeMessage],
          createdAt: new Date(),
          updatedAt: new Date(),
          hasImage: false,
        };

        dispatch({ type: 'CREATE_SESSION', payload: newSession });
        
        // Send message after session is created
        setTimeout(() => {
          sendMessage('', file);
        }, 100);
      } else {
        sendMessage('', file);
      }
    },
    [state.activeSessionId, state.consultorType, sendMessage]
  );

  const value: ChatContextValue = {
    state,
    activeSession,
    setConsultor,
    createNewSession,
    selectSession,
    deleteSession,
    sendMessage,
    handleImageUpload,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Hook
export function useChat() {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
