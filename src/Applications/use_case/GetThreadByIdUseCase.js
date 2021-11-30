class GetThreadByIdUseCase {
  constructor({ threadsRepository, commentsRepository, replyRepository, likesRepository }) {
    this._threadsRepository = threadsRepository;
    this._commentsRepository = commentsRepository;
    this._replyRepository = replyRepository;
    this._likesRepository = likesRepository;
  }

  async execute(threadId) {
    await this._threadsRepository.verifyAvailableThread(threadId);
    const thread = await this._threadsRepository.getThreadById(threadId);
    const comments = await this._commentsRepository.getCommentsByThreadId(threadId);
    if (comments.length > 0) {
      thread.comments = [];
      const replies = await this._replyRepository.getReplyByThreadId(threadId);
      const likes = await this._likesRepository.getLikeByThreadId(threadId)
      comments.forEach((comment) => {
        if (replies.length > 0) {
          comment.replies = [];
          replies.forEach((reply) => {
            if (comment.id === reply.commentId) {
              comment.replies.push(reply);
            }
          });
          comment.likeCount = likes.filter(like => like.comment_id = comment.id)
        }
        thread.comments.push(comment);
      });
    }
    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
