const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  const users = {
    username: 'dicoding',
    password: 'superSecret',
    fullname: 'dicoding indonesia',
  };
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

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
  });

  describe('when Post threads', () => {
    it('should return added trhead response corectlty', async () => {
      const requestPayload = {
        title: 'a thread',
        body: 'body of thread',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should error 403 when request didnt have accesstoken', async () => {
      const requestPayload = {
        title: 'a thread',
        body: 'body of thread',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
    it('should return error response when request payload not contain data needed', async () => {
      const requestPayload = {
        title: 'a thread',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap');
    });
    it('should return error responese when request payload not meet data specification', async () => {
      const requestPayload = {
        title: 'a thread',
        body: ['thread 1', 'thread 1'],
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak memenuhi syarat');
    });
  });
  describe('when post comment in a thread', () => {
    const thread = {
      title: 'a thread',
      body: 'body of thread',
    };
    beforeEach(async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: thread,
      });

      const responseJson = JSON.parse(response.payload);
      thread.id = responseJson.data.addedThread.id;
    });
    it('should return added comment corectly', async () => {
      const requestPayload = {
        content: 'this is comment',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
    });
    it('should return error when didnt have accessToken', async () => {
      const requestPayload = {
        content: 'this is comment',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: requestPayload,
      });
      expect(response.statusCode).toEqual(401);
    });
    it('should error when request payload not contain data needed', async () => {
      const requestPayload = {
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak dapat ditambahkan karena payload tidak lengkap');
    });
    it('should error when request payload not meet data specification', async () => {
      const requestPayload = {
        content: 836483458573,
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak dapat ditambahkan karena payload tidak sesuai spesifikasi');
    });
    it('should return response not found when not found thread id', async () => {
      const requestPayload = {
        content: 'this is comment',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
  describe('when delete comment in a thread', () => {
    const thread = {
      title: 'a thread',
      body: 'body of thread',
    };
    const comment = {
      content: 'this is comments',
    };
    beforeEach(async () => {
      const server = await createServer(container);

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
    it('should delete persist comment corectly', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });

      const result = await CommentsTableTestHelper.getCommentById(comment.id);
      expect(response.statusCode).toEqual(200);
      expect(result[0].isdelete).toEqual(true);
    });
    it('should return error when didnt have accessToken', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}`,
      });
      expect(response.statusCode).toEqual(401);
    });
    it('should return error response when delete not owner comment', async () => {
      const newUser = {
        username: 'newuser',
        password: 'secret',
        fullname: 'new user for test',
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: newUser,
      });
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: newUser,
      });
      const { data } = JSON.parse(responseAuth.payload);
      newUser.accessToken = data.accessToken;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}`,
        headers: {
          Authorization: `Bearer ${newUser.accessToken}`,
        },
      });

      const responeseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responeseJson.status).toEqual('fail');
      expect(responeseJson.message).toEqual('Comment tersebut bukan milik anda');
    });
    it('should return response 404 when thread id not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/${comment.id}`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
    it('should return response 404 when comment not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/comment-123`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment Tidak Ditemukan');
    });
  });
  describe('when get thread', () => {
    const thread = {
      title: 'a thread',
      body: 'body of thread',
    };
    const comment = {
      content: 'this is comments',
    };
    beforeEach(async () => {
      const server = await createServer(container);

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
    it('should get comented thread corectly', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${thread.id}`,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual(thread.id);
      expect(responseJson.data.thread.title).toEqual(thread.title);
      expect(responseJson.data.thread.comments[0].id).toEqual(comment.id);
      expect(responseJson.data.thread.comments[0].content).toEqual(comment.content);
    });
    it('should get deleted comment', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${thread.id}`,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual(thread.id);
      expect(responseJson.data.thread.title).toEqual(thread.title);
      expect(responseJson.data.thread.comments[0].id).toEqual(comment.id);
      expect(responseJson.data.thread.comments[0].content).toEqual('**komentar telah dihapus**');
    });
  });
});
