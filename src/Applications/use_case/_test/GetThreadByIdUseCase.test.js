const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikesRepository = require('../../../Domains/likes/LikesRepository');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetReply = require('../../../Domains/replies/entities/GetReply');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating get thread use case corectly with comment', async () => {
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikesRepository = new LikesRepository();

    const expectedGetThread = new GetThread({
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    });

    const commentPayload = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        isdelete: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'koment',
        isdelete: true,
      },
    ];

    const replyPayload = [
      {
        id: 'reply-123',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'this is reply',
        isdelete: false,
      },
      {
        id: 'reply-111',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'this is reply',
        isdelete: true,
      },
      {
        id: 'reply-121',
        commentId: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'this is reply',
        isdelete: false,
      },
      {
        id: 'reply-131',
        commentId: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'this is reply',
        isdelete: true,
      },
    ];
    const expectedGetComment = commentPayload.map((comment) => new GetComment(comment));
    const expectedGetReply = replyPayload.map((reply) => new GetReply(reply));
    const expectedGetLike = [
      {comment_id: 'comment-_pby2_tmXV6bcvcdev8xk'},
      {comment_id: 'comment-_pby2_tmXV6bcvcdev8xk'},
      {comment_id: 'comment-_pby2_tmXV6bcvcdev8xk'},
      {comment_id: 'comment-_pby2_tmXV6bcvcdev8xk'},
      {comment_id: 'comment-_pby2_tmXV6bcvcdev8xk'},
      {comment_id: 'comment-yksuCoxM2s4MMrZJO-qVD'},
      {comment_id: 'comment-yksuCoxM2s4MMrZJO-qVD'},
      {comment_id: 'comment-yksuCoxM2s4MMrZJO-qVD'},
    ];
    const expectedThread = expectedGetThread;
    expectedThread.comments = [];
    expectedGetComment.forEach((comment) => {
      comment.replies = [];
      expectedGetReply.forEach((reply) => {
        if (comment.id === reply.commentId) {
          comment.replies.push(reply);
        }
      });
      comment.likeCount = expectedGetLike.filter(like => like.comment_id === comment.id).length
      expectedThread.comments.push(comment);
    });

    mockThreadsRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetThread));
    mockThreadsRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetComment));
    mockReplyRepository.getReplyByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetReply));
    mockLikesRepository.getLikeByThreadId = jest.fn()
      .mockImplementation(()=> Promise.resolve(expectedGetLike));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadsRepository: mockThreadsRepository,
      commentsRepository: mockCommentsRepository,
      replyRepository: mockReplyRepository,
      likesRepository : mockLikesRepository,
    });

    const thread = await getThreadByIdUseCase.execute(expectedGetThread.id);
    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadsRepository.verifyAvailableThread).toBeCalledWith(expectedGetThread.id);
    expect(mockThreadsRepository.getThreadById).toBeCalledWith(expectedGetThread.id);
    expect(mockCommentsRepository.getCommentsByThreadId).toBeCalledWith(expectedGetThread.id);
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(expectedGetThread.id);
    expect(mockLikesRepository.getLikeByThreadId).toBeCalledWith(expectedGetThread.id);
  });

  it('should orchestrating get thread use case corectly with thread not commented', async () => {
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikesRepository = new LikesRepository();


    const expectedGetThread = new GetThread({
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    });

    const commentPayload = [
    ];

    const replyPayload = [
      {
        id: 'reply-123',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'this is reply',
        isdelete: false,
      },
      {
        id: 'reply-111',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'this is reply',
        isdelete: true,
      },
      {
        id: 'reply-121',
        commentId: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'this is reply',
        isdelete: false,
      },
      {
        id: 'reply-131',
        commentId: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'this is reply',
        isdelete: true,
      },
    ];
    const expectedGetComment = commentPayload.map((comment) => new GetComment(comment));
    const expectedGetReply = replyPayload.map((reply) => new GetReply(reply));
    const expectedThread = expectedGetThread;
    expectedThread.comments = [];

    mockThreadsRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetThread));
    mockThreadsRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetComment));
    mockReplyRepository.getReplyByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetReply));
    mockLikesRepository.getLikeByThreadId = jest.fn()
      .mockImplementation(()=> Promise.resolve([]));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadsRepository: mockThreadsRepository,
      commentsRepository: mockCommentsRepository,
      replyRepository: mockReplyRepository,
      likesRepository : mockLikesRepository,
    });

    const thread = await getThreadByIdUseCase.execute(expectedGetThread.id);
    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadsRepository.verifyAvailableThread).toBeCalledWith(expectedGetThread.id);
    expect(mockThreadsRepository.getThreadById).toBeCalledWith(expectedGetThread.id);
    expect(mockCommentsRepository.getCommentsByThreadId).toBeCalledWith(expectedGetThread.id);
    expect(mockReplyRepository.getReplyByThreadId).not.toBeCalledWith(expectedGetThread.id);
    expect(mockLikesRepository.getLikeByThreadId).not.toBeCalledWith(expectedGetThread.id);
  });
});
