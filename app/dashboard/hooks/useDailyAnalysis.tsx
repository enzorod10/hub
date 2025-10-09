import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust path as needed
import { User } from '@/app/types';
import { generateDayAnalysisPrompt } from '@/lib/generate-day-analysis-ai-prompt';

type SetLoading = (loading: boolean) => void;

type DayAnalysisPayload = {
  overview?: string | null;
  today_focus?: string | null;
  suggestions?: string | null;
  encouragement?: string | null;
};

export const useDailyAnalysis = (user: User | null, setDailyAnalysisLoading?: SetLoading) => {
  const hasGeneratedRef = useRef(false);

  const generateForToday = useCallback(async (signal?: AbortSignal) => {
    if (!user) return;

    const supabase = createClient();
    setDailyAnalysisLoading?.(true);

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
        signal,
      });

      if (!res.ok) {
        console.error('Chat API responded with not-ok status:', res.status);
        return;
      }

      const data = await res.json();
      let cleaned = String(data?.reply ?? '').trim();

      // Trim code fences if present
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim();
      }

      // Try parsing JSON robustly
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        // If basic parse fails, try to extract JSON substring
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (err2) {
            console.error('Failed to parse extracted JSON from GPT reply:', err2);
            return;
          }
        } else {
          console.error('Failed to parse JSON from GPT reply:', err);
          return;
        }
      }

      // Validate parsed shape before inserting
      if (!parsed || typeof parsed !== 'object') {
        console.error('Parsed analysis has unexpected shape:', parsed);
        return;
      }

      const parsedObj = parsed as DayAnalysisPayload;

      const today = new Date().toLocaleDateString('en-CA');

      const { error } = await supabase.from('ai_day_analysis').insert({
        user_id: user.id,
        date: today,
        overview: parsedObj.overview ?? null,
        today_focus: parsedObj.today_focus ?? null,
        suggestions: parsedObj.suggestions ?? null,
        encouragement: parsedObj.encouragement ?? null,
      });

      if (error) {
        console.error('[supabase_insert_error]', error);
      }
    } catch (err) {
      const e = err as Error;
      if (e.name === 'AbortError') {
        // Request was aborted, ignore
        return;
      }
      console.error('Failed to generate daily analysis:', err);
    } finally {
      setDailyAnalysisLoading?.(false);
    }
  }, [user, setDailyAnalysisLoading]);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA');

    // Reset generation flag if user has changed
    hasGeneratedRef.current = false;

    if (!user) return;

    // If user already has analysis for today, skip
    const alreadyExists = Array.isArray(user.ai_day_analysis) && user.ai_day_analysis.some((entry) => entry.date === today);
    if (alreadyExists) return;

    // Prevent duplicate generation within same mount
    if (hasGeneratedRef.current) return;
    hasGeneratedRef.current = true;

    const controller = new AbortController();
    generateForToday(controller.signal);

    return () => {
      controller.abort();
    };
  }, [user, generateForToday]);
};
