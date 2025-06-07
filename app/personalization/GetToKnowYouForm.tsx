'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Personalization } from "../types";
import { useSessionContext } from "@/context/SessionContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Goals } from "./Goals";
import { PersonalityAndPreferences } from "./PersonalityAndPreferences";
import { DailyRythm } from "./DailyRythm";
import { Priorities } from "./Priorities";
import { Work } from "./Work";

const steps = ["Daily Rhythm", "Priorities", "Personality", "Goals", "Work & Commute"];

export default function GetToKnowYouForm() {
  const supabase = createClient();
  const { user } = useSessionContext();

  const [formData, setFormData] = useState<Personalization>({
    wake_time: "07:00",
    productivity: "morning",
    sleep_hours: 8,
    priorities: {
      health: 5,
      career: 5,
      social: 5,
      creativity: 5,
      rest: 5,
    },
    personality: {
      introvert: 5,
      structured: 5,
      solo_recharge: 5,
    },
    tone: "friendly",
    goals: [{ goal: '', timeframe: '', motivation: '', timeframe_set: undefined }],
    long_term_clarity: 5,
    is_employed: false,
    commute_to_work: 0,
    commute_from_work: 0,
    work_start: "09:00",
    work_end: "17:00",
  });

  // Update formData when user.personalization is loaded
  useEffect(() => {
    if (user?.personalization) {
      setFormData({
        wake_time: user.personalization.wake_time ?? "07:00",
        productivity: user.personalization.productivity ?? "morning",
        sleep_hours: user.personalization.sleep_hours ?? 8,
        priorities: {
          health: user.personalization.priorities?.health ?? 5,
          career: user.personalization.priorities?.career ?? 5,
          social: user.personalization.priorities?.social ?? 5,
          creativity: user.personalization.priorities?.creativity ?? 5,
          rest: user.personalization.priorities?.rest ?? 5,
        },
        personality: {
          introvert: user.personalization.personality?.introvert ?? 5,
          structured: user.personalization.personality?.structured ?? 5,
          solo_recharge: user.personalization.personality?.solo_recharge ?? 5,
        },
        tone: user.personalization.tone ?? "friendly",
        goals: user.personalization.goals
          ? user.personalization.goals.map((g: any) =>
              g && typeof g === 'object' && !Array.isArray(g)
                ? {
                    goal: g.goal ?? '',
                    timeframe: g.timeframe ?? '',
                    motivation: g.motivation ?? '',
                    timeframe_set: g.timeframe_set ?? undefined,
                  }
                : { goal: String(g), timeframe: '', motivation: '', timeframe_set: undefined }
            )
          : [{ goal: '', timeframe: '', motivation: '', timeframe_set: undefined }],
        long_term_clarity: user.personalization.long_term_clarity ?? 5,
        is_employed: user.personalization.is_employed ?? false,
        commute_to_work: user.personalization.commute_to_work ?? 0,
        commute_from_work: user.personalization.commute_from_work ?? 0,
        work_start: user.personalization.work_start ?? "09:00",
        work_end: user.personalization.work_end ?? "17:00",
      });
    }
  }, [user?.personalization]);

  const update = (key: string, value: string | number | boolean | string[] | { goal: string; timeframe: string; motivation: string; timeframe_set?: string}[]) => {
    if (key === "goals" && Array.isArray(value)) {
      setFormData({ ...formData, goals: value as any });
    } else {
      setFormData({ ...formData, [key]: value });
    }
  };
  const updateNested = (section: string, key: string, value: string | number) => {
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section as keyof Personalization] as object),
        [key]: value,
      },
    });
  };

  console.log(user?.personalization)

    async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      if (!user) return;
      const {
        wake_time,
        sleep_hours,
        productivity,
        tone,
        long_term_clarity,
        is_employed,
        work_start,
        work_end,
        commute_to_work,
        commute_from_work,
        goals,
        priorities,
        personality,
      } = formData;

      console.log({id: user.id})

      const { error } = await supabase
        .from('personalization')
        .upsert({
          user_id: user.id,
          wake_time: wake_time,
          sleep_hours: sleep_hours,
          productivity,
          tone,
          long_term_clarity: long_term_clarity,
          is_employed: is_employed,
          work_start: work_start,
          work_end: work_end,
          commute_to_work: commute_to_work,
          commute_from_work: commute_from_work,
          goals: goals.map(goal => ({ ...goal })),
          priorities: {
            health: priorities.health,
            career: priorities.career,
            social: priorities.social,
            creativity: priorities.creativity,
            rest: priorities.rest,
          },
          personality: {
            introvert: personality.introvert,
            structured: personality.structured,
            solo_recharge: personality.solo_recharge,
          },
        }, { onConflict: 'user_id', ignoreDuplicates: false });
    
      if (error) {
        console.error('Submission error:', error.message);
      } else {
        console.log('Personalization saved!');
      }
    }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Accordion type="multiple" className="w-full" defaultValue={["rhythm","priorities","personality","goals","work"]}>
        <DailyRythm formData={formData} update={update}/>
        <Priorities formData={formData} update={update} updateNested={updateNested} />
        <PersonalityAndPreferences formData={formData} update={update} updateNested={updateNested}/>
        <Goals formData={formData} update={update}/>
        <Work formData={formData} update={update} updateNested={updateNested}/>
      </Accordion>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
}