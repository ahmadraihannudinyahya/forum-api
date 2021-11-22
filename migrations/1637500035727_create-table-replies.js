exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('replies', {
    id : {
      type : 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
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
    },
  });

  pgm.addConstraint('replies','fk_replies_owner.users_id','FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('replies','fk_replies_commentId.comments_id','FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint('replies','fk_replies_threadId.thread_id','FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('replies','fk_replies_owner.users_id');
  pgm.dropConstraint('replies','fk_replies_commentId.comments_id');
  pgm.dropConstraint('replies','fk_replies_threadId.thread_id');
  pgm.dropTable('replies');
};
