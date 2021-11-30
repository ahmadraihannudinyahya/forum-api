const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addthread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });
  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterEach(async () => {
    await LikeTableTestHelper.cleanTable();
  });
  describe('addLike function', () => {
    it('should like comment corectly', async () => {
      const payload = new NewLike({
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const fakeIdGeneator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGeneator);
      await likeRepositoryPostgres.addLikeComment(payload);

      const result = await LikeTableTestHelper.getLikeById('like-123');
      expect(result).toHaveLength(1);
      expect(result[0].id).toStrictEqual('like-123');
      expect(result[0].threadId).toStrictEqual(payload.thread_id);
      expect(result[0].commentId).toStrictEqual(payload.comment_id);
      expect(result[0].userId).toStrictEqual(payload.owner);
    });
  });
  describe('removeLikeComment function', () => {
    it('should remove like coreclty', async () => {
      const payload = new NewLike({
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });
      await LikeTableTestHelper.addLike({ id: 'like-123', ...payload });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await likeRepositoryPostgres.removeLikeComment(payload);
      const result = await LikeTableTestHelper.getLikeById('like-123');
      expect(result).toHaveLength(0);
    });
  });
  describe('verifyUserNeverLikeComment function', () => {
    it('should throw error when user has liked comment', async () => {
      const payload = new NewLike({
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });
      await LikeTableTestHelper.addLike({ id: 'like-123', ...payload });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await expect(likeRepositoryPostgres.verifyUserNeverLikeComment(payload))
        .rejects.toThrowError('User has liked');
    });
    it('should not throw error when user never liked comment', async () => {
      const payload = new NewLike({
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await expect(likeRepositoryPostgres.verifyUserNeverLikeComment(payload))
        .resolves.not.toThrowError('User has liked');
    });
  });
  describe('getLikeByThreadId function', () => {
    it('should return array of object like CommnetId by thread corectly', async () => {
      // like in coment-123
      const payloadLike = new NewLike({
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });
      await LikeTableTestHelper.addLike({ id: 'like-123', ...payloadLike });
      // create comment-112
      await CommentsTableTestHelper.addComment({ id: 'comment-122', threadId: 'thread-123', owner: 'user-123' });
      // like in comment-112
      const payloadNewLike = new NewLike({
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-122',
      });
      await LikeTableTestHelper.addLike({ id: 'like-122', ...payloadNewLike });

      // action
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const likes = await likeRepositoryPostgres.getLikeByThreadId('thread-123');

      expect(likes).toHaveLength(2);
      expect(likes[0].comment_id).toBeDefined();
      expect(likes[0].comment_id).toEqual('comment-123');
      expect(likes[1].comment_id).toEqual('comment-122');
    });
  });
});
