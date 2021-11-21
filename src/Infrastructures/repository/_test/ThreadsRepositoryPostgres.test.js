const ThreadsRepositoryPostgres = require('../ThreadsRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arange
      const Payload = new AddThread({
        title: 'a threds',
        body: 'a thread from user',
        owner: 'user-123',
      });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const fakeIdGenerator = () => '123';

      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);
      await threadsRepositoryPostgres.addThread(Payload);

      const threads = await ThreadsTableTestHelper.getThreadsById('thread-123');

      expect(threads).toHaveLength(1);
    });
    it('should create added thread object corectly', async () => {
      const Payload = new AddThread({
        title: 'a threds',
        body: 'a thread from user',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const fakeIdGenerator = () => '123';

      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);
      const addedThread = await threadsRepositoryPostgres.addThread(Payload);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123', title: Payload.title, owner: Payload.owner,
      }));
    });
  });
  describe('verifyAvailableThread function', () => {
    it('should throw error when threadId not found', async () => {
      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      await expect(threadsRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when threadId found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addthread({
        id: 'thread-123',
        owner: 'user-123',
      });
      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      await expect(threadsRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError();
    });
  });
  describe('getThreadById function', () => {
    it('should crete object getThread corectly', async () => {
      const payload = {
        UserId: 'user-123',
        username: 'dicoding',
        ThreadId: 'thread-123',
        title: 'a Thread',
        body: 'Thread about something',
      };
      await UsersTableTestHelper.addUser({
        id: payload.UserId,
        username: payload.username,
      });
      await ThreadsTableTestHelper.addthread({
        id: payload.ThreadId,
        title: payload.title,
        body: payload.body,
        owner: payload.UserId,
      });
      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      const {
        id, title, body, username,
      } = await threadsRepositoryPostgres.getThreadById(payload.ThreadId);

      expect(id).toStrictEqual(payload.ThreadId);
      expect(title).toStrictEqual(payload.title);
      expect(body).toStrictEqual(payload.body);
      expect(username).toStrictEqual(payload.username);
    });
  });
});
