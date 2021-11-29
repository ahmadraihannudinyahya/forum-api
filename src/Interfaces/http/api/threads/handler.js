const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/GetThreadByIdUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyByIdUseCase = require('../../../../Applications/use_case/DeleteReplyByIdUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { title, body } = request.payload;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ owner, title, body });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { ThreadId: threadId } = request.params;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({ owner, content, threadId });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ owner, commentId, threadId });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const getThreadByIdUseCase = this._container.getInstance(GetThreadByIdUseCase.name);
    const thread = await getThreadByIdUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }

  async postReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      threadId, commentId, owner, content,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const deleteReplyByIdUseCase = this._container.getInstance(DeleteReplyByIdUseCase.name);
    await deleteReplyByIdUseCase.execute({
      owner, threadId, commentId, replyId,
    });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async putCommentLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    await likeCommentUseCase.execute({ userId, threadId, commentId });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
