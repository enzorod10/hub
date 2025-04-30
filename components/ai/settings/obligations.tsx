'use client';

import { User } from "@/app/types";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

const supabase = createClient()

export const Obligations = ({ user, updateSession }: { user: User | null, updateSession: () => void }) => {
  const [newObligations, setNewObligations] = useState('');

  const addObligation = async () => {
    if (!newObligations || !user) return;
    const { error } = await supabase
      .from('obligations')
      .insert({ name: newObligations, user_id: user.id });

    if (error) {
      console.error('Failed to add obligation:', error);
    } else {
      setNewObligations('');
      await updateSession();
    }
  };

  const deleteObligation = async (obligationId: string) => {
    const { error } = await supabase
      .from('obligations')
      .delete()
      .eq('id', obligationId);

    if (error) {
      console.error('Failed to delete obligations:', error);
    } else {
      await updateSession();
    }
  };

  return (
    <div className="w-full text-primary-foreground">
      <ul className="list-disc pl-5">
        {user?.obligations.map((category) => (
          <li key={category.id} className="text-sm flex items-center gap-2">
            {category.name}
            <button
              className="text-xs text-red-500 hover:underline"
              onClick={() => deleteObligation(category.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2">
        <Input
          type="text"
          value={newObligations}
          onChange={(e) => setNewObligations(e.target.value)}
          placeholder="Add obligation"
        />
        <Button onClick={addObligation}>
          Add
        </Button>
      </div>
    </div>
  );
};
