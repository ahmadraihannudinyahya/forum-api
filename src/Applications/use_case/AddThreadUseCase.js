const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const addThread = new AddThread(useCasePayload);
    await this._userRepository.userOwnerVerification(addThread.owner);
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
