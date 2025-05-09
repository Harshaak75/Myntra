import { z } from "zod";

const mobileSchema = z
  .string()
  .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits");