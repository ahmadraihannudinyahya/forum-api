const AddedComment = require('../AddedComment');

describe('AddedComment', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      id: 'content-123',
      owner: 'user-12345',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when property not meet data specification', () => {
    const payload = {
      id: 'content-123',
      content: 'this is comment',
      owner: 12345,
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create added comment object corectly', () => {
    const payload = {
      id: 'content-123',
      content: 'this is comment',
      owner: 'user-12345',
    };
    const { id, content, owner } = new AddedComment(payload);
    expect(id).toStrictEqual(payload.id);
    expect(content).toStrictEqual(payload.content);
    expect(owner).toStrictEqual(payload.owner);
  });
});
