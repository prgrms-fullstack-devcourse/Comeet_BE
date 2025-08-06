import { SignUpDTO } from "./sign.up.dto";
export type SignInDTO = Pick<SignUpDTO, "githubId" | "avatar" | "github">;