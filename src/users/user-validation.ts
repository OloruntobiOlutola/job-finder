import joi from "joi";
import { ErrorObject } from "../../utils/error";

const userValidation = (Model: any) => {
  const lookup = async (email: string) => {
    const user = await Model.findOne({ email: email });
    if (user) {
      throw new ErrorObject(`${email} has been used before`, 400);
    }
  };

  const validateUser = joi.object({
    name: joi.string().min(3).max(30).trim(true).required(),
    email: joi.string().email().trim(true).required().external(lookup),
    phoneNumber: joi
      .string()
      .length(11)
      .pattern(/[0]{1}[0-9]{10}/)
      .required(),
    password: joi
      .string()
      .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}/)
      .required(),
    passwordConfirm: joi.string().required().valid(joi.ref("password")),
    role: joi.string().valid("admin", "employee", "employer").required(),
  });

  return validateUser;
};

export default userValidation;
