import "./button-gray.css";
import Image from "next/image";
import React from "react";
import Button from "react-bootstrap/Button";

const ButtonGray = ({
  handleclick,
  buttonIcon,
  iconPosition = "left",
  buttonText,
}) => {
  return (
    <Button
      onClick={handleclick}
      className={`button-gray d-inline-flex align-items-center gap-2 rounded-pill px-4 shadow-none ${iconPosition != "left" ? "flex-row-reverse" : ""}`}
    >
      {buttonIcon && (
        <Image src={`/icons/${buttonIcon}.svg`} alt="" width={14} height={14} />
      )}
      {buttonText}
    </Button>
  );
};

export default ButtonGray;
