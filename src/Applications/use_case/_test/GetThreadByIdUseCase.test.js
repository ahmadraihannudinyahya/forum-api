const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const GetThread = require('../../../Domains/threads/entities/GetThread');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating add comment use case corectly', async () => {
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();

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
    const expectedGetComment = [
      new GetComment(commentPayload[0]),
      new GetComment(commentPayload[1]),
    ];
    const expectedThread = expectedGetThread;
    expectedThread.comments = expectedGetComment;

    mockThreadsRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetThread));
    mockThreadsRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetComment));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadsRepository: mockThreadsRepository,
      commentsRepository: mockCommentsRepository,
    });

    const thread = await getThreadByIdUseCase.execute(expectedGetThread.id);

    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadsRepository.verifyAvailableThread).toBeCalledWith(expectedGetThread.id);
    expect(mockThreadsRepository.getThreadById).toBeCalledWith(expectedGetThread.id);
    expect(mockCommentsRepository.getCommentsByThreadId).toBeCalledWith(expectedGetThread.id);
  });
});
