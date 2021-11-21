const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating add comment use case corectly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentsRepository = new CommentsRepository();
    const mockUserRepository = new UserRepository();
    const mockThreadsRepository = new ThreadsRepository();

    mockCommentsRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve({ status: 'success' }));
    mockUserRepository.userOwnerVerification = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadsRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.verifyCommentsOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getDeleteCommentUseCase = new DeleteCommentUseCase({
      userRepository: mockUserRepository,
      threadsRepository: mockThreadsRepository,
      commentsRepository: mockCommentsRepository,
    });

    const deleteCommentResult = await getDeleteCommentUseCase.execute(useCasePayload);

    expect(deleteCommentResult).toStrictEqual({ status: 'success' });
    expect(mockUserRepository.userOwnerVerification).toBeCalledWith(useCasePayload.owner);
    expect(mockThreadsRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentsRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentsRepository.verifyCommentsOwner).toBeCalledWith({
      owner: useCasePayload.owner,
      commentId: useCasePayload.commentId,
    });
    expect(mockCommentsRepository.deleteComment).toBeCalledWith(new DeleteComment(useCasePayload));
  });
});
