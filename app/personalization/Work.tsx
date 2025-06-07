import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Personalization } from "../types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


type updateType =  (key: string, value: string | number | boolean | string[] | { goal: string; timeframe: string; motivation: string }[]) => void;
type updateNestedType =  (section: string, key: string, value: string | number) => void;

export const Work = ({ formData, update, updateNested }: { formData: Personalization, update: updateType, updateNested: updateNestedType }) => {
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
    )
}