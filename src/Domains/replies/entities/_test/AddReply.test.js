const AddReply = require('../AddReply');

describe('AddReply Entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data spesification', () => {
    const payload = {
      commentId: 'user-123',
      threadId: 'thread-123',
      owner: 1233435,
      content: 'this is reply',
    };
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should create addReply object corectly', () => {
    const payload = {
      commentId: 'user-123',
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'this is reply',
    };
    const addReply = new AddReply(payload);

    expect(addReply.commentId).toStrictEqual(payload.commentId);
    expect(addReply.owner).toStrictEqual(payload.owner);
    expect(addReply.content).toStrictEqual(payload.content);
    expect(addReply.threadId).toStrictEqual(payload.threadId);
  });
});
