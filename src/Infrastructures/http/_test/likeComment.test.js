const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');

describe('likecomment endpoint', () => {
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
  beforeAll(async () => {
    const server = await createServer(container);
    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: users,
    });
    // get authentencations
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: users,
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
  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterEach(async () => {
    await LikeTableTestHelper.cleanTable();
  });
  describe('when put like comment', () => {
    it('should like comment corectly', async () => {
      const server = await createServer(container);
      const putLikeCommentResponse = await server.inject({
        method: 'PUT',
        url: `/threads/${thread.id}/comments/${comment.id}/likes`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });

      const resultCount = await LikeTableTestHelper.getLikeCommentId(comment.id);
      const responseJson = JSON.parse(putLikeCommentResponse.payload);

      expect(putLikeCommentResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(resultCount).toEqual(1);
    });
    it('should unlike comment corectly', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'PUT',
        url: `/threads/${thread.id}/comments/${comment.id}/likes`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });

      const putLikeCommentResponse = await server.inject({
        method: 'PUT',
        url: `/threads/${thread.id}/comments/${comment.id}/likes`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });
      const resultCount = await LikeTableTestHelper.getLikeCommentId(comment.id);
      const responseJson = JSON.parse(putLikeCommentResponse.payload);

      expect(putLikeCommentResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(resultCount).toEqual(0);
    });
    it('should add comment count when other user like comment', async () => {
      const newUsers = {
        username: 'newuser',
        password: 'superSecret',
        fullname: 'dicoding indonesia',
      };

      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: newUsers,
      });
      // get authentencations
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: newUsers,
      });
      const { data } = JSON.parse(response.payload);
      newUsers.accessToken = data.accessToken;
      expect(newUsers.accessToken).toBeDefined();
      expect(newUsers.accessToken).not.toEqual(users.accessToken);
      await server.inject({
        method: 'PUT',
        url: `/threads/${thread.id}/comments/${comment.id}/likes`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });
      const firstResultCount = await LikeTableTestHelper.getLikeCommentId(comment.id);
      expect(firstResultCount).toEqual(1);

      await server.inject({
        method: 'PUT',
        url: `/threads/${thread.id}/comments/${comment.id}/likes`,
        headers: {
          Authorization: `Bearer ${newUsers.accessToken}`,
        },
      });
      const resultCount = await LikeTableTestHelper.getLikeCommentId(comment.id);
      expect(resultCount).toEqual(2);
    });
    it('should return not found error when not found thread', async () => {
      const server = await createServer(container);
      const putLikeCommentResponse = await server.inject({
        method: 'PUT',
        url: `/threads/thread-123/comments/${comment.id}/likes`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });
      const responseJson = JSON.parse(putLikeCommentResponse.payload);

      expect(putLikeCommentResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
    it('should return not found error when not found comment', async () => {
      const server = await createServer(container);
      const putLikeCommentResponse = await server.inject({
        method: 'PUT',
        url: `/threads/${thread.id}/comments/comment-123/likes`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });
      const responseJson = JSON.parse(putLikeCommentResponse.payload);

      expect(putLikeCommentResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
    it('should return not found error when not found comment', async () => {
      const server = await createServer(container);
      const putLikeCommentResponse = await server.inject({
        method: 'PUT',
        url: `/threads/${thread.id}/comments/comment-123/likes`,
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      });
      const responseJson = JSON.parse(putLikeCommentResponse.payload);

      expect(putLikeCommentResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
