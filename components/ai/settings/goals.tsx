'use client';

import { User } from "@/app/types";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

const supabase = createClient()

export const Goals = ({ user, updateSession }: { user: User | null, updateSession: () => void }) => {
  const [newGoal, setNewGoal] = useState('');

  const addGoal = async () => {
    if (!newGoal || !user) return;
    const { error } = await supabase
      .from('goals')
      .insert({ name: newGoal, user_id: user.id });

    if (error) {
      console.error('Failed to add goal:', error);
    } else {
      setNewGoal('');
      await updateSession();
    }
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Failed to delete goal:', error);
    } else {
      await updateSession();
    }
  };

  return (
    <div className="w-full">
      <ul className="list-disc pl-5">
        {user?.goals.map((category) => (
          <li key={category.id} className="text-sm flex items-center gap-2">
            {category.name}
            <button
              className="text-xs text-red-500 hover:underline"
              onClick={() => deleteGoal(category.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2">
        <Input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add goal"
        />
        <Button onClick={addGoal}>
          Add
        </Button>
      </div>
    </div>
  );
};
