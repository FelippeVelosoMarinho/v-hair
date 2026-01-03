'use client';

import * as React from 'react';
import { Send, ImagePlus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ConsultorType } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string, imageFile?: File) => void;
  isLoading: boolean;
  consultorType: ConsultorType;
  placeholder?: string;
  requireImage?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  consultorType,
  placeholder = 'Digite sua mensagem...',
  requireImage = false,
}: ChatInputProps) {
  const [message, setMessage] = React.useState('');
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const getButtonStyles = () => {
    switch (consultorType) {
      case 'hair':
        return 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 hover:opacity-90';
      case 'baldness':
        return 'bg-gradient-to-r from-slate-600 to-slate-500 hover:opacity-90';
      case 'visagism':
        return 'bg-gradient-to-r from-neutral-800 to-neutral-600 hover:opacity-90';
      default:
        return '';
    }
  };

  const getBorderStyles = () => {
    switch (consultorType) {
      case 'hair':
        return 'focus-within:border-pink-400 focus-within:ring-pink-200';
      case 'baldness':
        return 'focus-within:border-slate-400 focus-within:ring-slate-200';
      case 'visagism':
        return 'focus-within:border-neutral-400 focus-within:ring-neutral-200';
      default:
        return '';
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (requireImage && !imageFile) {
      return;
    }
    
    if (message.trim() || imageFile) {
      onSendMessage(message.trim(), imageFile || undefined);
      setMessage('');
      handleRemoveImage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = !isLoading && (message.trim() || imageFile) && (!requireImage || imageFile);

  return (
    <div className="p-4 border-t bg-background">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <div className="relative rounded-lg overflow-hidden border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 max-w-48 object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className={cn(
          'flex items-end gap-2 rounded-2xl border bg-background p-2 transition-all focus-within:ring-2',
          getBorderStyles()
        )}
      >
        {/* Image Upload Button */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageSelect}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 flex-shrink-0 rounded-xl"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <ImagePlus className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* Text Input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            'min-h-[44px] max-h-32 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0',
            consultorType === 'visagism' && 'font-light'
          )}
          rows={1}
        />

        {/* Send Button */}
        <Button
          type="button"
          size="icon"
          className={cn(
            'h-10 w-10 flex-shrink-0 rounded-xl text-white transition-all',
            getButtonStyles(),
            !canSubmit && 'opacity-50 cursor-not-allowed'
          )}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Helper text */}
      {requireImage && !imageFile && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          📸 Por favor, envie uma imagem para começar a análise
        </p>
      )}
    </div>
  );
}
