/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', 
    threadId='thread-123', 
    commentId='comment-123', 
    userId = 'user-123'}){
    const query = {
      text : 'INSERT INTO likes VALUES($1 ,$2, $3, $4)',
      values : [id, threadId, commentId, userId]
    }
    await pool.query(query);
  },
  async removeLike(id = 'like-123'){
    const query = {
      text : 'DELETE FROM likes where id = $1',
      values : [id]
    };
    await pool.query(query);
  },
  async getLikeById(id){
    const query = {
      text : 'SELECT * FROM likes WHERE id = $1',
      values : [id]
    }
    const result = await pool.query(query);
    return result.rows;
  },

  async getLikeCommentId(commentId){
    const query = {
      text : 'SELECT id FROM likes WHERE comment_id = $1',
      values : [commentId]
    }
    const result = await pool.query(query);
    return result.rowCount;
  },

  async cleanTable(){
    const query = {
      text : 'DELETE FROM likes WHERE 1=1'
    }
    await pool.query(query);
  }
}

module.exports = LikesTableTestHelper;