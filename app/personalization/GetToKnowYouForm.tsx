'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { Personalization } from "../types";
import { useSessionContext } from "@/context/SessionContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const steps = ["Daily Rhythm", "Priorities", "Personality", "Goals", "Work & Commute"];

export default function GetToKnowYouForm() {
  const supabase = createClient();
  const { user } = useSessionContext();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Personalization>({
    wake_time: user?.personalization?.wake_time ?? "07:00",
    productivity: user?.personalization?.productivity ?? "morning",
    sleep_hours: user?.personalization?.sleep_hours ?? 8,
    priorities: {
      health: user?.personalization?.priorities.health ?? 5,
      career: user?.personalization?.priorities.career ?? 5,
      social: user?.personalization?.priorities.social ?? 5,
      creativity: user?.personalization?.priorities.creativity ?? 5,
      rest: user?.personalization?.priorities.rest ?? 5,
    },
    personality: {
      introvert: user?.personalization?.personality.introvert ?? 5,
      structured: user?.personalization?.personality.structured ?? 5,
      solo_recharge: user?.personalization?.personality.solo_recharge ?? 5,
    },
    tone: user?.personalization?.tone ?? "friendly",
    goals: user?.personalization?.goals
      ? user.personalization.goals.map((g: any) =>
          typeof g === 'string'
            ? { goal: g, timeframe: '', motivation: '' }
            : { goal: g.goal ?? '', timeframe: g.timeframe ?? '', motivation: g.motivation ?? '' }
        )
      : [{ goal: '', timeframe: '', motivation: '' }],
    long_term_clarity: user?.personalization?.long_term_clarity ?? 5,
    is_employed: user?.personalization?.is_employed ?? false,
    commute_to_work: user?.personalization?.commute_to_work ?? 0,
    commute_from_work: user?.personalization?.commute_from_work ?? 0,
    work_start: user?.personalization?.work_start ?? "09:00",
    work_end: user?.personalization?.work_end ?? "17:00",
  });

  const nextStep = () => step < steps.length - 1 && setStep(step + 1);
  const prevStep = () => step > 0 && setStep(step - 1);

  const update = (key: string, value: string | number | boolean | string[] | { goal: string; timeframe: string; motivation: string }[]) => {
    if (key === "goals" && Array.isArray(value)) {
      setFormData({ ...formData, goals: value as { goal: string; timeframe: string; motivation: string }[] });
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

    async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();

      console.log(user)

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
          goals: goals.map(goal => ({
            goal: goal.goal,
            timeframe: goal.timeframe,
            motivation: goal.motivation
          })),
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
        }, { onConflict: 'user_id' });
    
      if (error) {
        console.error('Submission error:', error.message);
      } else {
        console.log('Personalization saved!');
      }
    }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Accordion type="multiple" className="w-full" defaultValue={["rhythm","priorities","personality","goals","work"]}>
        <AccordionItem value="rhythm">
          <AccordionTrigger>Daily Rhythm</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Label className="mb-1 block">Wake-up Time</Label>
              <Input type="time" value={formData.wake_time} onChange={(e) => update("wake_time", e.target.value)} />
              <Label className="mb-1 block">Most Productive Period</Label>
              <Select value={formData.productivity} onValueChange={(value) => update("productivity", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
              <Label className="mb-1 block">Ideal Sleep Hours: {formData.sleep_hours}</Label>
              <Slider min={4} max={10} step={1} defaultValue={[formData.sleep_hours]} onValueChange={([val]) => update("sleep_hours", val)} />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="priorities">
          <AccordionTrigger>Life Priorities</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {(Object.keys(formData.priorities) as Array<keyof typeof formData.priorities>).map((key) => (
                <div key={key}>
                  <Label className="block mb-1 capitalize">{key}: {formData.priorities[key]}</Label>
                  <Slider min={1} max={10} step={1} defaultValue={[formData.priorities[key]]} onValueChange={([val]) => updateNested("priorities", key, val)} />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="personality">
          <AccordionTrigger>Personality & Preferences</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {Object.entries(formData.personality).map(([key, value]) => (
                <div key={key}>
                  <Label className="block mb-1 capitalize">{key}: {value}</Label>
                  <Slider min={1} max={10} step={1} defaultValue={[value]} onValueChange={([val]) => updateNested("personality", key, val)} />
                </div>
              ))}
              <Label className="mb-1 block">Preferred AI Tone</Label>
              <Select value={formData.tone} onValueChange={(value) => update("tone", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="goals">
          <AccordionTrigger>Goals & Vision</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {formData.goals.map((goal, idx) => (
                <div key={idx} className="space-y-2 border border-gray-200 rounded-lg p-3 mb-2 bg-gray-50">
                  <Input
                    type="text"
                    value={goal.goal}
                    onChange={(e) => {
                      const newGoals = [...formData.goals];
                      newGoals[idx] = { ...newGoals[idx], goal: e.target.value };
                      update("goals", newGoals);
                    }}
                    placeholder={`Goal ${idx + 1}`}
                    className="mb-1"
                  />
                  <Input
                    type="text"
                    value={goal.timeframe}
                    onChange={(e) => {
                      const newGoals = [...formData.goals];
                      newGoals[idx] = { ...newGoals[idx], timeframe: e.target.value };
                      update("goals", newGoals);
                    }}
                    placeholder="Time frame (e.g. 'by Dec 2025', 'in 6 months', or a date)"
                    className="mb-1"
                  />
                  <Input
                    type="text"
                    value={goal.motivation}
                    onChange={(e) => {
                      const newGoals = [...formData.goals];
                      newGoals[idx] = { ...newGoals[idx], motivation: e.target.value };
                      update("goals", newGoals);
                    }}
                    placeholder="Why is this goal important to you? (Motivation)"
                  />
                </div>
              ))}
              <Button variant="link" onClick={() => update("goals", [...formData.goals, { goal: "", timeframe: "", motivation: "" }])} className="text-blue-500 px-0">
                + Add another goal
              </Button>
              <div>
                <Label className="mb-1 block">Clarity of Long-Term Direction: {formData.long_term_clarity}</Label>
                <Slider min={1} max={10} step={1} defaultValue={[formData.long_term_clarity]} onValueChange={([val]) => update("longTermClarity", val)} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="work">
          <AccordionTrigger>Work & Commute</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="is-employed" checked={formData.is_employed} onCheckedChange={(val) => update("is_employed", val)} />
                <Label htmlFor="is-employed">Currently Employed</Label>
              </div>
              {formData.is_employed && (
                <div className="space-y-4">
                  <div>
                    <Label className="mb-1 block">Work Start Time</Label>
                    <Input type="time" value={formData.work_start} onChange={(e) => update("work_start", e.target.value)} />
                  </div>
                  <div>
                    <Label className="mb-1 block">Work End Time</Label>
                    <Input type="time" value={formData.work_end} onChange={(e) => update("work_end", e.target.value)} />
                  </div>
                  <div>
                    <Label className="mb-1 block">Commute to Work (min)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.commute_to_work}
                      onChange={(e) => update("commute_to_work", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">Commute from Work (min)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.commute_from_work}
                      onChange={(e) => update("commute_from_work", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
}