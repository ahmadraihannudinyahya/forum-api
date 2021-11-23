const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentsRepository = require('../../Domains/comments/CommentsRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const GetComment = require('../../Domains/comments/entities/GetComment');

class CommentsRepositoryPostgres extends CommentsRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGeerator = idGenerator;
  }

  async addComment(NewComment) {
    const id = `comment-${this._idGeerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, NewComment.threadId, NewComment.content, NewComment.owner],
    };
    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentsOwner({ commentId, owner }) {
    const query = {
      text: 'SELECT id FROM comments WHERE owner = $1',
      values: [owner],
    };
    const results = await this._pool.query(query);
    const match = results.rows.find((result) => result.id === commentId);
    if (!match) {
      throw new AuthorizationError('Comment tersebut bukan milik anda');
    }
  }

  async deleteComment({ commentId }) {
    const query = {
      text: 'UPDATE comments SET isdelete = true  WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.id, comments.content, users.username, TO_CHAR(comments.date, \'YYYY-MM-DD_HH24-MI-SS-MS\') AS date, comments.isdelete FROM comments JOIN users ON comments.owner = users.id WHERE thread_id = $1 ORDER BY comments.date ASC',
      values: [threadId],
    };
    const results = await this._pool.query(query);
    const comments = results.rows.map((result) => new GetComment(result));
    return comments;
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Comment Tidak Ditemukan');
    }
  }

  async verifyCommentByThreadId({ threadId, commentId }) {
    const query = {
      text: 'SELECT thread_id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`Comments not found in ${threadId}`);
    }
  }
}

module.exports = CommentsRepositoryPostgres;
