import type { EmailAccountConnectionConfiguration } from '../../schemas/email/configuration/Connection'

/**
 * Abstract class for the email fetch clients.
 *
 * @abstract
 * @class EmailFetch
 * @author Esaias Westberg <esaias@westbergs.se>
 */
export default abstract class EmailFetch {
  protected host: string
  protected port: number
  protected secure: boolean
  protected username: string
  protected password: string

  /**
   * Create a new instance of the email fetch client with the given configuration.
   *
   * @param configuration The configuration with connection details.
   */
  constructor(configuration: EmailAccountConnectionConfiguration) {
    this.host = configuration.host
    this.port = configuration.port
    this.secure = configuration.secure
    this.username = configuration.auth.user
    this.password = configuration.auth.pass
  }

  /**
   * Save all messages in all inboxes to the database.
   */
  public async fetchAndStoreInboxes() {}
}
