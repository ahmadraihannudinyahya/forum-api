const AddReplyUseCase = require('../AddReplyUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');



describe('AddReplyUseCase', ()=>{
  it('should orchestrating AddReplyUseCase corectly', async ()=>{
    const useCasePayload = {
      commentId :'comment-123',
      threadId :'thread-123',
      owner : 'owner-123',
      content:'this is reply test useCase'
    };

    const expectedAddedReply = new AddedReply({
      id : 'reply-123',
      owner : useCasePayload.owner,
      content : useCasePayload.content,
      owner : useCasePayload.owner
    });

    const addReply = new AddReply(useCasePayload);

    const mockUserRepository = new UserRepository();
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();
    const mockReplyRepository = new ReplyRepository();

    mockUserRepository.userOwnerVerification = jest.fn()
      .mockImplementation(()=>Promise.resolve());
    mockThreadsRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(()=> Promise.resolve());
    mockCommentsRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(()=> Promise.resolve());
    mockCommentsRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(()=>Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(()=>Promise.resolve(expectedAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      userRepository : mockUserRepository, 
      threadsRepository : mockThreadsRepository, 
      commentsRepository : mockCommentsRepository, 
      replyRepository : mockReplyRepository});

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockUserRepository.userOwnerVerification).toBeCalledWith(addReply.owner);
    expect(mockThreadsRepository.verifyAvailableThread).toBeCalledWith(addReply.threadId);
    expect(mockCommentsRepository.verifyAvailableComment).toBeCalledWith(addReply.commentId);
    expect(mockCommentsRepository.verifyCommentByThreadId).toBeCalledWith(addReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(addReply);
  })
})