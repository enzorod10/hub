'use client';

import { User } from "@/app/types";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

const supabase = createClient()

export const Interests = ({ user, updateSession }: { user: User | null, updateSession: () => void }) => {
  const [newInterest, setNewInterest] = useState('');

  const addInterest = async () => {
    if (!newInterest || !user) return;
    const { error } = await supabase
      .from('interests')
      .insert({ name: newInterest, user_id: user.id });

    if (error) {
      console.error('Failed to add interest:', error);
    } else {
      setNewInterest('');
      await updateSession();
    }
  };

  const deleteInterest = async (interestId: string) => {
    const { error } = await supabase
      .from('interests')
      .delete()
      .eq('id', interestId);

    if (error) {
      console.error('Failed to delete interest:', error);
    } else {
      await updateSession();
    }
  };

  return (
    <div className="w-full ">
      <ul className="list-disc pl-5">
        {user?.interests.map((category) => (
          <li key={category.id} className="text-sm flex items-center gap-2">
            {category.name}
            <button
              className="text-xs text-red-500 hover:underline"
              onClick={() => deleteInterest(category.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2">
        <Input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          placeholder="Add interest"
        />
        <Button onClick={addInterest}>
          Add
        </Button>
      </div>
    </div>
  );
};
