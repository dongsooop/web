'use client';

import { SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import PageHeader from '@/components/ui/PageHeader';
import ChatBubble, { type ChatMessage } from './ChatBubble';

const MAX_MESSAGE_LENGTH = 64;
const MAX_INPUT_HEIGHT = 68;

const previewMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'bot',
    text: '안녕하세요! DongSoop의 챗봇 동냥이에요.\n궁금한 학교 생활이나 정보를 편하게 물어보세요.',
  },
  {
    id: 2,
    sender: 'user',
    text: '수강신청 일정은 어디에서 확인할 수 있어?',
  },
  {
    id: 3,
    sender: 'bot',
    text: '일정 화면에서 학사 일정을 확인할 수 있어요. 홈의 미니 캘린더나 일정 카드로도 바로 이동할 수 있어요.',
    url: 'https://www.dongyang.ac.kr',
  },
];

export default function ChatbotPage() {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const canSend = message.trim().length > 0;

  useEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.style.height = '0px';
    input.style.height = `${Math.min(input.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, [message]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          {previewMessages.map((chat) => (
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
                placeholder="최대 64글자까지 입력 가능해요"
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
