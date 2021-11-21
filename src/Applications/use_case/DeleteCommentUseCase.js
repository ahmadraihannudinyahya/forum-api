const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ userRepository, threadsRepository, commentsRepository }) {
    this._userRepository = userRepository;
    this._threadsRepository = threadsRepository;
    this._commentsRepository = commentsRepository;
  }

  async execute(payload) {
    const deleteComment = new DeleteComment(payload);
    await this._userRepository
      .userOwnerVerification(deleteComment.owner);
    await this._threadsRepository
      .verifyAvailableThread(deleteComment.threadId);
    await this._commentsRepository
      .verifyAvailableComment(deleteComment.commentId);
    await this._commentsRepository
      .verifyCommentsOwner({ owner: deleteComment.owner, commentId: deleteComment.commentId });
    return this._commentsRepository
      .deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
