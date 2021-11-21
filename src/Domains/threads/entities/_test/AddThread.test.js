const AddThread = require('../AddThread');

describe('addThread entities', () => {
  it('should throw error when not contain data needed', () => {
    const payload = {
      title: 'test added thread',
      owner: 'user-123',
    };
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_DATA_NEEDED');
  });

  it('should throw error when not meet data specification', () => {
    const payload = {
      title: 'test added thread',
      body: ['body 1', 'body2'],
      owner: 12345,
    };
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create addThread object', () => {
    const payload = {
      title: 'test added thread',
      body: 'lorem ipsun',
      owner: 'user-123',
    };

    const { title, body, owner } = new AddThread(payload);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
