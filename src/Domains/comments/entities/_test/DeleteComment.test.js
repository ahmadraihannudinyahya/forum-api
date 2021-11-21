const DeleteComment = require('../DeleteComment');

describe('DeleteComment entities', () => {
  it('should error when not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: '',
    };

    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should error when property not meet data spesification', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 12344,
    };
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create deleteComment object corectly', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const { threadId, commentId, owner } = new DeleteComment(payload);
    expect(threadId).toStrictEqual(payload.threadId);
    expect(commentId).toStrictEqual(payload.commentId);
    expect(owner).toStrictEqual(payload.owner);
  });
});
