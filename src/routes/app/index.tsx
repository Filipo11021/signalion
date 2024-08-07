import { createFileRoute } from '@tanstack/react-router';
import { ChatView } from '@/modules/chat/chat-view';

export const Route = createFileRoute('/app/')({
  component: ChatView,
});
