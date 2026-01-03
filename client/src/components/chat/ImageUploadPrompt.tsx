'use client';

import * as React from 'react';
import { Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConsultorType } from '@/types/chat';
import { CONSULTORES } from '@/config/consultores';
import { cn } from '@/lib/utils';

interface ImageUploadPromptProps {
  consultorType: ConsultorType;
  onImageSelect: (file: File) => void;
}

export function ImageUploadPrompt({
  consultorType,
  onImageSelect,
}: ImageUploadPromptProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const consultor = CONSULTORES[consultorType];

  const getStyles = () => {
    switch (consultorType) {
      case 'hair':
        return {
          gradient: 'from-pink-500/10 via-purple-500/10 to-orange-400/10',
          border: 'border-pink-300',
          hoverBorder: 'hover:border-pink-400',
          icon: 'text-pink-500',
          button: 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400',
        };
      case 'baldness':
        return {
          gradient: 'from-slate-500/5 to-slate-400/5',
          border: 'border-slate-300',
          hoverBorder: 'hover:border-slate-400',
          icon: 'text-slate-500',
          button: 'bg-gradient-to-r from-slate-600 to-slate-500',
        };
      case 'visagism':
        return {
          gradient: 'from-neutral-500/5 to-neutral-400/5',
          border: 'border-neutral-300',
          hoverBorder: 'hover:border-neutral-500',
          icon: 'text-neutral-600',
          button: 'bg-gradient-to-r from-neutral-800 to-neutral-600',
        };
      default:
        return {
          gradient: 'from-primary/10 to-primary/5',
          border: 'border-border',
          hoverBorder: 'hover:border-primary',
          icon: 'text-primary',
          button: 'bg-primary',
        };
    }
  };

  const styles = getStyles();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card
        className={cn(
          'max-w-lg w-full transition-all duration-300',
          `bg-gradient-to-br ${styles.gradient}`,
          isDragging && 'scale-105 shadow-xl'
        )}
      >
        <CardContent className="p-8">
          {/* Icon */}
          <div className="text-center mb-6">
            <div
              className={cn(
                'inline-flex items-center justify-center w-20 h-20 rounded-full mb-4',
                `bg-gradient-to-br ${styles.gradient}`,
                styles.border,
                'border-2'
              )}
            >
              {consultorType === 'hair' ? (
                <span className="text-4xl">💇</span>
              ) : consultorType === 'baldness' ? (
                <span className="text-4xl">🔬</span>
              ) : (
                <span className="text-4xl">✨</span>
              )}
            </div>
            
            <h2
              className={cn(
                'text-xl font-semibold mb-2',
                consultorType === 'visagism' && 'font-light text-2xl',
                consultorType === 'baldness' && 'tracking-wide'
              )}
            >
              Vamos começar!
            </h2>
            
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {consultor.imagePrompt}
            </p>
          </div>

          {/* Drop Zone */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
              styles.border,
              styles.hoverBorder,
              isDragging && `${styles.border} bg-white/50 scale-[1.02]`
            )}
          >
            <Upload className={cn('h-10 w-10 mx-auto mb-4', styles.icon)} />
            
            <p className="text-sm font-medium mb-1">
              Arraste uma imagem ou clique para selecionar
            </p>
            
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou JPEG até 10MB
            </p>
          </div>

          {/* Alternative: Camera */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground mb-3">ou</p>
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
              Usar câmera
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <p className="text-xs font-medium mb-2">💡 Dicas para uma boa foto:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {consultorType === 'hair' && (
                <>
                  <li>• Cabelo solto e natural</li>
                  <li>• Boa iluminação</li>
                  <li>• Foto frontal</li>
                </>
              )}
              {consultorType === 'baldness' && (
                <>
                  <li>• Couro cabeludo visível</li>
                  <li>• Iluminação clara e uniforme</li>
                  <li>• Várias angulações ajudam</li>
                </>
              )}
              {consultorType === 'visagism' && (
                <>
                  <li>• Rosto centralizado</li>
                  <li>• Cabelo afastado da face</li>
                  <li>• Expressão neutra</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
