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


type updateType =  (key: string, value: string | number | boolean | string[] | { goal: string; timeframe: string; motivation: string }[]) => void;
type updateNestedType =  (section: string, key: string, value: string | number) => void;

export const PersonalityAndPreferences = ({ formData, update, updateNested }: { formData: Personalization, update: updateType, updateNested: updateNestedType }) => {
    return (

        <AccordionItem value="personality">
            <AccordionTrigger>Personality & Preferences</AccordionTrigger>
            <AccordionContent>
            <div className="space-y-4">
                {Object.entries(formData.personality).map(([key, value]) => (
                <div key={key}>
                    <Label className="block mb-1 capitalize">{key}: {value}</Label>
                    <Slider min={1} max={10} step={1} defaultValue={[value]} onValueChange={([val]) => updateNested("personality", key, val)} />
                </div>
                ))}
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
            </AccordionContent>
        </AccordionItem>
    )
}