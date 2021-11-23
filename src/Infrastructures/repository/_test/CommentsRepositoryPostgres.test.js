const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const CommentsRepositoryPostgres = require('../CommentsRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentsRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComments function', () => {
    it('should persist add comment', async () => {
      const payload = new NewComment({
        threadId: 'thread-123',
        content: 'this is comments',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addthread({
        id: 'thread-123',
        owner: 'user-123',
      });

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator);
      await commentsRepositoryPostgres.addComment(payload);

      const comments = await CommentsTableTestHelper.getCommentById('comment-123');

      expect(comments).toHaveLength(1);
    });
    it('should create addedComment object corectly', async () => {
      const payload = new NewComment({
        threadId: 'thread-123',
        content: 'this is comments',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addthread({
        id: 'thread-123',
        owner: 'user-123',
      });

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator);
      const addedComment = await commentsRepositoryPostgres.addComment(payload);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: payload.content,
        owner: payload.owner,
      }));
    });
  });
  describe('verifyCommentsOwner function', () => {
    it('should throw error when thread not user owner', async () => {
      const payload = {
        owner: 'user-124',
        commentId: 'comment-123',
      };
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user1',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'user2',
      });
      await ThreadsTableTestHelper.addthread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-124',
        threadId: 'thread-123',
        owner: 'user-124',
      });

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

      await expect(commentsRepositoryPostgres.verifyCommentsOwner(payload))
        .rejects.toThrowError(AuthorizationError);
    });
    it('should not throw erorr when thread user owner', async () => {
      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addthread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});
      await expect(commentsRepositoryPostgres.verifyCommentsOwner(payload))
        .resolves.not.toThrowError();
    });
  });
  describe('deleteComment function', () => {
    it('should persist delete comment and create object status', async () => {
      const deleteComment = new DeleteComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addthread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});
      await commentsRepositoryPostgres.deleteComment(deleteComment);

      const deletetedComment = await CommentsTableTestHelper.getCommentById('comment-123');
      expect(deletetedComment[0].isdelete).toStrictEqual(true);
    });
  });
  describe('getCommentsByThreadId', () => {
    it('should persist get comment with threadId', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addthread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});
      const result = await commentsRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(result).toHaveLength(1);
      expect(result[0].id).toStrictEqual('comment-123');
    });
    it('should get deleted comment corectly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addthread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.deleteComment('comment-123');

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});
      const result = await commentsRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(result).toHaveLength(1);
      expect(result[0].content).toStrictEqual('**komentar telah dihapus**');
    });
  });
  describe('verifyAvailableComment function', () => {
    it('should throw not found error when not found comment', async () => {
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});
      await expect(commentsRepositoryPostgres.verifyAvailableComment('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw error when comment found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addthread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});
      await expect(commentsRepositoryPostgres.verifyAvailableComment('comment-123'))
        .resolves.not.toThrowError();
    });
  });
  describe('verifyCommentByThreadId function', () => {
    it('should throw error when Comment not found in threadId', async () => {
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});
      await expect(commentsRepositoryPostgres.verifyCommentByThreadId({
        threadId: 'thread-123',
        commentId: 'comment-123',
      })).rejects.toThrowError(NotFoundError);
    });
    it('should not throw error when when comment found in threadId', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addthread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});
      await expect(commentsRepositoryPostgres.verifyCommentByThreadId({
        threadId: 'thread-123',
        commentId: 'comment-123',
      })).resolves.not.toThrowError();
    });
  });
});
