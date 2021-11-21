/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const { cleanTable } = require('./UsersTableTestHelper');

const ThreadsTableTestHelper = {
  async addthread({id = 'thread-123', title ='this is thread', body ='content threads', owner='user-123'}){
    const query = {
      text : 'INSERT INTO threads VALUES($1, $2, $3, $4 )',
      values : [id, title, body, owner]
    }
    await pool.query(query);
  },
  async getThreadsById(id){
    const query = {
      text : 'SELECT * FROM threads WHERE id=$1',
      values : [id]
    };
    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable(){
    const query = {
      text : 'DELETE FROM threads WHERE 1=1'
    }
    await pool.query(query);
  },
}

module.exports = ThreadsTableTestHelper;