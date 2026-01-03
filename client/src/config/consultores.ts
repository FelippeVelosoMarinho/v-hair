/**
 * Configuração dos Consultores e seus Temas
 */

import { ConsultorInfo, ConsultorType } from '@/types/chat';

export const CONSULTORES: Record<ConsultorType, ConsultorInfo> = {
  hair: {
    id: 'hair',
    name: 'Consultor de Cabelo',
    description: 'Análise de curvatura e recomendações personalizadas',
    icon: '💇',
    welcomeMessage: `Olá! 👋 Eu sou seu consultor de cabelo virtual!

Vou te ajudar a descobrir seu tipo de curvatura e recomendar os melhores tratamentos e produtos para você.

Para começar, preciso de uma **foto frontal do seu cabelo**. Isso me ajudará a analisar sua curvatura com precisão! 📸`,
    imagePrompt: 'Envie uma foto frontal mostrando seu cabelo natural',
    theme: {
      primary: 'oklch(0.7 0.15 330)',      // Rosa vibrante
      secondary: 'oklch(0.65 0.18 280)',    // Roxo
      accent: 'oklch(0.75 0.2 50)',         // Laranja/Dourado
      background: 'oklch(0.98 0.01 330)',   // Rosa bem claro
      gradientFrom: 'oklch(0.85 0.1 330)',  // Rosa suave
      gradientTo: 'oklch(0.85 0.1 280)',    // Lilás suave
      avatarBg: 'linear-gradient(135deg, #ff6b9d 0%, #c44dff 50%, #ffb347 100%)',
    },
  },

  baldness: {
    id: 'baldness',
    name: 'Consultor de Calvície',
    description: 'Análise capilar e tratamentos para alopecia',
    icon: '🏥',
    welcomeMessage: `Bem-vindo à nossa consulta virtual.

Sou especializado em análise capilar e posso ajudá-lo a identificar padrões de queda de cabelo e sugerir tratamentos adequados.

Para uma avaliação precisa, envie uma **foto frontal do seu couro cabeludo** em boa iluminação.

*Lembre-se: esta é uma análise preliminar. Consulte sempre um dermatologista.*`,
    imagePrompt: 'Envie uma foto frontal do couro cabeludo com boa iluminação',
    theme: {
      primary: 'oklch(0.45 0.03 250)',      // Azul acinzentado
      secondary: 'oklch(0.55 0.02 200)',    // Cinza azulado
      accent: 'oklch(0.6 0.1 180)',         // Teal suave
      background: 'oklch(0.99 0 0)',        // Branco puro
      gradientFrom: 'oklch(0.97 0.01 250)', // Cinza muito claro
      gradientTo: 'oklch(0.98 0.01 200)',   // Branco azulado
      avatarBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', sans-serif",
    },
  },

  visagism: {
    id: 'visagism',
    name: 'Consultor de Visagismo',
    description: 'Análise facial e harmonização visual',
    icon: '✨',
    welcomeMessage: `Olá! Bem-vindo ao seu consultor de visagismo.

Vou analisar as proporções do seu rosto para recomendar cortes, cores e estilos que harmonizem com suas características únicas.

Para começar, preciso de uma **foto frontal do seu rosto**, com cabelo preso ou afastado para visualizar o formato.`,
    imagePrompt: 'Envie uma foto frontal do rosto com cabelo afastado',
    theme: {
      primary: 'oklch(0.25 0 0)',           // Preto elegante
      secondary: 'oklch(0.5 0 0)',          // Cinza médio
      accent: 'oklch(0.85 0.05 90)',        // Dourado/Bege suave
      background: 'oklch(0.995 0.005 90)',  // Off-white
      gradientFrom: 'oklch(0.98 0 0)',      // Branco
      gradientTo: 'oklch(0.95 0.02 90)',    // Creme
      avatarBg: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
      fontFamily: "'Cormorant Garamond', serif",
    },
  },
};

// Helper para obter configuração de consultor
export const getConsultorConfig = (type: ConsultorType): ConsultorInfo => {
  return CONSULTORES[type];
};

// CSS Variables por consultor
export const getConsultorCSSVariables = (type: ConsultorType): Record<string, string> => {
  const theme = CONSULTORES[type].theme;
  return {
    '--consultor-primary': theme.primary,
    '--consultor-secondary': theme.secondary,
    '--consultor-accent': theme.accent,
    '--consultor-background': theme.background,
    '--consultor-gradient-from': theme.gradientFrom,
    '--consultor-gradient-to': theme.gradientTo,
  };
};
