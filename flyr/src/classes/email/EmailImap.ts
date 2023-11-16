import { ImapFlow, type FetchMessageObject, type ListResponse } from 'imapflow'
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

    this.fetchAndStoreInboxes()
  }

  /**
   * Save all messages in all inboxes to the database.
   */
  public async fetchAndStoreInboxes() {
    if (!this.client) await this.connect()

    const mailboxes = await this.client!.list()
    for (const mailbox of mailboxes) {
      // Important to await here because we want to fetch the
      // next mailbox only after the previous one is done
      // because of the inbox lock transaction.
      await this.fetchAndStoreInbox(mailbox)
    }
  }

  /**
   * Save all messages from the inbox to the database.
   */
  private async fetchAndStoreInbox(inbox: ListResponse) {
    const lock = await this.client?.getMailboxLock(inbox.path).catch(() => console.error('Unable to get mailbox lock'))
    if (!lock) return

    // Fetch all messages from the inbox
    const generator = this.client!.fetch('1:*', { uid: true, flags: true, source: true, envelope: true })
    for await (const message of generator) this.storeMessage(message)

    lock.release()
  }

  /**
   * Save a single message from the inbox to the database.
   */
  private async storeMessage(message: FetchMessageObject) {
    console.log(message.envelope.subject)
  }

  /**
   * Is the client connected to the imap server.
   *
   * @returns True if connected, false otherwise.
   */
  private isConnected() {
    if (!this.client) return false
    return !!this.client.authenticated
  }

  /**
   * Disconnect from the imap server if connected.
   */
  private async disconnect() {
    if (!this.client) return

    await this.client.close()
    this.client = null
  }
}
