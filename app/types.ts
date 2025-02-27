export interface Task{
    id: number;
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

type MoodType = 'happy' | 'sad' | 'neutral';
type Priority = 'low' | 'medium' | 'high';
type TaskType = 'work' | 'personal' | 'other';