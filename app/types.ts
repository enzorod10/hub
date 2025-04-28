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
    name: string;
    interests: string[];

}


type MoodType = 'happy' | 'sad' | 'neutral';
export type Priority = 'low' | 'medium' | 'high';
export type TaskType = 'work' | 'personal' | 'other';