const GetComment = require('../GetComment');

describe('GetComment entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      content: 'sebuah comment',
    };
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when property not meet data specification', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: ['sebuah comment', 'content'],
      isdelete: false,
    };
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create getComment object corectly', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isdelete: false,
    };
    const {
      id, username, date, content,
    } = new GetComment(payload);

    expect(id).toStrictEqual(payload.id);
    expect(username).toStrictEqual(payload.username);
    expect(date).toStrictEqual(payload.date);
    expect(content).toStrictEqual(payload.content);
  });

  it('should hide comment when isdelete', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isdelete: true,
    };
    const {
      id, username, date, content,
    } = new GetComment(payload);
    expect(id).toStrictEqual(payload.id);
    expect(username).toStrictEqual(payload.username);
    expect(date).toStrictEqual(payload.date);
    expect(content).toStrictEqual('**komentar telah dihapus**');
  });
});
