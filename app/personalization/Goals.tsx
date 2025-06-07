import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Personalization } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type updateType =  (key: string, value: string | number | boolean | string[] | { goal: string; timeframe: string; motivation: string }[]) => void;

export const Goals = ({ formData, update }: { formData: Personalization, update: updateType }) => {
    return (
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
                      newGoals[idx] = { ...newGoals[idx], timeframe: e.target.value, timeframe_set: new Date().toISOString() };
                      update("goals", newGoals);
                    }}
                    placeholder="Time frame (e.g. 'by Dec 2025', 'in 6 months', or a date)"
                    className="mb-1"
                  />
                  <div className="text-xs text-gray-400 italic">
                    {goal.timeframe_set ? `Set/modified: ${new Date(goal.timeframe_set).toLocaleDateString()}` : ''}
                  </div>
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
    )
}