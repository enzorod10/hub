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

const steps = ["Daily Rhythm", "Priorities", "Personality", "Goals", "Work & Commute"];

export default function GetToKnowYouForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    wakeTime: "07:00",
    productivity: "morning",
    sleepHours: 8,
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
      soloRecharge: 5,
    },
    tone: "friendly",
    goals: [""],
    longTermClarity: 5,
    isEmployed: false,
    commuteTime: {
      toWork: 0,
      fromWork: 0,
    },
    workSchedule: {
      startTime: "09:00",
      endTime: "17:00",
    },
  });

  const nextStep = () => step < steps.length - 1 && setStep(step + 1);
  const prevStep = () => step > 0 && setStep(step - 1);

  const update = (key, value) => setFormData({ ...formData, [key]: value });
  const updateNested = (section, key, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [key]: value,
      },
    });
  };

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
              <Input type="time" value={formData.wakeTime} onChange={(e) => update("wakeTime", e.target.value)} />
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
              <Label className="mb-1 block">Ideal Sleep Hours: {formData.sleepHours}</Label>
              <Slider min={4} max={10} step={1} defaultValue={[formData.sleepHours]} onValueChange={([val]) => update("sleepHours", val)} />
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <h2 className="text-xl font-semibold">Life Priorities</h2>
            {Object.keys(formData.priorities).map((key) => (
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
                value={goal}
                onChange={(e) => {
                  const newGoals = [...formData.goals];
                  newGoals[idx] = e.target.value;
                  update("goals", newGoals);
                }}
                placeholder={`Goal ${idx + 1}`}
              />
            ))}
            <Button variant="link" onClick={() => update("goals", [...formData.goals, ""])} className="text-blue-500 px-0">
              + Add another goal
            </Button>
            <div>
              <Label className="mb-1 block">Clarity of Long-Term Direction: {formData.longTermClarity}</Label>
              <Slider min={1} max={10} step={1} defaultValue={[formData.longTermClarity]} onValueChange={([val]) => update("longTermClarity", val)} />
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <h2 className="text-xl font-semibold">Work & Commute</h2>
            <div className="flex items-center space-x-2">
              <Switch id="is-employed" checked={formData.isEmployed} onCheckedChange={(val) => update("isEmployed", val)} />
              <Label htmlFor="is-employed">Currently Employed</Label>
            </div>
            {formData.isEmployed && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-1 block">Work Start Time</Label>
                  <Input type="time" value={formData.workSchedule.startTime} onChange={(e) => updateNested("workSchedule", "startTime", e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1 block">Work End Time</Label>
                  <Input type="time" value={formData.workSchedule.endTime} onChange={(e) => updateNested("workSchedule", "endTime", e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1 block">Commute to Work (min)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.commuteTime.toWork}
                    onChange={(e) => updateNested("commuteTime", "toWork", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="mb-1 block">Commute from Work (min)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.commuteTime.fromWork}
                    onChange={(e) => updateNested("commuteTime", "fromWork", parseInt(e.target.value))}
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
        <Button onClick={nextStep} disabled={step === steps.length - 1}>
          {step === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}