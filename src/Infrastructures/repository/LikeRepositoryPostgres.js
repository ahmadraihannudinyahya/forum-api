const LikesRepository = require('../../Domains/likes/LikesRepository');

class LikeRepositoryPostgres extends LikesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikeComment({ userId, commentId, threadId }) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO likes VALUES ($1, $2, $3, $4) returning id',
      values: [id, threadId, commentId, userId],
    };
    await this._pool.query(query);
  }

  async removeLikeComment({ userId, commentId }) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async verifyUserNeverLikeComment({ userId, commentId }) {
    const query = {
      text: 'SELECT id FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new Error('User has liked');
    }
  }
}

module.exports = LikeRepositoryPostgres;
