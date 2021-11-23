const DeleteReply = require('../DeleteReply');

describe('DeleteReply entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data spesification', () => {
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 2423423,
      replyId: 'reply-123',
    };
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should create deleteReply object corectly', () => {
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };
    const {
      owner, threadId, commentId, replyId,
    } = new DeleteReply(payload);
    expect(owner).toStrictEqual(payload.owner);
    expect(threadId).toStrictEqual(payload.threadId);
    expect(commentId).toStrictEqual(payload.commentId);
    expect(replyId).toStrictEqual(payload.replyId);
  });
});
