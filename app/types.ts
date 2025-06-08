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

export interface Goal {
  goal: string;
  timeframe: string;
  motivation: string;
  timeframe_set?: string; // ISO string for when the timeframe was set/modified
}

export interface Personalization {
    wake_time: string,
    focus_duration: number, // in minutes
    task_switching_comfort: number, // 1-10 scale
    sleep_hours: number,
    priorities: {
      health: number,
      career: number,
      social: number,
      creativity: number,
      rest: number,
      learning: number,
      family: number,
    },
    personality: {
      introvert: number,
      structured: number,
      solo_recharge: number,
    },
    tone: string,
    goals: Goal[],
    direction_clarity: number,
    is_employed: boolean,
    commute_to_work: number,
    commute_from_work: number,
    work_days: boolean[], // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
    commute_days: boolean[],
    work_start: string,
    work_end: string,
    flexible_buffer_time: number, // in minutes
    energy_curve: { morning: number, afternoon: number, evening: number },
    break_preferences: { type: string, style: string },
    decision_fatigue_threshold: number, // 1-10 scale
    location_flexibility: string,
}