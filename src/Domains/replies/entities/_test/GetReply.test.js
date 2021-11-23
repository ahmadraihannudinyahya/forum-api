const GetReply = require('../GetReply');

describe('GetReply entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
      content: 'this is reply',
      date: '12-juni-2021',
      username: 'john doe',
      isdelete: false,
    };
    expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data spesification', () => {
    const payload = {
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'this is reply',
      date: 873624763287,
      username: 'john doe',
      isdelete: true,
    };
    expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should create getReply object corectly', () => {
    const payload = {
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'this is reply',
      date: '12-juni-2021',
      username: 'john doe',
      isdelete: false,
    };
    const {
      id, content, date, username, commentId,
    } = new GetReply(payload);
    expect(id).toStrictEqual(payload.id);
    expect(content).toStrictEqual(payload.content);
    expect(date).toStrictEqual(payload.date);
    expect(username).toStrictEqual(payload.username);
    expect(commentId).toStrictEqual(payload.commentId);
  });
  it('should create getReply deleted object corectly', () => {
    const payload = {
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'this is reply',
      date: '12-juni-2021',
      username: 'john doe',
      isdelete: true,
    };
    const {
      id, content, date, username, commentId,
    } = new GetReply(payload);
    expect(id).toStrictEqual(payload.id);
    expect(content).toStrictEqual('**balasan telah dihapus**');
    expect(date).toStrictEqual(payload.date);
    expect(username).toStrictEqual(payload.username);
    expect(commentId).toStrictEqual(payload.commentId);
  });
});
