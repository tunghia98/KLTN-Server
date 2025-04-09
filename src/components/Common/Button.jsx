import React from "react";
import "./Button.css";

const Button = ({ text,type="button", onClick, btnStyle = "primary", disabled = false }) => {
  return (
    <button 
      className={`btn btn-${btnStyle}`} 
      type={type}
      onClick={disabled ? undefined : onClick} 
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
