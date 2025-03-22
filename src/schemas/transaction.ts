import { z } from "zod"
import { categoryZodSchema } from "./category"

export const transactionZodSchema = z.object({
  id: z.number().optional(),
  category_id: z.coerce.number(),
  category: categoryZodSchema.optional(),
  title: z.string(),
  movement: z.enum(['income', 'outgoing']),
  value_in_cents: z.coerce.number(),
  date: z.coerce.date().optional(),
  due_date: z.coerce.date().optional(),
  is_fixed: z.boolean().default(false),
  is_paid: z.boolean().default(false)
})

export type Transaction = z.infer<typeof transactionZodSchema>
