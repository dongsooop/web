'use client';

import { SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import PageHeader from '@/components/ui/PageHeader';
import { ApiError } from '@/lib/api/apiError';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';
import { requestChatbot } from '../client/chatbot.api';
import type { ChatMessage } from '../types';
import ChatBubble from './ChatBubble';

const MAX_MESSAGE_LENGTH = 64;
const MAX_INPUT_HEIGHT = 68;

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'bot',
    text: '안녕하세요! DongSoop의 챗봇 동냥이에요.\n궁금한 학교 생활에 대해 편하게 물어보세요.',
  },
];

export default function ChatbotPage() {
  const appCheckReady = useAppCheckStore((state) => state.isInitialized && !!state.token);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const nextIdRef = useRef(initialMessages.length + 1);
  const canSend = message.trim().length > 0 && !isSending && appCheckReady;

  useEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.style.height = '0px';
    input.style.height = `${Math.min(input.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, [message]);

  const createMessage = (payload: Omit<ChatMessage, 'id'>): ChatMessage => {
    const next = nextIdRef.current;
    nextIdRef.current += 1;

    return {
      id: next,
      ...payload,
    };
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = message.trim();

    if (!trimmed || isSending || !appCheckReady) {
      return;
    }

    const userMessage = createMessage({
      sender: 'user',
      text: trimmed,
    });

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsSending(true);

    try {
      const response = await requestChatbot({ text: trimmed });
      const botMessage = createMessage({
        sender: 'bot',
        text: response.text,
        url: response.url,
      });

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('[chatbot] request failed', {
          status: error.status,
          message: error.message,
        });
      } else {
        console.error('[chatbot] request failed', error);
      }

      const botMessage = createMessage({
        sender: 'bot',
        text: getErrorMessage('chatbot', error),
      });

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-content mx-auto flex min-h-[calc(100dvh-8rem)] w-full flex-col px-4 pb-4">
      <div className="pt-2">
        <PageHeader title="챗봇 동냥이" showBackButton />
      </div>

      <section className="flex flex-1 flex-col pt-4" aria-label="챗봇 대화">
        <div className="flex justify-center">
          <div className="bg-gray1 text-bodySm text-gray5 rounded-2xl px-4 py-3">
            동냥이와의 대화 내용은 저장되지 않아요
          </div>
        </div>

        <ul className="mt-3">
          {messages.map((chat) => (
            <li key={chat.id}>
              <ChatBubble message={chat} />
            </li>
          ))}
        </ul>
      </section>

      <form className="sticky bottom-0 mt-6" onSubmit={submit}>
        <div className="border-gray1 rounded-3xl border bg-white px-4 py-2 shadow-sm">
          <div className="flex items-end gap-3">
            <label className="flex min-w-0 flex-1 justify-center">
              <span className="sr-only">챗봇 질문 입력</span>
              <textarea
                ref={inputRef}
                value={message}
                onChange={(event) => setMessage(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                placeholder={
                  appCheckReady ? '최대 64글자까지 입력 가능해요' : '챗봇을 준비하는 중이에요'
                }
                rows={1}
                className="text-body placeholder:text-gray4 min-h-11 w-full resize-none overflow-y-auto bg-transparent py-2.5 leading-6 text-black outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={!canSend}
              className="bg-primary hover:bg-primary/90 disabled:bg-gray2 disabled:text-gray4 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition disabled:cursor-not-allowed"
              aria-label="메시지 전송"
            >
              <SendHorizontal className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="px-2 pt-1">
          <span className="text-caption text-gray4 block text-right">
            {message.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </form>
    </div>
  );
}
