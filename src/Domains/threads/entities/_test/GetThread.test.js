const GetThread = require('../GetThread');

describe('GetThread entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      username: 'dicoding',
    };

    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when property not meet data specification', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 68268361,
    };

    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create object getThread corectly', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const {
      id, title, body, date, username,
    } = new GetThread(payload);

    expect(id).toStrictEqual(payload.id);
    expect(title).toStrictEqual(payload.title);
    expect(body).toStrictEqual(payload.body);
    expect(date).toStrictEqual(payload.date);
    expect(username).toStrictEqual(payload.username);
  });
});
