const AddedReply = require("../../Domains/replies/entities/AddedReply");

class ReplyRepositoryPostgres{
  constructor(pool, idGenerator){
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  async addReply({commentId, owner, content}){
    const id = `reply-${this._idGenerator()}`
    const query = {
      text : 'INSERT INTO replies VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values :[id, commentId, content, owner]
    }
    const result = await this._pool.query(query);
    return new AddedReply({...result.rows[0]});
  }
}

module.exports = ReplyRepositoryPostgres;