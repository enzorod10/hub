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
    date: Date
    description: string;
    user_id: string;
    ai_event_record: AIEventRecord | null;
}

export interface AIEventRecord {
    id: string;
    user_id: string;
    // target_date: Date;
    display_messages: { role: 'user' | 'assistant' | 'system', content: string }[];
    messages: { role: 'user' | 'assistant' | 'system', content: string }[];
}

export interface User {
    id: string;
    created_at: Date;
    name: string;
    interests: Interest[];
    obligations: Obligation[];
    goals: Goal[];
}

export interface Interest {
    id: string;
    name: string;
}

export interface Obligation {
    id: string;
    name: string;
}

export interface Goal {
    id: string;
    name: string;
}