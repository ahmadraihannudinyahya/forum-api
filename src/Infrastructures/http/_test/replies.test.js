const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('relplies in thread endpoint', () => {
  const users = {
    username: 'dicoding',
    password: 'superSecret',
    fullname: 'dicoding indonesia',
  };
  const thread = {
    title: 'a thread',
    body: 'body of thread',
  };
  const comment = {
    content: 'this is comments',
  };
  beforeEach(async () => {
    const server = await createServer(container);
    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    // get authentencations
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const { data } = JSON.parse(response.payload);
    users.accessToken = data.accessToken;
    // get ThreadId
    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: {
        Authorization: `Bearer ${users.accessToken}`,
      },
      payload: thread,
    });

    const responseJsonThread = JSON.parse(responseThread.payload);
    thread.id = responseJsonThread.data.addedThread.id;
    // get commentId
    const responseComment = await server.inject({
      method: 'POST',
      url: `/threads/${thread.id}/comments`,
      headers: {
        Authorization: `Bearer ${users.accessToken}`,
      },
      payload: comment,
    });
    const responseJsonComment = JSON.parse(responseComment.payload);
    comment.id = responseJsonComment.data.addedComment.id;
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when post replies', () => {
    it('should responese added reply corectly', async () => {
      const requestPayload = {
        content: 'this is reply in test API',
      };
      const server = await createServer(container);
      const postRepliyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${comment.id}/replies`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(postRepliyResponse.payload);
      const { id, content, owner } = responseJson.data.addedReply;
      expect(postRepliyResponse.statusCode).toEqual(201);
      expect(responseJson.data.addedReply).toBeDefined();
      expect(id).toBeDefined();
      expect(owner).toBeDefined();
      expect(content).toStrictEqual(requestPayload.content);
    });
    it('should thow error when request payoload not contain needed properties', async () => {
      const requestPayload = {
      };
      const server = await createServer(container);
      const postRepliyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${comment.id}/replies`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(postRepliyResponse.payload);
      expect(postRepliyResponse.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak bisa menambahkan balasan karena request tidak lengkap');
    });
    it('should thow error when request payoload not meet data spesification', async () => {
      const requestPayload = {
        content: 13123234,
      };
      const server = await createServer(container);
      const postRepliyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${comment.id}/replies`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(postRepliyResponse.payload);
      expect(postRepliyResponse.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak bisa menambahkan balasan karena request tidak sesuai spesifikasi');
    });
    it('should return error when invalid thread', async () => {
      const requestPayload = {
        content: 'this is reply',
      };
      const server = await createServer(container);
      const postRepliyResponse = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/${comment.id}/replies`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(postRepliyResponse.payload);
      expect(postRepliyResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
    it('should return error when invalid thread', async () => {
      const requestPayload = {
        content: 'this is reply',
      };
      const server = await createServer(container);
      const postRepliyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/comment-123/replies`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(postRepliyResponse.payload);
      expect(postRepliyResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
  describe('when delete replies', () => {
    const reply = {
      content: 'this is reply',
    };
    beforeEach(async () => {
      const server = await createServer(container);
      const postRepliyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${comment.id}/replies`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: reply,
      });
      const responseJson = JSON.parse(postRepliyResponse.payload);
      reply.id = responseJson.data.addedReply.id;
    });
    it('should delete reply corectly and response success 200', async () => {
      const server = await createServer(container);
      const deleteRepliyResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}/replies/${reply.id}`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });
      const resultTest = await RepliesTableTestHelper.getRepliesById(reply.id);
      expect(deleteRepliyResponse.statusCode).toEqual(200);
      expect(resultTest[0].isdelete).toEqual(true);
    });
    it('should get error responese when not found reply', async () => {
      const server = await createServer(container);
      const deleteRepliyResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}/replies/reply-123421`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });
      expect(deleteRepliyResponse.statusCode).toEqual(404);
    });
    it('should get error responese when not found reply', async () => {
      const server = await createServer(container);
      const deleteRepliyResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}/replies/reply-123421`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });
      expect(deleteRepliyResponse.statusCode).toEqual(404);
    });
    it('should responese authorization error when delete reply using not owner user', async () => {
      const newUser = {
        username: 'yahya',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: newUser,
      });
      // get authentencations
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: newUser,
      });
      const { data } = JSON.parse(response.payload);
      newUser.accessToken = data.accessToken;
      const deleteRepliyResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}/replies/${reply.id}`,
        headers: {
          Authorization: `Bearer ${newUser.accessToken}`,
        },
      });
      expect(deleteRepliyResponse.statusCode).toEqual(403);
    });
  });
  describe('when get thread adfter add replys', () => {
    const reply = {
      content: 'this is reply',
    };
    beforeEach(async () => {
      const server = await createServer(container);
      const postRepliyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${comment.id}/replies`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: reply,
      });
      const responseJson = JSON.parse(postRepliyResponse.payload);
      reply.id = responseJson.data.addedReply.id;
    });
    it('should response thread with reply in commnet', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${thread.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
    });
  });
});
