class GetThreadByIdUseCase {
  constructor({ threadsRepository, commentsRepository }) {
    this._threadsRepository = threadsRepository;
    this._commentsRepository = commentsRepository;
  }

  async execute(threadId) {
    await this._threadsRepository.verifyAvailableThread(threadId);
    const thread = await this._threadsRepository.getThreadById(threadId);
    thread.comments = await this._commentsRepository.getCommentsByThreadId(threadId);
    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
