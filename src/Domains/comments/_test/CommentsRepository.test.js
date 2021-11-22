const CommentsRepository = require('../CommentsRepository');

describe('CommentsRepository', () => {
  it('should throw error when invoke unimplemented method', () => {
    const commentsRepository = new CommentsRepository();

    expect(commentsRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentsRepository.deleteComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentsRepository.verifyCommentsOwner({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentsRepository.getCommentsByThreadId()).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentsRepository.verifyAvailableComment()).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentsRepository.verifyCommentByThreadId()).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
