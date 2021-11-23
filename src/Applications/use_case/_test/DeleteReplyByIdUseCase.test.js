const DeleteReplyByIdUseCase = require('../DeleteReplyByIdUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');

describe('DeleteReplyByIdUseCase', () => {
  it('should orchestrating delete reply corectly', async () => {
    const useCasePayload = {
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      replyId: 'reply-123',
    };
    const mockUserRepository = new UserRepository();
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();
    const mockReplyRepository = new ReplyRepository();

    mockUserRepository.userOwnerVerification = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadsRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyAvailableReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReply = new DeleteReply(useCasePayload);
    const deleteReplyByIdUseCase = new DeleteReplyByIdUseCase({
      userRepository: mockUserRepository,
      threadsRepository: mockThreadsRepository,
      commentsRepository: mockCommentsRepository,
      replyRepository: mockReplyRepository,
    });

    await deleteReplyByIdUseCase.execute(useCasePayload);

    expect(mockUserRepository.userOwnerVerification).toBeCalled();
    expect(mockThreadsRepository.verifyAvailableThread).toBeCalled();
    expect(mockCommentsRepository.verifyAvailableComment).toBeCalled();
    expect(mockCommentsRepository.verifyCommentByThreadId).toBeCalled();
    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(deleteReply.replyId);
    expect(mockReplyRepository.verifyReplyByCommentId).toBeCalledWith(deleteReply);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(deleteReply);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(deleteReply.replyId);
  });
});
