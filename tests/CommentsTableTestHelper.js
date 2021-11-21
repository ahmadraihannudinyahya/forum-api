/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', 
    threadId='thread-123', 
    content='this is comment', 
    owner = 'user-123'}){
    const query = {
      text : 'INSERT INTO comments VALUES($1 ,$2, $3, $4)',
      values : [id, threadId, content, owner]
    }
    await pool.query(query);
  },
  async getCommentById(id){
    const query = {
      text : 'SELECT * FROM comments WHERE id = $1',
      values : [id]
    }
    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable(){
    const query = {
      text : 'DELETE FROM comments WHERE 1=1'
    }
    await pool.query(query);
  },
  async deleteComment(commentId){
    const query = {
      text : 'UPDATE comments SET isdelete = true  WHERE id = $1',
      values : [commentId]
    }
    await pool.query(query);
  }
}

module.exports = CommentsTableTestHelper;