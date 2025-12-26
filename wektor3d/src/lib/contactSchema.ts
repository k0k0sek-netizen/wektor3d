import { z } from 'zod';

export const contactFormSchema = z.object({
    name: z.string().min(2, { message: "Imię musi mieć co najmniej 2 znaki" }),
    email: z.string().email({ message: "Wprowadź poprawny adres e-mail" }),
    service: z.enum(['print', 'link', 'reverse', 'other'], {
        errorMap: () => ({ message: "Wybierz poprawny rodzaj zgłoszenia" })
    }),
    link: z.string().optional(),
    material: z.string().min(1, { message: "Wybierz materiał" }),
    message: z.string().optional(),
}).superRefine((data, ctx) => {
    // Wymagaj linku jeśli wybrano opcję 'print' lub 'link' (tak jak w logice JS)
    if (['print', 'link'].includes(data.service) && (!data.link || data.link.length < 5)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Link do modelu jest wymagany dla tego zgłoszenia",
            path: ["link"],
        });
    }
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
