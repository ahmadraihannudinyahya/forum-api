/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({id = 'reply-123', content ='this is reply', commentId ='comment-123', owner='user-123', threadId = 'thread-123'}){
    const query = {
      text : 'INSERT INTO replies VALUES($1, $2, $3, $4 ,$5)',
      values : [id, threadId ,commentId, content, owner]
    }
    await pool.query(query);
  },
  async getRepliesById(id){
    const query = {
      text : 'SELECT * FROM replies WHERE id=$1',
      values : [id]
    };
    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable(){
    const query = {
      text : 'DELETE FROM replies WHERE 1=1'
    }
    await pool.query(query);
  },
}

module.exports = RepliesTableTestHelper;