import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust path as needed
import { User } from '@/app/types';
import { generateDayAnalysisPrompt } from '@/lib/generate-day-analysis-ai-prompt';

export const useDailyAnalysis = (user: User | null) => {
    const hasGeneratedRef = useRef(false);

    useEffect(() => {
        const today = new Date().toLocaleDateString('en-CA');

        if (!user || !user.ai_day_analysis || hasGeneratedRef.current) return;

        const alreadyExists = user.ai_day_analysis.find(
            (entry) => entry.date === today
        );

        if (alreadyExists) return;

        hasGeneratedRef.current = true;

        const generateDailyAnalysis = async () => {
            console.log('CHECK THIS')
            const supabase = createClient();

            try {
            const message = await generateDayAnalysisPrompt({ user });

            const messages = [
                { role: 'system', content: message },
                { role: 'user', content: 'Please create an analysis for today.' },
            ];

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages }),
            });

            const data = await res.json();
            let cleaned = data.reply.trim();

            if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/```(?:json)?/, '').replace(/```$/, '').trim();
            }

            let parsed;
            try {
                parsed = JSON.parse(cleaned);
            } catch (err) {
                console.error('Failed to parse JSON from GPT:', err);
                return;
            }

            const { error } = await supabase.from('ai_day_analysis').insert({
                user_id: user.id,
                date: today,
                overview: parsed.overview,
                today_focus: parsed.today_focus,
                suggestions: parsed.suggestions,
                encouragement: parsed.encouragement,
            });

            if (error) {
                console.error('[supabase_insert_error]', error);
            }
            } catch (err) {
            console.error('Failed to generate daily analysis:', err);
            }
        };

        user.personalization && generateDailyAnalysis();
    }, [user]);
};
