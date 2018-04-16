import Proxy from './Proxy';

class TopicProxy extends Proxy {
  /**
   * The constructor for the TopicProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('topics', parameters);
  }
}

export default TopicProxy;
