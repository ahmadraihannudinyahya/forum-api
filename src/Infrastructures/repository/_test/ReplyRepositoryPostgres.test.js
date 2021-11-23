const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepository', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addthread({
      id: 'thread-123',
      owner: 'user-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    });
  });
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    pool.end();
  });
  describe('addReply function', () => {
    it('should create addedReply object corectly', async () => {
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'this is reply test reply repository postgress',
      };
      const addReply = new AddReply(payload);
      const addedReply = new AddedReply({
        id: 'reply-123',
        owner: payload.owner,
        content: payload.content,
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const { id, content, owner } = await replyRepositoryPostgres.addReply(addReply);

      expect(id).toStrictEqual(addedReply.id);
      expect(content).toStrictEqual(addedReply.content);
      expect(owner).toStrictEqual(addedReply.owner);
    });
    it('should store data corectly', async () => {
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'this is reply test reply repository postgress',
      };
      const addReply = new AddReply(payload);
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await replyRepositoryPostgres.addReply(addReply);

      const result = await RepliesTableTestHelper.getRepliesById('reply-123');
      const { owner, content, comment_id: commentId } = result[0];

      expect(owner).toStrictEqual(payload.owner);
      expect(content).toStrictEqual(payload.content);
      expect(commentId).toStrictEqual(payload.commentId);
    });
  });
  describe('getReplyByThreadId function', () => {
    it('should create array of object newReply corecty', async () => {
      const payload = {
        id: 'reply-145',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'this is reply test reply repository postgress',
        date: '12-juni-2021',
      };
      await RepliesTableTestHelper.addReply(payload);

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replies = await replyRepositoryPostgres.getReplyByThreadId(payload.threadId);
      expect(replies).toHaveLength(1);
      expect(replies[0].content).toEqual(payload.content);
      expect(replies[0].id).toEqual(payload.id);
    });
  });
  describe('verifyAvailableReply function', () => {
    it('should throw not found error when reply not fount', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw error when reply found', async () => {
      const replyPayload = {
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'this is reply test reply repository postgress',
        date: '12-juni-2021',
      };
      await RepliesTableTestHelper.addReply(replyPayload);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyAvailableReply(replyPayload.id))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('verifyReplyByCommentId function', () => {
    it('should throw notFound error when reply not found in commentId', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyByCommentId({
        replyId: 'reply-123',
        commentId: 'comment-123',
      })).rejects.toThrowError(NotFoundError);
    });
    it('should not throw error when reply found in commentId', async () => {
      const replyPayload = {
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'this is reply test reply repository postgress',
        date: '12-juni-2021',
      };
      await RepliesTableTestHelper.addReply(replyPayload);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyByCommentId({
        replyId: replyPayload.id,
        commentId: replyPayload.commentId,
      })).resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('deleteReply function', () => {
    beforeEach(async () => {
      const replyPayload = {
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'this is reply test reply repository postgress',
        date: '12-juni-2021',
      };
      await RepliesTableTestHelper.addReply(replyPayload);
    });
    it('should delete persist reply', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await replyRepositoryPostgres.deleteReply('reply-123');
      const reply = await RepliesTableTestHelper.getRepliesById('reply-123');
      expect(reply[0].isdelete).toEqual(true);
    });
  });
  describe('verifyReplyOwner function', () => {
    beforeEach(async () => {
      const replyPayload = {
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'this is reply test reply repository postgress',
        date: '12-juni-2021',
      };
      await RepliesTableTestHelper.addReply(replyPayload);
    });
    it('should throw authorizationError when reply not owner', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyOwner({
        owner: 'user-124',
        replyId: 'reply-123',
      })).rejects.toThrowError(AuthorizationError);
    });
    it('should not throw authorizationError when reply is owner', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyOwner({
        owner: 'user-123',
        replyId: 'reply-123',
      })).resolves.not.toThrowError(AuthorizationError);
    });
  });
});
