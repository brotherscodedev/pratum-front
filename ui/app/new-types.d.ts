import { JWT } from "next-auth/jwt"
interface IUser extends DefaultUser {
  type?: string;
  id?: number;
  apiToken?: string;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
