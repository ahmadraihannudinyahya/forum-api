const AddedReply = require("../../Domains/replies/entities/AddedReply");
const GetReply = require("../../Domains/replies/entities/GetReply");

class ReplyRepositoryPostgres{
  constructor(pool, idGenerator){
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  async addReply({threadId ,commentId, owner, content}){
    const id = `reply-${this._idGenerator()}`
    const query = {
      text : 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values :[id, threadId ,commentId, content, owner]
    }
    const result = await this._pool.query(query);
    return new AddedReply({...result.rows[0]});
  };

  async getReplyByThreadId(threadId){
    const query = {
      text : 'SELECT replies.id, replies.content, TO_CHAR(replies.date, \'YYYY-MM-DD_HH24-MI-SS-MS\') AS date, users.username, replies.comment_id, replies.isdelete FROM replies JOIN users ON replies.owner = users.id WHERE replies.thread_id = $1',
      values : [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows.map(reply => new GetReply({...reply, commentId : reply.comment_id}))
  }
}

module.exports = ReplyRepositoryPostgres;