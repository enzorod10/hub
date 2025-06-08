import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Personalization } from "../types";
import { Input } from "@/components/ui/input";

type updateType =  (key: string, value: string | number | boolean | string[] | { goal: string; timeframe: string; motivation: string }[]) => void;
type updateNestedType = (section: string, key: string, value: string | number) => void;

export const DailyRythm = ({ formData, update, updateNested }: { formData: Personalization, update: updateType, updateNested: updateNestedType }) => {
    return (
        <AccordionItem value="rhythm">
          <AccordionTrigger>Daily Rhythm</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Label className="mb-1 block">Wake-up Time</Label>
              <Input type="time" value={formData.wake_time} onChange={(e) => update("wake_time", e.target.value)} />
              <Label className="mb-1 block">Ideal Sleep Hours: {formData.sleep_hours}</Label>
              <Slider min={4} max={10} step={1} defaultValue={[formData.sleep_hours]} onValueChange={([val]) => update("sleep_hours", val)} />
              <Label className="mb-1 block">Focus Duration (minutes): {formData.focus_duration}</Label>
              <Slider min={15} max={180} step={5} defaultValue={[formData.focus_duration]} onValueChange={([val]) => update("focus_duration", val)} />
              <Label className="mb-1 block">Task Switching Comfort: {formData.task_switching_comfort}</Label>
              <Slider min={1} max={10} step={1} defaultValue={[formData.task_switching_comfort]} onValueChange={([val]) => update("task_switching_comfort", val)} />
              <Label className="mb-1 block">Flexible Buffer Time (minutes): {formData.flexible_buffer_time}</Label>
              <Slider min={0} max={60} step={5} defaultValue={[formData.flexible_buffer_time]} onValueChange={([val]) => update("flexible_buffer_time", val)} />
              <Label className="mb-1 block">Energy Curve</Label>
              <div className="flex flex-col gap-2">
                <div>
                  <Label>Morning: {formData.energy_curve.morning}</Label>
                  <Slider min={1} max={10} step={1} defaultValue={[formData.energy_curve.morning]} onValueChange={([val]) => updateNested("energy_curve", "morning", val)} />
                </div>
                <div>
                  <Label>Afternoon: {formData.energy_curve.afternoon}</Label>
                  <Slider min={1} max={10} step={1} defaultValue={[formData.energy_curve.afternoon]} onValueChange={([val]) => updateNested("energy_curve", "afternoon", val)} />
                </div>
                <div>
                  <Label>Evening: {formData.energy_curve.evening}</Label>
                  <Slider min={1} max={10} step={1} defaultValue={[formData.energy_curve.evening]} onValueChange={([val]) => updateNested("energy_curve", "evening", val)} />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
    )
}