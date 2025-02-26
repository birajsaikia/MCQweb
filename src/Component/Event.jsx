import React, { useState, useEffect } from 'react';
import '../CSS/Event.css';

const events = [
  { id: 1, title: 'Event 1' },
  { id: 2, title: 'Event 2' },
  { id: 3, title: 'Event 3' },
  { id: 4, title: 'Event 4' },
  { id: 5, title: 'Event 5' },
  { id: 6, title: 'Event 6' },
];

const Event = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);

  // Update slidesPerView based on screen size
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 600) setSlidesPerView(1);
      else if (window.innerWidth < 1024) setSlidesPerView(2);
      else setSlidesPerView(4);
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);

    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const nextSlide = () => {
    if (startIndex + slidesPerView < events.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="containerE">
      <h1>Event</h1>
      <div className="slider-container">
        {/* Left Arrow */}
        <button
          className="arrow left"
          onClick={prevSlide}
          disabled={startIndex === 0}
        >
          &#8249;
        </button>

        {/* Events List */}
        <div className="box-container">
          {events.slice(startIndex, startIndex + slidesPerView).map((event) => (
            <div key={event.id} className="box">
              <div>
                <h3>{event.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="arrow right"
          onClick={nextSlide}
          disabled={startIndex + slidesPerView >= events.length}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default Event;
