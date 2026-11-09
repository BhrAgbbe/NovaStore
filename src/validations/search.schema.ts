import { object, string } from "yup";

export const searchSchema = object({ q: string().trim().defined() });
