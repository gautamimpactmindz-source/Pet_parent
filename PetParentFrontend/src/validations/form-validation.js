import * as yup from "yup";

export const signupValidation = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character"
    ),
 agree: yup
    .boolean()
    .oneOf([true], "You must accept the terms & policies")
    .required("You must accept the terms & policies"),
  
});

export const loginValidation = yup.object({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required"),
  
    agree:yup
    .boolean()
    .oneOf([true],"You must accept the terms & policies")
    .required("You must accept the terms & policies"),
  
});
export const emailvalidation = yup.object({
  email:yup
  .string()
  .trim()
  .email("Please enter a valid email")
  .required("Email is required")
})

export const resetpasswordValidation=yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character"
    ),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
})
export const adminLoginValidation=yup.object({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
})

export const contentValidation=yup.object({
  title:yup
  .string()
  .trim()
  .min(5,'Title must be at least 5 characters')
  .max(150,'Title cannot exceed 150 characters')
  .required('Title is required'),

  body: yup
    .string()
    .trim()
    .required("Content body is required"),

  metaTitle: yup
    .string()
    .trim()
    .required("Meta title is required"),

  metaDescription: yup
    .string()
    .trim()
    .max(160, "Meta description should not exceed 160 characters")
    .required("Meta description is required"),

  status: yup
    .string()
    .oneOf(["draft", "published"], "Invalid status")
    .required("Status is required")
})

export const breedFormValidation=yup.object({
  name:yup
  .string()
  .trim()
  .required("Breed name is required"),

  size:yup
  .string()
  .required("Size is required"),

  energy:yup
  .string()
  .required("Energy Level is required"),

  goodwith:yup
  .string()
  .required("Good with field is required"),

  excerpt:yup
  .string()
  .required("Excerpt is required"),

  notidealfor:yup
  .string()
  .required("Not Ideal for field is required"),

  heading:yup
  .string()
  .required("Heading is required"),

  description:yup
  .string()
  .required("Description is required")
  

})

