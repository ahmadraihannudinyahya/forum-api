const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when not caontain needed property', () => {
    const payload = {
      id: 'reply-123',
      content: 'this is reply',
    };
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data spesification', () => {
    const payload = {
      id: 'reply-123',
      content: 'this is reply',
      owner: 112342,
    };
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should create addedReply object corectly', () => {
    const payload = {
      id: 'reply-123',
      content: 'this is reply',
      owner: 'user-123',
    };
    const { id, content, owner } = new AddedReply(payload);
    expect(id).toStrictEqual(payload.id);
    expect(content).toStrictEqual(payload.content);
    expect(owner).toStrictEqual(payload.owner);
  });
});
