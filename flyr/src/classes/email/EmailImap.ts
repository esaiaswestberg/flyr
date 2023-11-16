import { ImapFlow } from 'imapflow'
import type { EmailAccountConnectionConfiguration } from '../../schemas/email/configuration/Connection'
import EmailFetch from './EmailFetch'

/**
 * Imap email fetch client class.
 *
 * @class EmailImap
 * @extends EmailFetch
 * @author Esaias Westberg <esaias@westbergs.se>
 */
export default class EmailImap extends EmailFetch {
  private client: ImapFlow | null = null

  /**
   * Create a new instance of the imap email fetch client with the given configuration.
   *
   * @param configuration The configuration with connection details.
   */
  constructor(configuration: EmailAccountConnectionConfiguration) {
    super(configuration)

    this.connect()
  }

  /**
   * Connect to the imap server.
   */
  private async connect() {
    this.disconnect()

    this.client = new ImapFlow({
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: {
        user: this.username,
        pass: this.password
      },
      logger: process.env.IMAP_CLIENT_LOGGING == 'true' ? undefined : false
    })

    await this.client.connect()
  }

  /**
   * Disconnect from the imap server if connected.
   */
  private async disconnect() {
    if (this.client) await this.client.close()
  }
}
