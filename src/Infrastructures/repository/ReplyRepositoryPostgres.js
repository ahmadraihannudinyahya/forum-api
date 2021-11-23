const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const GetReply = require('../../Domains/replies/entities/GetReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply({
    threadId, commentId, owner, content,
  }) {
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, commentId, content, owner],
    };
    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getReplyByThreadId(threadId) {
    const query = {
      text: 'SELECT replies.id, replies.content, TO_CHAR(replies.date, \'YYYY-MM-DD_HH24-MI-SS-MS\') AS date, users.username, replies.comment_id, replies.isdelete FROM replies JOIN users ON replies.owner = users.id WHERE replies.thread_id = $1 ORDER BY replies.date ASC',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows.map((reply) => new GetReply({ ...reply, commentId: reply.comment_id }));
  }

  async verifyAvailableReply(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Balasan komen tidak ditemukan');
    }
  }

  async verifyReplyByCommentId({ replyId, commentId }) {
    const query = {
      text: 'SELECT id FROM replies WHERE comment_id = $1 AND id =$2',
      values: [commentId, replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('balasan komen tidak ditemukan di komen tersebut');
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET isdelete = true  WHERE id = $1',
      values: [replyId],
    };
    await this._pool.query(query);
  }

  async verifyReplyOwner({ replyId, owner }) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Balasan komentar tersebut bukan milik anda');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
