import { z } from 'zod'

const EmailAccountDetailsConfigurationSchema = z.object({
  label: z.string(),
  sender: z.object({
    name: z.string()
  })
})

export type EmailAccountDetailsConfiguration = z.infer<typeof EmailAccountDetailsConfigurationSchema>
export default EmailAccountDetailsConfigurationSchema
