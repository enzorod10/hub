import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
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
            <div className="space-y-4 bg-white/70 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Daily rhythm</h3>
                  <p className="text-sm text-gray-500">Set your daily timing preferences so the planner can optimize your day.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="space-y-2">
                  <Label className="mb-1 block">Wake-up Time</Label>
                  <Input aria-label="wake time" type="time" value={formData.wake_time} onChange={(e) => update("wake_time", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label className="mb-1 block">Ideal Sleep Hours: <span className="font-medium">{formData.sleep_hours}</span></Label>
                  <Slider aria-label="sleep hours" min={4} max={10} step={1} defaultValue={[formData.sleep_hours]} onValueChange={([val]) => update("sleep_hours", val)} />
                </div>

                <div className="space-y-2">
                  <Label className="mb-1 block">Focus Duration (minutes): <span className="font-medium">{formData.focus_duration}</span></Label>
                  <div className="flex items-center gap-3">
                    <Slider aria-label="focus duration" min={15} max={180} step={5} defaultValue={[formData.focus_duration]} onValueChange={([val]) => update("focus_duration", val)} />
                    <div className="w-14 text-right text-sm text-gray-600">{formData.focus_duration}m</div>
                  </div>
                  <p className="text-xs text-gray-400">How long you can sustain deep work before needing a break.</p>
                </div>

                <div className="space-y-2">
                  <Label className="mb-1 block">Task Switching Comfort: <span className="font-medium">{formData.task_switching_comfort}</span></Label>
                  <Slider aria-label="task switching comfort" min={1} max={10} step={1} defaultValue={[formData.task_switching_comfort]} onValueChange={([val]) => update("task_switching_comfort", val)} />
                  <p className="text-xs text-gray-400">Lower = prefer longer focused blocks. Higher = comfortable switching between tasks.</p>
                </div>

                <div className="space-y-2">
                  <Label className="mb-1 block">Flexible Buffer Time (minutes): <span className="font-medium">{formData.flexible_buffer_time}</span></Label>
                  <Slider aria-label="flexible buffer" min={0} max={60} step={5} defaultValue={[formData.flexible_buffer_time]} onValueChange={([val]) => update("flexible_buffer_time", val)} />
                  <p className="text-xs text-gray-400">Extra minutes to insert between meetings/tasks as breathing room.</p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="mb-1 block">Energy Curve</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">Morning <span className="font-medium">{formData.energy_curve.morning}</span></div>
                      <Slider aria-label="morning energy" min={1} max={10} step={1} defaultValue={[formData.energy_curve.morning]} onValueChange={([val]) => updateNested("energy_curve", "morning", val)} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">Afternoon <span className="font-medium">{formData.energy_curve.afternoon}</span></div>
                      <Slider aria-label="afternoon energy" min={1} max={10} step={1} defaultValue={[formData.energy_curve.afternoon]} onValueChange={([val]) => updateNested("energy_curve", "afternoon", val)} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">Evening <span className="font-medium">{formData.energy_curve.evening}</span></div>
                      <Slider aria-label="evening energy" min={1} max={10} step={1} defaultValue={[formData.energy_curve.evening]} onValueChange={([val]) => updateNested("energy_curve", "evening", val)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
    );
 }