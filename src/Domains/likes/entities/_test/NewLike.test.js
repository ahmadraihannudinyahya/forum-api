const NewLike = require('../NewLike');

describe('NewLike entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      userId: 'user-123',
      commentId: 'thread-123',
    };
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data spesification', () => {
    const payload = {
      userId: 123,
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should create newLike object corectly', () => {
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const { userId, threadId, commentId } = new NewLike(payload);
    expect(userId).toStrictEqual(payload.userId);
    expect(threadId).toStrictEqual(payload.threadId);
    expect(commentId).toStrictEqual(payload.commentId);
  });
});
