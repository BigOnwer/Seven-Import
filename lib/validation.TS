// src/lib/validations.ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),

  email: z
    .string()
    .email('E-mail inválido')
    .toLowerCase(),

  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),

  confirmPassword: z.string(),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val), {
      message: 'Telefone inválido. Formato: (11) 99999-9999',
    }),

  birthDate: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true
      const date = new Date(val)
      const now = new Date()
      const minAge = new Date(now.getFullYear() - 16, now.getMonth(), now.getDate())
      return date <= minAge
    }, { message: 'Você deve ter pelo menos 16 anos' }),

  gender: z.enum(['M', 'F', 'NB', 'PNS', '']).optional(),

  newsletter: z.boolean().optional().default(false),

  terms: z.literal(true, {
    errorMap: () => ({ message: 'Você deve aceitar os termos de uso' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>

export const addressSchema = z.object({
  label: z.string().min(1, 'Rótulo é obrigatório'),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido. Formato: 00000-000'),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
})