const AddReply = require("../../Domains/replies/entities/AddReply");

class AddReplyUseCase{
  constructor({userRepository, threadsRepository, commentsRepository, replyRepository}){
    this._userRepository = userRepository;
    this._threadsRepository = threadsRepository;
    this. _commentsRepository = commentsRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload){
    const addReply = new AddReply(payload);
    await this._userRepository.userOwnerVerification(addReply.owner);
    await this._threadsRepository.verifyAvailableThread(addReply.threadId);
    await this._commentsRepository.verifyAvailableComment(addReply.commentId);
    await this._commentsRepository.verifyCommentByThreadId(addReply);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;