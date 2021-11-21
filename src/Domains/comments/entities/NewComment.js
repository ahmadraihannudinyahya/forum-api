class NewComment {
  constructor(payload) {
    const { threadId, content, owner } = this._verifyPayload(payload);
    this.threadId = threadId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ threadId, content, owner }) {
    if (!threadId || !content || !owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof (threadId) !== 'string' || typeof (content) !== 'string' || typeof (owner) !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }
    return { threadId, content, owner };
  }
}

module.exports = NewComment;
