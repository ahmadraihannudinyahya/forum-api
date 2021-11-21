class AddedComment {
  constructor(payload) {
    const { id, content, owner } = this._ferivyPayload(payload);
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _ferivyPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof (id) !== 'string' || typeof (content) !== 'string' || typeof (owner) !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }
    return { id, content, owner };
  }
}
module.exports = AddedComment;
