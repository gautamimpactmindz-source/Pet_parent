import "./button-main.css";
import React from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const ButtonMain = ({
  disable = false,
  customClass = "",
  buttonText,
  iconVisible = true,
  buttonType = "button",
}) => {
  return (
    <Button disabled={disable}
      className={`button-main   d-inline-flex align-items-center gap-2 rounded-pill px-4 overflow-hidden position-relative shadow-none z-1 ${customClass}`}
      type={buttonType}
    >
      {buttonText}
      {iconVisible && (
        <FontAwesomeIcon icon={faAngleRight} width={20} height={16} />
      )}
    </Button>
  );
};

export default ButtonMain;
