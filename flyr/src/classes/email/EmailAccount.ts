import type { EmailAccountConfiguration } from '../../schemas/email/configuration/Account'
import { EmailAccountConnectionConfiguration } from '../../schemas/email/configuration/Connection'
import EmailFetch from './EmailFetch'
import EmailImap from './EmailImap'

/**
 * Email account class that handles the connection to the email server.
 *
 * @class EmailAccount
 * @author Esaias Westberg <esaias@westbergs.se>
 */
export default class EmailAccount {
  private fetchClient: EmailFetch

  /**
   * Create a new instance of the email account with the given configuration.
   *
   * @param configuration The configuration with connection details.
   */
  constructor(configuration: EmailAccountConfiguration) {
    const { fetchMode, fetch: fetchConfiguration } = configuration.connection
    this.fetchClient = this.getFetchClient(fetchMode, fetchConfiguration)
  }

  /**
   * Create a new instance of the fetch client based on the fetch mode with the given configuration.
   *
   * @param mode The fetch mode to use, either 'imap' or 'pop'.
   * @param configuration The configuration with connection details.
   * @returns A new instance of the fetch client.
   * @throws An error if the fetch mode is invalid.
   */
  private getFetchClient(mode: EmailAccountConfiguration['connection']['fetchMode'], configuration: EmailAccountConnectionConfiguration) {
    switch (mode) {
      case 'imap':
        return new EmailImap(configuration)
      // case 'pop':
      //   return new EmailPop(configuration)
      default:
        throw new Error('Invalid fetch mode')
    }
  }
}
