class DeleteComment {
  constructor(payload) {
    const { threadId, owner, commentId } = this._verifyPayload(payload);
    this.threadId = threadId;
    this.owner = owner;
    this.commentId = commentId;
  }

  _verifyPayload({ threadId, owner, commentId }) {
    if (!threadId || !owner || !commentId) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof (threadId) !== 'string' || typeof (owner) !== 'string' || typeof (commentId) !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }
    return { threadId, owner, commentId };
  }
}

module.exports = DeleteComment;
