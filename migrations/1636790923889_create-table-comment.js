exports.up = pgm => {

  pgm.createTable('comments', {
    id : {
      type : 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date : {
      type :'timestamp',
      notNull : true,
      default: pgm.func('current_timestamp')
    },
    isdelete: {
      type :'boolean',
      notNull : true,
      default: false
    }
  });

  pgm.addConstraint('comments','fk_commentsOwner.users_id','FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments','fk_comments_threadId.thread_id','FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('comments','fk_commentsOwner.users_id');
  pgm.dropConstraint('comments','fk_comments_threadId.thread_id');
  pgm.dropTable('comments');
};
