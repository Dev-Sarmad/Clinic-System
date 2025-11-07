import z from "zod";
const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
const userRegistrationSchema = z.object({
  role: z.enum(["patient", "doctor", "admin"]),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
  phone: z.number().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

const userLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
});

const adminDoctorCreationSchema = z.object({
  name: z.string().min(5, "Atleat 5 chracters"),
  email: z.email(),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
  role: z.enum(["doctor"]),
  specialization: z.string().min(2, "Specialization is required"),
  qualification: z.string().optional(),
  experience: z.number(),
  isAvailable: z.boolean(),
  availableDays: z
    .array(
      z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ])
    )
    .optional(),
  timings: z
    .object({
      start: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
      end: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    })
    .refine(
      (data) =>
        timeToMinutes(data.start) >= timeToMinutes("10:00") &&
        timeToMinutes(data.end) <= timeToMinutes("20:00"),
      {
        message: "Clinic hours must be between 10:00 and 20:00",
        path: ["timings"],
      }
    )
    .refine((data) => timeToMinutes(data.end) > timeToMinutes(data.start), {
      message: "End time must be later than start time",
      path: ["timings"],
    })
    .optional(),
});

export { userRegistrationSchema, userLoginSchema, adminDoctorCreationSchema };
