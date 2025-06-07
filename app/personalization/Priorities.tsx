import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Personalization } from "../types";


type updateType =  (key: string, value: string | number | boolean | string[] | { goal: string; timeframe: string; motivation: string }[]) => void;
type updateNestedType =  (section: string, key: string, value: string | number) => void;

export const Priorities = ({ formData, update, updateNested }: { formData: Personalization, update: updateType, updateNested: updateNestedType }) => {
    return (
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
    )
}