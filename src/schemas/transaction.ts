import { z } from "zod"
import { categoryZodSchema } from "./category"

export const transactionZodSchema = z.object({
  id: z.number().optional(),
  categoryId: z.coerce.number(),
  category: categoryZodSchema.optional(),
  title: z.string(),
  movement: z.enum(['income', 'outgoing']),
  valueInCents: z.coerce.number(),
  date: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  isFixed: z.boolean().default(false),
  isPaid: z.boolean().default(false)
})

export type Transaction = z.infer<typeof transactionZodSchema>
