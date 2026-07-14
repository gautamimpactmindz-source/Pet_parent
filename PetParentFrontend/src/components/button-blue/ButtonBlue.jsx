import "./button-blue.css";
import React from "react";
import Button from "react-bootstrap/Button";

const ButtonBlue = ({ buttonText, buttonType = "button", customClass = "", }) => {
  return (
    <Button className={`button-blue d-inline-flex align-items-center rounded-2 px-4 shadow-none ${customClass}`} type={buttonType}>
      {buttonText}
    </Button>
  );
};

export default ButtonBlue;
