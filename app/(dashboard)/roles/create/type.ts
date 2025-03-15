import { modules } from "@/utils/name";
import { z } from "zod";

const permissions: { [key: string]: z.ZodOptional<z.ZodArray<z.ZodString>> } =
  {};

modules.forEach((name) => (permissions[name] = z.array(z.string()).optional()));

const validators = {
  name: z.string().nonempty({ message: "Name is required" }),
  description: z.string().optional(),
  home: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  permissions: z.object(permissions),
  all_records: z.array(z.string()).optional(),
};

export { permissions };
export const FormSchema = z.object(validators);
export type FormSchemaType = z.infer<typeof FormSchema>;
