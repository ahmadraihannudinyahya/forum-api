const { dropSchema } = require('node-pg-migrate/dist/operations/schemas');
const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw error when not contain data needed', () => {
    const payload = {
      title: 'sebuah thread',
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_DATA_NEEDED');
  });
  it('should throw error when not meet data specification', () => {
    const payload = {
      id: 2836489239,
      title: 'sebuah thread',
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    };
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_SPECIFICATION');
  });
  it('should create addedthread object corectly', () => {
    const payload = {
      id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      title: 'sebuah thread',
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    };
    const { id, title, owner } = new AddedThread(payload);
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
