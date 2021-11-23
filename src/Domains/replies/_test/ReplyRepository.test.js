const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const replyRepository = new ReplyRepository();
    expect(() => replyRepository.addReply()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(() => replyRepository.getReplyByThreadId()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(() => replyRepository.verifyAvailableReply()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(() => replyRepository.verifyReplyByCommentId()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(() => replyRepository.deleteReply()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(() => replyRepository.verifyReplyOwner()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
