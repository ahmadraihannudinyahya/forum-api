const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyByIdUseCase {
  constructor({
    userRepository, threadsRepository, commentsRepository, replyRepository,
  }) {
    this._userRepository = userRepository;
    this._threadsRepository = threadsRepository;
    this._commentsRepository = commentsRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload) {
    const deleteReply = new DeleteReply(payload);
    await this._userRepository.userOwnerVerification(deleteReply.owner);
    await this._threadsRepository.verifyAvailableThread(deleteReply.threadId);
    await this._commentsRepository.verifyAvailableComment(deleteReply.commentId);
    await this._commentsRepository.verifyCommentByThreadId(deleteReply);
    await this._replyRepository.verifyAvailableReply(deleteReply.replyId);
    await this._replyRepository.verifyReplyByCommentId(deleteReply);
    await this._replyRepository.verifyReplyOwner(deleteReply);
    await this._replyRepository.deleteReply(deleteReply.replyId);
  }
}

module.exports = DeleteReplyByIdUseCase;
