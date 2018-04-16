import Proxy from './Proxy';

class MessageProxy extends Proxy {
  /**
   * The constructor for the MessageProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('messages', parameters);
  }
}

export default MessageProxy;
