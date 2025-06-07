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

export const DailyRythm = ({ formData, update }: { formData: Personalization, update: updateType }) => {
    return (
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
    )
}