"use client";

import { ConversationList } from '../_components/conversation-list';

export default function MessagesPage() {
    return (
        <div>
            <h1 className="text-xl font-semibold text-neutral-900 mb-4">Messages</h1>
            <ConversationList />
        </div>
    );
}
