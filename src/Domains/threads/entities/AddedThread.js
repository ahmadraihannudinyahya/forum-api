class AddedThread {
  constructor(payload) {
    const { id, title, owner } = this._ferivyPayload(payload);
    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _ferivyPayload({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_DATA_NEEDED');
    }
    if (typeof (id) !== 'string' || typeof (title) !== 'string' || typeof (owner) !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_SPECIFICATION');
    }
    return ({ id, title, owner });
  }
}

module.exports = AddedThread;
