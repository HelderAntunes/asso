import Proxy from './Proxy';

class SubscriberProxy extends Proxy {
  /**
   * The constructor for the SubscriberProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('subscribers', parameters);
  }
}

export default SubscriberProxy;
