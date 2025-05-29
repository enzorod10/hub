export interface NavItem {
    title: string;
    href?: string;
    disabled?: boolean;
    external?: boolean;
    icon?: string;
    label?: string;
    description?: string;
    subtitle?: string;
}

export interface Context {
    type:  'general' | 'schedule';
    subContext?: string | Date;
    display_messages: { role: 'user' | 'assistant' | 'system', content: string }[];
    messages: { role: 'user' | 'assistant' | 'system', content: string }[];
}

export interface Prompt{
    id: number;
    question: string;
    answer: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    schedule: { time: string; activity: string }[];
    user_id: string;
    ai_event_record: AIEventRecord | null;
    summary?: string;
}

export interface AIEventRecord {
    id: string;
    user_id: string;
    display_messages: { role: 'user' | 'assistant' | 'system', content: string }[];
    messages: { role: 'user' | 'assistant' | 'system', content: string }[];
}

export interface AIDayAnalysis {
    id: string;
    user_id: string;
    date: string;
    overview: string;
    today_focus: string;
    suggestions: string;
    encouragement: string;
}

export interface User {
    id: string;
    created_at: Date;
    name: string;
    personalization?: Personalization;
    ai_day_analysis: AIDayAnalysis[];
}

export interface Personalization {
    wake_time: string,
    productivity: string,
    sleep_hours: number,
    priorities: {
      health: number,
      career: number,
      social: number,
      creativity: number,
      rest: number,
    },
    personality: {
      introvert: number,
      structured: number,
      solo_recharge: number,
    },
    tone: string,
    goals: { goal: string }[],
    long_term_clarity: number,
    is_employed: boolean,
    commute_to_work: number,
    commute_from_work: number,
    work_start: string,
    work_end: string,
}