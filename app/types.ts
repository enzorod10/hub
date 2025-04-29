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
    subContext?: string;
    activated?: boolean;
    displayMessages: { role: string, content: string }[];
    messages: { role: string, content: string }[];
}

export interface Task{
    id: string;
    type: TaskType;
    name: string;
    priority: Priority;
    done: boolean;
}

export interface Mood{
    id: number;
    type: MoodType;
    emoji: string;
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
}

export interface User {
    id: string;
    created_at: Date;
    name: string;
    interests: Interest[];
}

export interface Interest {
    id: string;
    name: string;
  }

type MoodType = 'happy' | 'sad' | 'neutral';
export type Priority = 'low' | 'medium' | 'high';
export type TaskType = 'work' | 'personal' | 'other';