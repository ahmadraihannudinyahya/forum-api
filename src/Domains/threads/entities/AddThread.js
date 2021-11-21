class AddThread {
  constructor(payload) {
    const { title, body, owner } = this._verifyPayload(payload);
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_DATA_NEEDED');
    }
    if (typeof (title) !== 'string' || typeof (body) !== 'string' || typeof (owner) !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_SPECIFICATION');
    }
    return ({ title, body, owner });
  }
}

module.exports = AddThread;
