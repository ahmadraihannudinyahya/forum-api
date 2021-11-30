const LikesRepository = require('../LikesRepository');

describe('LikesRepository', () => {
  it('should throw error when invoke unimplemented method', () => {
    const likesRepository = new LikesRepository();
    expect(likesRepository.addLikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(likesRepository.removeLikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(likesRepository.verifyUserNeverLikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(likesRepository.getLikeByThreadId({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
