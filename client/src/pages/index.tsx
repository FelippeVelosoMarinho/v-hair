'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppSidebar } from '@/components/chat/AppSidebar';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatProvider, useChat } from '@/contexts/ChatContext';

function ChatApp() {
  const {
    state,
    activeSession,
    setConsultor,
    createNewSession,
    selectSession,
    deleteSession,
    sendMessage,
    handleImageUpload,
  } = useChat();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar
          activeConsultor={state.consultorType}
          sessions={state.sessions}
          activeSessionId={state.activeSessionId}
          onConsultorChange={setConsultor}
          onSessionSelect={selectSession}
          onNewChat={createNewSession}
          onDeleteSession={deleteSession}
        />
        
        <SidebarInset className="flex flex-col flex-1">
          {/* Mobile menu trigger */}
          <div className="md:hidden absolute top-4 left-4 z-50">
            <SidebarTrigger />
          </div>
          
          <ChatContainer
            session={activeSession}
            consultorType={state.consultorType}
            isLoading={state.isLoading}
            onSendMessage={sendMessage}
            onImageUpload={handleImageUpload}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function Home() {
  return (
    <TooltipProvider>
      <ChatProvider>
        <main className="h-screen w-screen overflow-hidden bg-background">
          <ChatApp />
        </main>
      </ChatProvider>
    </TooltipProvider>
  );
}
