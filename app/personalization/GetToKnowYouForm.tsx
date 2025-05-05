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

const steps = ["Daily Rhythm", "Priorities", "Personality", "Goals"];

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
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Daily Rhythm</h2>
            <div>
              <label className="block mb-1 text-sm font-medium">Wake-up Time</label>
              <Input
                type="time"
                value={formData.wakeTime}
                onChange={(e) => update("wakeTime", e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Most Productive Period</label>
              <Select
                value={formData.productivity}
                onValueChange={(value) => update("productivity", value)}
              >
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
              <label className="block mb-1 text-sm font-medium">Ideal Sleep Hours: {formData.sleepHours}</label>
              <Slider
                min={4}
                max={10}
                step={1}
                defaultValue={[formData.sleepHours]}
                onValueChange={([val]) => update("sleepHours", val)}
              />
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Life Priorities</h2>
            {Object.keys(formData.priorities).map((key) => (
              <div key={key}>
                <label className="block mb-1 text-sm font-medium capitalize">
                  {key}: {formData.priorities[key]}
                </label>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[formData.priorities[key]]}
                  onValueChange={([val]) => updateNested("priorities", key, val)}
                />
              </div>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Personality & Preferences</h2>
            {Object.entries(formData.personality).map(([key, value]) => (
              <div key={key}>
                <label className="block mb-1 text-sm font-medium capitalize">
                  {key}: {value}
                </label>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[value]}
                  onValueChange={([val]) => updateNested("personality", key, val)}
                />
              </div>
            ))}
            <div>
              <label className="block mb-1 text-sm font-medium">Preferred AI Tone</label>
              <Select
                value={formData.tone}
                onValueChange={(value) => update("tone", value)}
              >
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
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
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
            <Button
              variant="link"
              onClick={() => update("goals", [...formData.goals, ""])}
              className="text-blue-500 px-0"
            >
              + Add another goal
            </Button>
            <div>
              <label className="block mb-1 text-sm font-medium">Clarity of Long-Term Direction: {formData.longTermClarity}</label>
              <Slider
                min={1}
                max={10}
                step={1}
                defaultValue={[formData.longTermClarity]}
                onValueChange={([val]) => update("longTermClarity", val)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex justify-between">
        <Button onClick={prevStep} disabled={step === 0} variant="secondary">
          Back
        </Button>
        <Button onClick={nextStep} disabled={step === steps.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
}
