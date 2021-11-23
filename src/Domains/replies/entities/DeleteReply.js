class DeleteReply {
  constructor(payload) {
    const {
      owner, threadId, commentId, replyId,
    } = this._verifyPayload(payload);
    this.owner = owner;
    this.threadId = threadId;
    this.commentId = commentId;
    this.replyId = replyId;
  }

  _verifyPayload({
    owner, threadId, commentId, replyId,
  }) {
    if (!owner || !threadId || !commentId || !replyId) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof (owner) !== 'string' || typeof (threadId) !== 'string' || typeof (commentId) !== 'string' || typeof (replyId) !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_SPESIFICATION');
    }
    return {
      owner, threadId, commentId, replyId,
    };
  }
}
module.exports = DeleteReply;
