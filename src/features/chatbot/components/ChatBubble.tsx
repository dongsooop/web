import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export type ChatMessage = {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  url?: string;
};

type ChatBubbleProps = {
  message: ChatMessage;
};

export default function ChatBubble({ message }: ChatBubbleProps) {
  const { sender, text, url } = message;
  const isBot = sender === 'bot';

  if (!isBot) {
    return (
      <article className="mt-5 flex justify-end" aria-label="사용자 메시지">
        <div className="bg-primary max-w-[85%] rounded-3xl rounded-br-xl px-4 py-3">
          <p className="text-body whitespace-pre-line text-white">{text}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="mt-5 flex items-start gap-3" aria-label="챗봇 메시지">
      <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        <Image
          src="/img/chatbot.png"
          alt="챗봇 동냥이"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
          priority
        />
      </div>

      <div className="max-w-[85%]">
        <p className="text-bodySm text-gray5 mb-2 px-1">동냥이</p>
        <div className="border-gray1 rounded-3xl rounded-tl-xl border bg-white px-4 py-3 shadow-sm">
          <p className="text-body whitespace-pre-line text-black">{text}</p>
          {url ? (
            <div className="mt-3 flex justify-end">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary/15 bg-primary/5 text-primary text-bodySm font-regular inline-flex w-fit items-center gap-2 rounded-2xl border px-4 py-2"
              >
                관련 링크 열기
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
