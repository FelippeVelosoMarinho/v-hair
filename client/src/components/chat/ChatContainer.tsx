'use client';

import * as React from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ImageUploadPrompt } from './ImageUploadPrompt';
import { ConsultorType, ChatSession } from '@/types/chat';
import { CONSULTORES } from '@/config/consultores';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  session: ChatSession | null;
  consultorType: ConsultorType;
  isLoading: boolean;
  onSendMessage: (content: string, imageFile?: File) => void;
  onImageUpload: (file: File) => void;
}

export function ChatContainer({
  session,
  consultorType,
  isLoading,
  onSendMessage,
  onImageUpload,
}: ChatContainerProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const consultor = CONSULTORES[consultorType];

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [session?.messages, scrollToBottom]);

  const getBackgroundStyles = () => {
    switch (consultorType) {
      case 'hair':
        return 'bg-gradient-to-b from-pink-50/30 via-purple-50/20 to-orange-50/10';
      case 'baldness':
        return 'bg-gradient-to-b from-slate-50/50 to-white';
      case 'visagism':
        return 'bg-gradient-to-b from-neutral-50/30 to-white';
      default:
        return 'bg-background';
    }
  };

  const getHeaderStyles = () => {
    switch (consultorType) {
      case 'hair':
        return 'border-b border-pink-200/50 bg-white/80';
      case 'baldness':
        return 'border-b border-slate-200/50 bg-white/90';
      case 'visagism':
        return 'border-b border-neutral-200/30 bg-white/95';
      default:
        return 'border-b bg-background';
    }
  };

  // Show image upload prompt if no image has been uploaded yet
  const showImagePrompt = !session?.hasImage && (!session?.messages || session.messages.length <= 1);

  return (
    <div className={cn('flex flex-col h-screen overflow-hidden', getBackgroundStyles())}>
      {/* Header */}
      <header className={cn('flex-shrink-0 px-6 py-4 backdrop-blur-sm', getHeaderStyles())}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{consultor.icon}</span>
          <div>
            <h1
              className={cn(
                'font-semibold',
                consultorType === 'visagism' && 'font-light text-lg',
                consultorType === 'baldness' && 'tracking-wide'
              )}
            >
              {consultor.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              {session?.title || consultor.description}
            </p>
          </div>
        </div>
      </header>

      {/* Messages or Upload Prompt */}
      {showImagePrompt ? (
        <ImageUploadPrompt
          consultorType={consultorType}
          onImageSelect={onImageUpload}
        />
      ) : (
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto min-h-0"
        >
          <div className="py-4 space-y-1 pb-4">
            {session?.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                consultorType={consultorType}
              />
            ))}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input */}
      {!showImagePrompt && (
        <div className="flex-shrink-0">
          <ChatInput
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            consultorType={consultorType}
            placeholder={consultor.imagePrompt}
          />
        </div>
      )}
    </div>
  );
}
