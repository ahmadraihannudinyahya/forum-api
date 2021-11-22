class GetThreadByIdUseCase {
  constructor({ threadsRepository, commentsRepository,replyRepository }) {
    this._threadsRepository = threadsRepository;
    this._commentsRepository = commentsRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadsRepository.verifyAvailableThread(threadId);
    const thread = await this._threadsRepository.getThreadById(threadId);
    const comments = await this._commentsRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getReplyByThreadId(threadId);
    thread.comments = [];
    comments.forEach(comment => {
      comment.replies = [];
      replies.forEach( reply => {
        if(comment.id === reply.commentId){
          comment.replies.push(reply);
        }
      })
      thread.comments.push(comment);
    })
    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
