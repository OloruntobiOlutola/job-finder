import { UserDto } from "../../users/user.dto";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserDto;
    }
  }
}
