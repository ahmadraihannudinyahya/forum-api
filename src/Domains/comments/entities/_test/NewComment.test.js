const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
      content: 'this is comment',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when property not meet data specification', () => {
    const payload = {
      threadId: 'thread-123',
      content: 'this is comment',
      owner: 12345,
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create new comment object corectly', () => {
    const payload = {
      threadId: 'thread-123',
      content: 'this is comment',
      owner: 'user-12345',
    };
    const { threadId, content, owner } = new NewComment(payload);
    expect(threadId).toStrictEqual(payload.threadId);
    expect(content).toStrictEqual(payload.content);
    expect(owner).toStrictEqual(payload.owner);
  });
});
