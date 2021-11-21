const AddThreadUseCase = require('../AddThreadUseCase');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadsRepository');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('AddThreadUseCase', () => {
  it('should orchestrating add thread use case corectly', async () => {
    // Arange
    const useCasePayload = {
      title: 'a threds',
      body: 'a thread from user',
      owner: 'user-123',
    };

    const expectedAddedTread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedTread));
    mockUserRepository.userOwnerVerification = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getAddThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    const addedThread = await getAddThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(expectedAddedTread);
    expect(mockUserRepository.userOwnerVerification).toBeCalledWith(useCasePayload.owner);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread(useCasePayload));
  });
});
