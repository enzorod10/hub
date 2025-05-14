// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { AIDayAnalysis } from '@/app/types';

export const Carousel = ({ dayAnalysis }: { dayAnalysis: AIDayAnalysis}) => {

    const slides = [
    {
        title: "Overview",
        content: dayAnalysis?.overview || "No overview available.",
    },
    {
        title: "Today’s Focus",
        content: dayAnalysis?.today_focus || "No focus set for today.",
    },
    {
        title: "Suggestions",
        content: dayAnalysis?.suggestions || "No suggestions today.",
    },
    {
        title: "Encouragement",
        content: dayAnalysis?.encouragement || "No encouragement available.",
    },
  ];
  return (
    <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
    >
        {slides.map(slide => {
            return (
                <SwiperSlide key={slide.title}>
                    {slide.content}
                </SwiperSlide>
            )
        })}
    </Swiper>
  );
};