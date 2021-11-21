const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment use case corectly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'this is commnent',
      owner: 'user-123',
    };
    const expectedAddedCommnet = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockCommentsRepository = new CommentsRepository();
    const mockThreadsRepository = new ThreadsRepository();
    const mockUserRepository = new UserRepository();

    mockCommentsRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedCommnet));
    mockUserRepository.userOwnerVerification = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadsRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getAddCommentUseCase = new AddCommentUseCase({
      commentsRepository: mockCommentsRepository,
      threadsRepository: mockThreadsRepository,
      userRepository: mockUserRepository,
    });

    const addedComment = await getAddCommentUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(expectedAddedCommnet);
    expect(mockUserRepository.userOwnerVerification).toBeCalledWith(useCasePayload.owner);
    expect(mockThreadsRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentsRepository.addComment).toBeCalledWith(new NewComment(useCasePayload));
  });
});
