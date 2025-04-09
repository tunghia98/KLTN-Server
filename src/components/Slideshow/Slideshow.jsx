import "./Slideshow.css";
import React, { useState, useEffect } from "react";

function Slideshow() {
    const [index, setIndex] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex >= 5 ? 1 : prevIndex + 1));
        }, 2000); // Chuyển slide mỗi 2 giây

        return () => clearInterval(interval); // Dọn dẹp interval khi unmount
    }, []);

    return (
        <div className="slideshow">
            <div className="slider">
            {/* Radio Buttons */}
            <input type="radio" name="radio-btn" id="radio1" checked={index === 1} readOnly />
            <input type="radio" name="radio-btn" id="radio2" checked={index === 2} readOnly />
            <input type="radio" name="radio-btn" id="radio3" checked={index === 3} readOnly />
            <input type="radio" name="radio-btn" id="radio4" checked={index === 4} readOnly />
            <input type="radio" name="radio-btn" id="radio5" checked={index === 5} readOnly />

            {/* Khu vực chứa slides */}
            <div className="slides" style={{ marginLeft: `${-(index - 1) * 100}%`, transition: "0.5s ease-in-out" }}>
                <div className="slide"><img src="/photo1.jpg" alt="Slide 1" /></div>
                <div className="slide"><img src="/logo192.png" alt="Slide 2" /></div>
                <div className="slide"><img src="/photo1.jpg" alt="Slide 3" /></div>
                <div className="slide"><img src="/photo1.jpg" alt="Slide 4" /></div>
                <div className="slide"><img src="/photo1.jpg" alt="Slide 5" /></div>
            </div>

            {/* Navigation Buttons */}
            <div className="navigation-manual">
                <label htmlFor="radio1" className="manual-btn" onClick={() => setIndex(1)}></label>
                <label htmlFor="radio2" className="manual-btn" onClick={() => setIndex(2)}></label>
                <label htmlFor="radio3" className="manual-btn" onClick={() => setIndex(3)}></label>
                <label htmlFor="radio4" className="manual-btn" onClick={() => setIndex(4)}></label>
                <label htmlFor="radio5" className="manual-btn" onClick={() => setIndex(5)}></label>
            </div>
        </div>
        </div>
        
    );
}

export default Slideshow;
