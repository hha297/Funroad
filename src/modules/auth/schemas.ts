import { z } from 'zod';
export const registerSchema = z.object({
        email: z.string().email(),
        password: z.string(),
        username: z
                .string()
                .min(3, { message: 'Username must be at least 3 characters' })
                .max(64, { message: 'Username must be at most 64 characters' })
                .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, {
                        message: 'Username can only contain lowercase letters, numbers, and hyphens. It must start and end with a letter or number',
                })
                .refine((value) => !value.includes('--'), 'Username cannot contain double hyphens')
                .refine((value) => !/\s/.test(value), {
                        message: 'Username cannot contain spaces',
                })
                .transform((value) => value.toLowerCase()),
});

export const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
});
