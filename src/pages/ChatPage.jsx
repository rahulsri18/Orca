import React from 'react';
import { ChatInterface } from '../components/chat/ChatInterface';

export function ChatPage({
  onHighlightMap,
  initialQuery = null
}) {
  return (
    <div className="w-full h-full">
      <ChatInterface
        onHighlightMap={onHighlightMap}
        initialQuery={initialQuery}
      />
    </div>
  );
}

