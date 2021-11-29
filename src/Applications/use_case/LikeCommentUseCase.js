const NewLike = require('../../Domains/likes/entities/NewLike');

class LikeCommentUseCase {
  constructor({
    userRepository, threadsRepository, commentsRepository, likesRepository,
  }) {
    this._userRepository = userRepository;
    this._threadsRepository = threadsRepository;
    this._commentsRepository = commentsRepository;
    this._likesRepository = likesRepository;
  }

  async execute(payload) {
    const newLike = new NewLike(payload);
    await this._userRepository.userOwnerVerification(newLike.userId);
    await this._threadsRepository.verifyAvailableThread(newLike.threadId);
    await this._commentsRepository.verifyAvailableComment(newLike.commentId);
    await this._commentsRepository.verifyCommentByThreadId(newLike);
    try {
      await this._likesRepository.verifyUserNeverLikeComment(newLike);
      await this._likesRepository.addLikeComment(newLike);
    } catch {
      await this._likesRepository.removeLikeComment(newLike);
    }
  }
}

module.exports = LikeCommentUseCase;
