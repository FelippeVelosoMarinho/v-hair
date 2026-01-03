'use client';

import * as React from 'react';
import { User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Message, ConsultorType } from '@/types/chat';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  consultorType: ConsultorType;
}

export function MessageBubble({ message, consultorType }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  // Estilos baseados no tipo de consultor
  const getAssistantStyles = () => {
    switch (consultorType) {
      case 'hair':
        return 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200/50';
      case 'baldness':
        return 'bg-slate-50 border-slate-200/50';
      case 'visagism':
        return 'bg-neutral-50 border-neutral-200/50';
      default:
        return 'bg-muted';
    }
  };

  const getUserStyles = () => {
    switch (consultorType) {
      case 'hair':
        return 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white';
      case 'baldness':
        return 'bg-gradient-to-r from-slate-600 to-slate-500 text-white';
      case 'visagism':
        return 'bg-gradient-to-r from-neutral-800 to-neutral-600 text-white';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getAvatarStyles = () => {
    switch (consultorType) {
      case 'hair':
        return 'bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400';
      case 'baldness':
        return 'bg-gradient-to-br from-slate-600 to-slate-400';
      case 'visagism':
        return 'bg-gradient-to-br from-neutral-800 to-neutral-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            'text-white text-sm',
            isUser ? 'bg-blue-500' : getAvatarStyles()
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
          isUser ? getUserStyles() : getAssistantStyles(),
          !isUser && 'border'
        )}
      >
        {/* Image if present */}
        {message.imageUrl && (
          <div className="mb-3">
            <div className="relative rounded-lg overflow-hidden bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={message.imageUrl}
                alt="Uploaded"
                className="max-w-full max-h-64 object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Text content */}
        {message.content && (
          <div
            className={cn(
              'text-sm leading-relaxed whitespace-pre-wrap',
              consultorType === 'visagism' && !isUser && 'font-light',
              consultorType === 'baldness' && !isUser && 'tracking-wide'
            )}
          >
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-muted-foreground">Analisando...</span>
              </div>
            ) : (
              <MessageContent content={message.content} />
            )}
          </div>
        )}

        {/* Classification result metadata */}
        {message.metadata?.curvature && (
          <div className="mt-3 pt-3 border-t border-current/10">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="px-2 py-1 bg-white/20 rounded-full">
                Curvatura: {message.metadata.curvature}
              </span>
              <span className="px-2 py-1 bg-white/20 rounded-full">
                Confiança: {Math.round((message.metadata.confidence || 0) * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div
          className={cn(
            'text-[10px] mt-2 opacity-60',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}

// Componente para renderizar conteúdo com markdown básico
function MessageContent({ content }: { content: string }) {
  // Processar markdown básico (negrito, itálico)
  const processedContent = content
    .split('\n')
    .map((line, idx) => {
      // Processar negrito **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      
      return (
        <React.Fragment key={idx}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-semibold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            // Processar itálico *text*
            const italicParts = part.split(/(\*[^*]+\*)/g);
            return italicParts.map((italicPart, italicIdx) => {
              if (italicPart.startsWith('*') && italicPart.endsWith('*') && !italicPart.startsWith('**')) {
                return (
                  <em key={`${partIdx}-${italicIdx}`} className="italic">
                    {italicPart.slice(1, -1)}
                  </em>
                );
              }
              return italicPart;
            });
          })}
          {idx < content.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });

  return <>{processedContent}</>;
}
