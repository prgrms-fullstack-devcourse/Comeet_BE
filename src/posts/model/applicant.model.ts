import { Entity } from "typeorm";
import { MarkBase } from "../../common/marks";

@Entity("applicants")
export class Applicant extends MarkBase {}