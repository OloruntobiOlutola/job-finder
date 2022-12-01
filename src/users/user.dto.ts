export interface UserDto {
  name: string | undefined;

  email: string | undefined;

  password: string | undefined;

  passwordConfirm: string | undefined;

  phoneNumber: string | undefined;

  role: string | undefined;

  passwordResetToken?: string | undefined;

  passwordChangedAt?: Date | undefined;

  passwordTokenExpires?: Date | undefined;

  _id: string | undefined;

  id: string | undefined;
}
