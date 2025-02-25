import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../CSS/Event.css';

const Event = () => {
  return (
    <div className="containerE">
      <h1>Event</h1>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        className="event-swiper"
      >
        <SwiperSlide>
          <div className="box">
            <div>
              <h3>Coming Soon ...</h3>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="box">
            <div>
              <h3>Coming Soon ...</h3>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="box">
            <div>
              <h3>Coming Soon ...</h3>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="box">
            <div>
              <h3>Coming Soon ...</h3>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Event;
