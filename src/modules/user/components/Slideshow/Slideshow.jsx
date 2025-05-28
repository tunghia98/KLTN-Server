import React, { useState, useEffect } from "react";
import "./Slideshow.css";
import slide1 from "../../../../assets/slideshow/slide1.png";
function Slideshow() {
  const [index, setIndex] = useState(1);
  const totalSlides = 5;
  const slides = [slide1, slide1, slide1, slide1, slide1]; // Giả sử có 5 ảnh giống nhau

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex >= totalSlides ? 1 : prevIndex + 1));
    }, 10000); // tăng lên 4000ms = 4 giây

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev === 1 ? totalSlides : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === totalSlides ? 1 : prev + 1));
  };

  return (
    <div className="slideshow">
      <div className="slider">
        {/* Radio Buttons */}
        {[1, 2, 3, 4, 5].map((num) => (
          <input
            key={num}
            type="radio"
            name="radio-btn"
            id={`radio${num}`}
            checked={index === num}
            readOnly
          />
        ))}

        {/* Slides */}
        <div className="slides">
            {slides.map((src, idx) => (
                <div className="slide" key={idx}>
                <img src={src} alt={`Slide ${idx + 1}`} />
                </div>
            ))}
            </div>

        {/* Navigation buttons */}
        <button className="custom-prev-arrow" onClick={prevSlide}>
          ‹
        </button>
        <button className="custom-next-arrow" onClick={nextSlide}>
          ›
        </button>

        {/* Manual navigation dots replaced by numbers */}
        <div className="navigation-manual">
          {[1, 2, 3, 4, 5].map((btnNum) => (
            <label
              key={btnNum}
              htmlFor={`radio${btnNum}`}
              className={`manual-btn ${index === btnNum ? "active" : ""}`}
              onClick={() => setIndex(btnNum)}
            >
              {btnNum}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Slideshow;
