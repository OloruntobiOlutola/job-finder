import validator from "validator";

const UserSchema = {
  name: {
    type: String,
    required: [true, "The name field is required"],
    maxLength: [30, "A name must not be more than 30 characters"],
    minLength: [3, "A name must be at least 3 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email field is required for all users"],
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: [true],
  },

  password: {
    type: String,
    required: [true, "A user must have an password"],
    select: false,
    minLength: [8, "Password must ba at least 8 characters"],
    validate: {
      validator: function (val: string) {
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}/.test(val);
      },
      message:
        "Password must contain at least a number, a lowercase and an uppercase alphabeth",
    },
  },

  passwordConfirm: {
    type: String,
    required: [true, "A user must have an passwordConfirm"],
    validate: {
      validator: function (val: string): boolean {
        // @ts-ignore
        return val === this.password;
      },
      message: "Password and confirm password are different",
    },
    select: false,
  },

  phoneNumber: {
    type: String,
    validate: {
      validator: function (val: string) {
        return /[0]{1}[0-9]{10}/.test(val);
      },
      message: "Please enter a valid phone number",
    },
  },

  passwordResetToken: String,

  passwordChangedAt: Date,

  passwordTokenExpires: Date,
};

export default UserSchema;
