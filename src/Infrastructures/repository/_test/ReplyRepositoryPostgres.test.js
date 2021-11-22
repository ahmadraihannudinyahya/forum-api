const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepository', ()=>{
  beforeEach(async ()=>{
    await UsersTableTestHelper.addUser({id : 'user-123'});
    await ThreadsTableTestHelper.addthread({
      id :'thread-123', 
      owner : 'user-123'
    });
    await CommentsTableTestHelper.addComment({
      id : 'comment-123', 
      threadId : 'thread-123', 
      owner : 'user-123'
    });
  });
  afterEach(async ()=>{
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  })
  afterAll(async ()=>{
    pool.end();
  })
  describe('addReply function', ()=>{
    it('should create addedReply object corectly', async ()=>{
      const payload = {
        threadId:'thread-123',
        commentId:'comment-123',
        owner : 'user-123',
        content : 'this is reply test reply repository postgress'
      };
      const addReply = new AddReply(payload);
      const addedReply = new AddedReply({
        id : 'reply-123',
        owner : payload.owner,
        content : payload.content
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const {id, content, owner} = await replyRepositoryPostgres.addReply(addReply);

      expect(id).toStrictEqual(addedReply.id);
      expect(content).toStrictEqual(addedReply.content);
      expect(owner).toStrictEqual(addedReply.owner);
    });
    it('should store data corectly', async ()=>{
      const payload = {
        threadId:'thread-123',
        commentId:'comment-123',
        owner : 'user-123',
        content : 'this is reply test reply repository postgress'
      };
      const addReply = new AddReply(payload);
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await replyRepositoryPostgres.addReply(addReply);

      const result = await RepliesTableTestHelper.getRepliesById('reply-123');
      const {owner, content, comment_id} = result[0];

      expect(owner).toStrictEqual(payload.owner);
      expect(content).toStrictEqual(payload.content);
      expect(comment_id).toStrictEqual(payload.commentId);
    })
  })
})