const ThreadsRepository = require('../ThreadsRepository');

describe('ThreadsRepository', () => {
  it('should throw error when invoke abstract behavior', () => {
    const threadsRepository = new ThreadsRepository();
    expect(threadsRepository.addThread).toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(threadsRepository.verifyAvailableThread).toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(threadsRepository.getThreadById).toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
