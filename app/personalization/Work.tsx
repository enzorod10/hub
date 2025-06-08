import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Personalization } from "../types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


type updateType =  (key: string, value: string | number | boolean | string[] | boolean[] | { goal: string; timeframe: string; motivation: string }[]) => void;
type updateNestedType =  (section: string, key: string, value: string | number) => void;

export const Work = ({ formData, update, updateNested }: { formData: Personalization, update: updateType, updateNested: updateNestedType }) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hasCommute = Array.isArray(formData.commute_days) && formData.commute_days.some(Boolean);

  const handleWorkDayChange = (idx: number, val: boolean) => {
    const updatedWork = [...(formData.work_days || [false, false, false, false, false, false, false])];
    const updatedCommute = [...(formData.commute_days || [false, false, false, false, false, false, false])];
    updatedWork[idx] = val;
    if (!val) updatedCommute[idx] = false;
    // Batch both arrays in a single update to avoid double update
    update("work_days", updatedWork);
    // Only update commute_days if it actually changed
    if (formData.commute_days?.[idx] !== updatedCommute[idx]) {
      update("commute_days", updatedCommute);
    }
  };

  return (
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
                <Label className="mb-1 block">Work Days</Label>
                <div className="flex gap-2">
                  {daysOfWeek.map((day, idx) => (
                    <div key={day} className="flex flex-col items-center">
                      <Label className="text-xs mb-1">{day}</Label>
                      <Switch
                        checked={formData.work_days?.[idx] || false}
                        onCheckedChange={val => handleWorkDayChange(idx, val)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Commute Days</Label>
                <div className="flex gap-2">
                  {daysOfWeek.map((day, idx) => (
                    <div key={day} className="flex flex-col items-center">
                      <Label className="text-xs mb-1">{day}</Label>
                      <Switch
                        checked={formData.commute_days?.[idx] || false}
                        disabled={!formData.work_days?.[idx]}
                        onCheckedChange={val => {
                          if (!formData.work_days?.[idx]) return;
                          const updated = [...(formData.commute_days || [false, false, false, false, false, false, false])];
                          updated[idx] = val;
                          update("commute_days", updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {hasCommute && (
                <div className="space-y-4">
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
              <div>
                <Label className="mb-1 block">Location Flexibility</Label>
                <select
                  className="border rounded px-2 py-1 mt-1"
                  value={formData.location_flexibility}
                  onChange={e => update("location_flexibility", e.target.value)}
                >
                  <option value="flexible">Flexible</option>
                  <option value="office">Office Only</option>
                  <option value="home">Home Only</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}