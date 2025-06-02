import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { AIDayAnalysis } from '@/app/types';

export const Carousel = ({ dayAnalysis }: { dayAnalysis?: AIDayAnalysis }) => {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);

  const slides = [
    {
        title: 'Overview',
        content: dayAnalysis?.overview || 'No overview available.',
    },
    {
        title: 'Today’s Focus',
        content: dayAnalysis?.today_focus || 'No focus set for today.',
    },
    {
        title: 'Suggestions',
        content: dayAnalysis?.suggestions || 'No suggestions today.',

    },
    {
        title: 'Encouragement',
        content: dayAnalysis?.encouragement || 'No encouragement available.',
    },
  ];

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container flex gap-4">
        {slides.map((slide) => (
          <div
            key={slide.title}
            className="embla__slide min-w-full sm:min-w-[80%] md:min-w-[60%] bg-white border-2 border-blue-300 rounded-xl shadow p-6 flex flex-col gap-2 select-none"
            style={{ userSelect: 'none' }}
          >
            <div className="text-xl font-semibold text-gray-700 select-none" style={{ userSelect: 'none' }}>{slide.title}</div>
            <div className="text-gray-800 text-base select-none" style={{ userSelect: 'none' }}>{slide.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};