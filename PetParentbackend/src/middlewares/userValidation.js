import { body, validationResult } from "express-validator";

// Validation Rules
export const validateUser = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters")
    .matches(/^[A-Za-z0-9\s]+$/).withMessage("Name must contain only letters without spaces"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email")
 
,
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: errors.array().map(err => err.msg)
    });
  }

  next();
};
