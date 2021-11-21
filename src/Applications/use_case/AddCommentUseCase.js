const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentsRepository, userRepository, threadsRepository }) {
    this._commentsRepository = commentsRepository;
    this._userRepository = userRepository;
    this._threadsRepository = threadsRepository;
  }

  async execute(payload) {
    const newComment = new NewComment(payload);
    await this._userRepository.userOwnerVerification(newComment.owner);
    await this._threadsRepository.verifyAvailableThread(newComment.threadId);
    return this._commentsRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
