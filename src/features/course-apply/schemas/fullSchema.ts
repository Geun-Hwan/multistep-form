import { z } from 'zod'
import { step1Schema } from './step1Schema'
import { step2Schema } from './step2Schema'

export const fullSchema = step1Schema.and(step2Schema)

export type FullValues = z.infer<typeof fullSchema>
