'use client';

import Link from 'next/link';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  ExternalLink,
  Utensils,
  BookOpen,
  ArrowUpRight,
  Clock3,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import type { HomeUiModel } from '@/features/home/types/ui-model';
import HomePageSkeleton from './HomePageSkeleton';

const quickLinks = [
  { label: '내 시간표', href: '/timetable', icon: CalendarDays },
  { label: '학사·개인 일정', href: '/schedule', icon: CalendarDays },
  { label: '학교 근처 맛집', href: '/restaurants', icon: Utensils },
  {
    label: '스터디룸 예약',
    href: 'https://lib.dongyang.ac.kr/studyroom/groupReserveStat',
    icon: DoorOpen,
    external: true,
  },
] as const;

const days = ['월', '화', '수', '목', '금', '토', '일'];
const dayIndex = () => (new Date().getDay() + 6) % 7;

function Assignments({ eclass }: { eclass: HomeUiModel['eclass'] }) {
  const { isLoggedIn } = useAuth();
  return (
    <section className="home-card home-assignments" aria-labelledby="assignments-title">
      <div className="home-card-head">
        <h2 id="assignments-title">놓치지 말아야 할 과제</h2>
        <Link href="/eclass" className="home-more">
          미제출 {eclass.upcomingCount}개 <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
      {!isLoggedIn ? (
        <div className="home-empty">
          로그인하면 마감이 다가오는 과제를 확인할 수 있어요.{' '}
          <Link href="/sign-in">
            로그인하기 <ArrowUpRight size={14} />
          </Link>
        </div>
      ) : !eclass.linked || eclass.status === 'EXPIRED' ? (
        <div className="home-empty">
          이클래스를 연결하면 과제 마감을 한눈에 볼 수 있어요.{' '}
          <Link href="/eclass">
            이클래스 연결하기 <ArrowUpRight size={14} />
          </Link>
        </div>
      ) : eclass.items.length === 0 ? (
        <div className="home-empty">마감이 남은 과제가 없어요.</div>
      ) : (
        <div className="home-assignment-list">
          {eclass.items.slice(0, 2).map((assignment, index) => (
            <Link href="/eclass" className="home-assignment" key={`${assignment.title}-${index}`}>
              <span className={`home-row-icon ${index === 0 ? 'warm' : ''}`}>
                <BookOpen size={19} strokeWidth={1.7} />
              </span>
              <span className="home-row-copy">
                <span className="home-eyebrow">{assignment.courseName}</span>
                <strong>{assignment.title}</strong>
                <small>{assignment.dueLabel}까지</small>
              </span>
              <span className={`home-deadline ${assignment.isUrgent ? 'urgent' : ''}`}>
                {assignment.dDayLabel}
              </span>
              <ChevronRight className="home-row-arrow" size={17} aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
      <p className="home-card-note">
        <Clock3 size={13} aria-hidden="true" /> 이클래스 연동 정보 · 마감 전에 미리 확인하세요
      </p>
    </section>
  );
}

function TodayFlow({ timetable, schedules }: Pick<HomeUiModel, 'timetable' | 'schedules'>) {
  const { isLoggedIn } = useAuth();
  const entries = [
    ...timetable.map((entry) => ({ ...entry, kind: '수업', href: '/timetable' })),
    ...schedules.map((entry) => ({ ...entry, kind: entry.typeLabel, href: '/schedule' })),
  ].sort((a, b) => a.startAt.localeCompare(b.startAt));
  const next = entries.findIndex((entry) => entry.endAt > new Date().toTimeString().slice(0, 5));
  return (
    <section className="home-card home-flow" aria-labelledby="flow-title">
      <div className="home-card-head">
        <h2 id="flow-title">오늘의 흐름</h2>
        <Link href="/timetable" className="home-more">
          시간표 보기 <ArrowUpRight size={15} />
        </Link>
      </div>
      {!isLoggedIn ? (
        <div className="home-empty">로그인하면 오늘의 수업과 일정을 볼 수 있어요.</div>
      ) : entries.length === 0 ? (
        <div className="home-empty">오늘 예정된 수업이나 일정이 없어요.</div>
      ) : (
        <ol className="home-timeline">
          {entries.slice(0, 4).map((entry, index) => (
            <li key={`${entry.title}-${entry.startAt}-${index}`}>
              <Link
                href={entry.href}
                className={`home-timeline-row ${index === next ? 'active' : ''}`}
              >
                <time>{entry.startAt.slice(0, 5)}</time>
                <span className="home-timeline-dot" />
                <span className="home-timeline-copy">
                  <span className="home-eyebrow">{entry.kind}</span>
                  <strong>{entry.title}</strong>
                  <small>{entry.timeRange}</small>
                </span>
                {index === next ? <ArrowUpRight size={17} aria-hidden="true" /> : null}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Lunch({
  menus,
  loading,
  error,
}: {
  menus: string[];
  loading: boolean;
  error: string | null;
}) {
  const [index, setIndex] = useState(dayIndex);
  const title = index === dayIndex() ? '오늘의 학식' : `${days[index]}요일 학식`;
  return (
    <section className="home-card home-lunch" aria-labelledby="lunch-title">
      <div className="home-card-head">
        <h2 id="lunch-title">{title}</h2>
        <div className="home-lunch-controls">
          <button aria-label="이전 식단" onClick={() => setIndex((i) => (i + 6) % 7)}>
            <ChevronLeft size={18} />
          </button>
          <button aria-label="다음 식단" onClick={() => setIndex((i) => (i + 1) % 7)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="home-lunch-art">
        <span className="home-plate" aria-hidden="true">
          <span />
        </span>
        <span>CAMPUS LUNCH</span>
      </div>
      <div className="home-lunch-copy">
        <span className="home-eyebrow">
          {index === dayIndex() ? '오늘의 메뉴' : `${days[index]}요일 메뉴`}
        </span>
        <strong>
          {loading
            ? '식단을 불러오는 중이에요'
            : error
              ? '식단을 불러오지 못했어요'
              : menus[index] || '식단 정보가 없습니다.'}
        </strong>
        <small>운영 시간과 메뉴는 학교 사정에 따라 달라질 수 있어요.</small>
      </div>
      <Link href="/restaurants" className="home-text-link">
        학교 근처 맛집도 둘러보기 <ArrowUpRight size={15} />
      </Link>
    </section>
  );
}

function Notices({ notices }: { notices: HomeUiModel['notices'] }) {
  return (
    <section className="home-card home-notices" aria-labelledby="notices-title">
      <div className="home-card-head">
        <h2 id="notices-title">학교 소식, 놓치지 않도록</h2>
        <Link href="/notices" className="home-more">
          전체 공지 <ArrowUpRight size={15} />
        </Link>
      </div>
      <ul>
        {notices.length ? (
          notices.slice(0, 3).map((notice) => (
            <li key={notice.link}>
              <a href={notice.link} target="_blank" rel="noopener noreferrer">
                <span className={`home-notice-tag ${notice.type === 'OFFICIAL' ? 'blue' : ''}`}>
                  {notice.typeLabel}
                </span>
                <span className="home-notice-copy">
                  <small>{notice.type === 'OFFICIAL' ? '학사' : '학과'}</small>
                  <strong>{notice.title}</strong>
                </span>
                <span className="home-notice-date">새 소식</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </li>
          ))
        ) : (
          <li className="home-empty">새로운 공지가 없어요.</li>
        )}
      </ul>
    </section>
  );
}

export default function HomePageContent() {
  const {
    home,
    cafeteria,
    isInitialLoading,
    isHomeLoading,
    isHomeError,
    homeErrorMessage,
    isCafeteriaLoading,
    isCafeteriaError,
    cafeteriaErrorMessage,
  } = useHomeData();
  const { user } = useAuth();
  if (isHomeError) return <div className="home-empty min-h-96">{homeErrorMessage}</div>;
  if (isInitialLoading || isHomeLoading || !home) return <HomePageSkeleton />;
  const today = new Date();
  const date = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(today);
  const semester = today.getMonth() < 6 ? '1학기' : '2학기';
  return (
    <div className="home-dashboard">
      <div className="home-intro">
        <div>
          <p className="home-date">{date}</p>
          <h1>
            오늘도, 나만의 속도로. <span aria-hidden="true">✳</span>
          </h1>
          <p className="home-subtitle">
            {user ? `${user.nickname}님의` : '동미인의'} 하루, 놓치지 말아야 할 것만 모았어요.
          </p>
        </div>
        <span className="home-semester">
          {today.getFullYear()} · {semester}
        </span>
      </div>
      <nav className="home-quick-links" aria-label="빠른 메뉴">
        {quickLinks.map(({ label, href, icon: Icon, ...rest }) => (
          <Link
            key={label}
            href={href}
            target={'external' in rest ? '_blank' : undefined}
            rel={'external' in rest ? 'noopener noreferrer' : undefined}
          >
            <span className="home-quick-icon">
              <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <strong>{label}</strong>
            {'external' in rest ? (
              <ExternalLink size={15} aria-hidden="true" />
            ) : (
              <ChevronRight size={16} aria-hidden="true" />
            )}
          </Link>
        ))}
      </nav>
      <div className="home-main-grid">
        <div className="home-main-left">
          <Assignments eclass={home.eclass} />
          <TodayFlow timetable={home.timetable} schedules={home.schedules} />
        </div>
        <div className="home-main-right">
          <Lunch
            menus={cafeteria ?? []}
            loading={isCafeteriaLoading}
            error={isCafeteriaError ? cafeteriaErrorMessage : null}
          />
          <Link
            className="home-study"
            href="https://lib.dongyang.ac.kr/studyroom/groupReserveStat"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="home-study-icon">
              <BookOpen size={26} strokeWidth={1.5} />
            </span>
            <span>
              <small>함께 공부할 공간</small>
              <strong>도서관 스터디룸 예약</strong>
              <small>
                학교 도서관에서 예약하기 <ArrowUpRight size={13} />
              </small>
            </span>
          </Link>
        </div>
      </div>
      <Notices notices={home.notices} />
      <div className="home-campus-strip">
        <div>
          <small>CAMPUS NOW</small>
          <strong>우리의 캠퍼스</strong>
        </div>
        <div>
          <small>ACADEMIC CALENDAR</small>
          <strong>학사 일정 확인하기</strong>
          <span>중요한 일정을 챙겨보세요</span>
        </div>
        <div>
          <small>CAMPUS FOOD</small>
          <strong>학교 근처 맛집</strong>
          <span>든든하게 즐겨요</span>
        </div>
        <Link href="/campus">
          캠퍼스 둘러보기 <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
