'use client';

import * as React from 'react';
import {
  Scissors,
  Sparkles,
  Stethoscope,
  Plus,
  MessageSquare,
  Trash2,
  ChevronDown,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ConsultorType, ChatSession } from '@/types/chat';
import { CONSULTORES } from '@/config/consultores';

interface AppSidebarProps {
  activeConsultor: ConsultorType;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onConsultorChange: (type: ConsultorType) => void;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
}

const consultorIcons: Record<ConsultorType, React.ReactNode> = {
  hair: <Scissors className="h-5 w-5" />,
  baldness: <Stethoscope className="h-5 w-5" />,
  visagism: <Sparkles className="h-5 w-5" />,
};

const consultorColors: Record<ConsultorType, string> = {
  hair: 'from-pink-500 via-purple-500 to-orange-400',
  baldness: 'from-slate-600 to-slate-400',
  visagism: 'from-neutral-800 to-neutral-500',
};

export function AppSidebar({
  activeConsultor,
  sessions,
  activeSessionId,
  onConsultorChange,
  onSessionSelect,
  onNewChat,
  onDeleteSession,
}: AppSidebarProps) {
  const [isDark, setIsDark] = React.useState(false);
  const activeConsultorInfo = CONSULTORES[activeConsultor];

  // Filtrar sessões pelo consultor ativo
  const filteredSessions = sessions.filter(
    (session) => session.consultorType === activeConsultor
  );

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        {/* Logo/Title */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${consultorColors[activeConsultor]} flex items-center justify-center text-white shadow-lg`}
          >
            {consultorIcons[activeConsultor]}
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight">Zohan</h1>
            <p className="text-xs text-muted-foreground">Virtual</p>
          </div>
        </div>

        {/* Consultor Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between gap-2 h-auto py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{activeConsultorInfo.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-medium">{activeConsultorInfo.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                    {activeConsultorInfo.description}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[260px]">
            {Object.values(CONSULTORES).map((consultor) => (
              <DropdownMenuItem
                key={consultor.id}
                onClick={() => onConsultorChange(consultor.id)}
                className="flex items-center gap-3 py-3 cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${consultorColors[consultor.id]} flex items-center justify-center text-white`}
                >
                  {consultorIcons[consultor.id]}
                </div>
                <div>
                  <p className="text-sm font-medium">{consultor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {consultor.description}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={onNewChat}
            className={`w-full gap-2 bg-gradient-to-r ${consultorColors[activeConsultor]} text-white hover:opacity-90 transition-opacity`}
          >
            <Plus className="h-4 w-4" />
            Nova Conversa
          </Button>
        </div>

        {/* Chat History */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground">
            Conversas Recentes
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-380px)]">
              <SidebarMenu className="px-2">
                {filteredSessions.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Nenhuma conversa ainda
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Clique em &quot;Nova Conversa&quot; para começar
                    </p>
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <SidebarMenuItem key={session.id}>
                      <SidebarMenuButton
                        onClick={() => onSessionSelect(session.id)}
                        isActive={session.id === activeSessionId}
                        className="group w-full justify-between pr-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MessageSquare className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate text-sm">{session.title}</span>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession(session.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Excluir conversa</TooltipContent>
                        </Tooltip>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Separator className="mb-4" />
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
