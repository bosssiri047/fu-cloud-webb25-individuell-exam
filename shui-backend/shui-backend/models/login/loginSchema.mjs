import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(4, "Username have to be atleast 4 alphanumeric characters"),
    password: z.string().min(4, "Password have to be atleast 4 alphanumeric characters"),
})