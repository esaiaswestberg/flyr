import 'dotenv/config'
import EmailAccount from './classes/email/EmailAccount'

const account = new EmailAccount({
  details: {
    label: 'Test',
    sender: {
      name: 'Test'
    }
  },
  connection: {
    fetchMode: 'imap',
    fetch: {
      host: process.env.IMAP_HOST!,
      port: Number(process.env.IMAP_PORT!),
      secure: process.env.IMAP_SECURE === 'true'!,
      auth: {
        user: process.env.IMAP_USERNAME!,
        pass: process.env.IMAP_PASSWORD!
      }
    },
    push: {
      host: '',
      port: 465,
      secure: true,
      auth: {
        user: '',
        pass: ''
      }
    }
  }
})
