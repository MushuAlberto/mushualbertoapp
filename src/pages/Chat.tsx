
import React from 'react';
import AdvancedChatInterface from '@/components/chat/AdvancedChatInterface';
import { IntelligentChatPanel } from '@/components/chat/IntelligentChatPanel';

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)]">
        <div className="lg:col-span-2">
          <AdvancedChatInterface />
        </div>
        <div className="lg:col-span-1">
          <IntelligentChatPanel 
            conversationHistory={[]}
            userContext={{}}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
