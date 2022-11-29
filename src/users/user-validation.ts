import joi from "joi";
import User from "./users-model";

const lookup = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Email has been used before");
  }
};

const userValidation = joi.object({
  name: joi.string().min(3).max(30).trim(true).required(),
  email: joi.string().email().trim(true).required().external(lookup),
  phoneNumber: joi
    .string()
    .length(11)
    .pattern(/[0]{1}[0-9]{10}/)
    .required(),
  location: joi.string().required(),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}/)
    .required(),
  passwordConfirm: joi.string().required().valid(joi.ref("password")),
  skills: joi.array().required(),
  experience: joi.number().required(),
  role: joi.string().valid("admin", "employee", "employer").required(),
});

export default userValidation;
