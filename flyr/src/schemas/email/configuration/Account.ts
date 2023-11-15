import { z } from 'zod'
import EmailAccountConnectionConfigurationSchema from './Connection'
import EmailAccountDetailsConfigurationSchema from './Details'

const EmailAccountConfigurationSchema = z.object({
  details: EmailAccountDetailsConfigurationSchema,

  connection: z.object({
    fetchMode: z.enum(['imap', 'pop']),
    fetch: EmailAccountConnectionConfigurationSchema,
    push: EmailAccountConnectionConfigurationSchema
  })
})

export type EmailAccountConfiguration = z.infer<typeof EmailAccountConfigurationSchema>
export default EmailAccountConfigurationSchema
