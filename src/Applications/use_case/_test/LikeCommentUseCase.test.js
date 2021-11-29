const LikeCommentUseCase = require('../LikeCommentUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const LikesRepository = require('../../../Domains/likes/LikesRepository');
const NewLike = require('../../../Domains/likes/entities/NewLike');

describe('LikeCommentUseCase', () => {
  it('should orchestrating LikeCommentUseCase corectly with user not yet like comment', async () => {
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const newLike = new NewLike(useCasePayload);

    const mockUserRepository = new UserRepository();
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();
    const moockLikesRepository = new LikesRepository();

    mockUserRepository.userOwnerVerification = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadsRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    moockLikesRepository.verifyUserNeverLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    moockLikesRepository.addLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    moockLikesRepository.removeLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      userRepository: mockUserRepository,
      threadsRepository: mockThreadsRepository,
      commentsRepository: mockCommentsRepository,
      likesRepository: moockLikesRepository,
    });
    await likeCommentUseCase.execute(useCasePayload);
    expect(mockUserRepository.userOwnerVerification).toHaveBeenCalledWith(newLike.userId);
    expect(mockThreadsRepository.verifyAvailableThread).toHaveBeenCalledWith(newLike.threadId);
    expect(mockCommentsRepository.verifyAvailableComment).toHaveBeenCalledWith(newLike.commentId);
    expect(mockCommentsRepository.verifyCommentByThreadId).toHaveBeenCalledWith(newLike);
    expect(moockLikesRepository.verifyUserNeverLikeComment).toHaveBeenCalledWith(newLike);
    expect(moockLikesRepository.addLikeComment).toHaveBeenCalledWith(newLike);
    expect(moockLikesRepository.removeLikeComment).not.toHaveBeenCalledWith(newLike);
  });
  it('should orchestrating LikeCommentUseCase corectly with user has like comment', async () => {
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const newLike = new NewLike(useCasePayload);

    const mockUserRepository = new UserRepository();
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();
    const moockLikesRepository = new LikesRepository();

    mockUserRepository.userOwnerVerification = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadsRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    moockLikesRepository.verifyUserNeverLikeComment = jest.fn()
      .mockImplementation(() => { throw new Error('User has liked'); });
    moockLikesRepository.addLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    moockLikesRepository.removeLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      userRepository: mockUserRepository,
      threadsRepository: mockThreadsRepository,
      commentsRepository: mockCommentsRepository,
      likesRepository: moockLikesRepository,
    });
    await likeCommentUseCase.execute(useCasePayload);
    expect(mockUserRepository.userOwnerVerification).toHaveBeenCalledWith(newLike.userId);
    expect(mockThreadsRepository.verifyAvailableThread).toHaveBeenCalledWith(newLike.threadId);
    expect(mockCommentsRepository.verifyAvailableComment).toHaveBeenCalledWith(newLike.commentId);
    expect(mockCommentsRepository.verifyCommentByThreadId).toHaveBeenCalledWith(newLike);
    expect(moockLikesRepository.verifyUserNeverLikeComment).toHaveBeenCalledWith(newLike);
    expect(moockLikesRepository.addLikeComment).not.toHaveBeenCalledWith(newLike);
    expect(moockLikesRepository.removeLikeComment).toHaveBeenCalledWith(newLike);
  });
});
