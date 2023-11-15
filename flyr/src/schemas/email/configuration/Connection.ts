import { z } from 'zod'

const EmailAccountConnectionConfigurationSchema = z.object({
  host: z.string(),
  port: z.number(),
  secure: z.boolean(),
  auth: z.object({
    user: z.string(),
    pass: z.string()
  })
})

export type EmailAccountConnectionConfiguration = z.infer<typeof EmailAccountConnectionConfigurationSchema>
export default EmailAccountConnectionConfigurationSchema
