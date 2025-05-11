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

const steps = ["Daily Rhythm", "Priorities", "Personality", "Goals", "Work & Commute"];

export default function GetToKnowYouForm() {
  const supabase = createClient();
  const { user } = useSessionContext();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Personalization>({
    wake_time: user?.personalization.wake_time ?? "07:00",
    productivity: user?.personalization.productivity ?? "morning",
    sleep_hours: user?.personalization.sleep_hours ?? 8,
    priorities: {
      health: user?.personalization.priorities.health ?? 5,
      career: user?.personalization.priorities.career ?? 5,
      social: user?.personalization.priorities.social ?? 5,
      creativity: user?.personalization.priorities.creativity ?? 5,
      rest: user?.personalization.priorities.rest ?? 5,
    },
    personality: {
      introvert: user?.personalization.personality.introvert ?? 5,
      structured: user?.personalization.personality.structured ?? 5,
      solo_recharge: user?.personalization.personality.solo_recharge ?? 5,
    },
    tone: user?.personalization.tone ?? "friendly",
    goals: user?.personalization.goals ? user.personalization.goals.map((g: string | { goal: string }) => typeof g === 'string' ? { goal: g } : g) : [{ goal: "" }],
    long_term_clarity: user?.personalization.long_term_clarity ?? 5,
    is_employed: user?.personalization.is_employed ?? false,
    commute_to_work: user?.personalization.commute_to_work ?? 0,
    commute_from_work: user?.personalization.commute_from_work ?? 0,
    work_start: user?.personalization.work_start ?? "09:00",
    work_end: user?.personalization.work_end ?? "17:00",
  });

  const nextStep = () => step < steps.length - 1 && setStep(step + 1);
  const prevStep = () => step > 0 && setStep(step - 1);

  const update = (key: string, value: string | number | boolean | string[] | { goal: string }[]) => {
    if (key === "goals" && Array.isArray(value)) {
      setFormData({ ...formData, goals: value as { goal: string }[] });
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
          goals: goals.map(goal => ({ goal })), // If storing as JSONB objects
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
      <div className="text-sm text-muted-foreground">
        Step {step + 1} of {steps.length}: <strong>{steps[step]}</strong>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <h2 className="text-xl font-semibold">Daily Rhythm</h2>
            <div>
              <Label className="mb-1 block">Wake-up Time</Label>
              <Input type="time" value={formData.wake_time} onChange={(e) => update("wake_time", e.target.value)} />
            </div>
            <div>
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
            </div>
            <div>
              <Label className="mb-1 block">Ideal Sleep Hours: {formData.sleep_hours}</Label>
              <Slider min={4} max={10} step={1} defaultValue={[formData.sleep_hours]} onValueChange={([val]) => update("sleep_hours", val)} />
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <h2 className="text-xl font-semibold">Life Priorities</h2>
            {(Object.keys(formData.priorities) as Array<keyof typeof formData.priorities>).map((key) => (
              <div key={key}>
                <Label className="block mb-1 capitalize">{key}: {formData.priorities[key]}</Label>
                <Slider min={1} max={10} step={1} defaultValue={[formData.priorities[key]]} onValueChange={([val]) => updateNested("priorities", key, val)} />
              </div>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <h2 className="text-xl font-semibold">Personality & Preferences</h2>
            {Object.entries(formData.personality).map(([key, value]) => (
              <div key={key}>
                <Label className="block mb-1 capitalize">{key}: {value}</Label>
                <Slider min={1} max={10} step={1} defaultValue={[value]} onValueChange={([val]) => updateNested("personality", key, val)} />
              </div>
            ))}
            <div>
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
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <h2 className="text-xl font-semibold">Goals & Vision</h2>
            {formData.goals.map((goal, idx) => (
              <Input
                key={idx}
                type="text"
                value={goal.goal}
                onChange={(e) => {
                  const newGoals = [...formData.goals];
                  newGoals[idx] = { goal: e.target.value };
                  update("goals", newGoals);
                }}
                placeholder={`Goal ${idx + 1}`}
              />
            ))}
            <Button variant="link" onClick={() => update("goals", [...formData.goals, { goal: "" }])} className="text-blue-500 px-0">
              + Add another goal
            </Button>
            <div>
              <Label className="mb-1 block">Clarity of Long-Term Direction: {formData.long_term_clarity}</Label>
              <Slider min={1} max={10} step={1} defaultValue={[formData.long_term_clarity]} onValueChange={([val]) => update("longTermClarity", val)} />
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <h2 className="text-xl font-semibold">Work & Commute</h2>
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
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex justify-between">
        <Button onClick={prevStep} disabled={step === 0} variant="secondary">
          Back
        </Button>
        <Button onClick={step === steps.length - 1 ? (e) => (handleSubmit(e)) : nextStep}>
          {step === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}