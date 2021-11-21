class GetComment {
  constructor(payload) {
    const {
      id, username, date, content,
    } = this._verifyPayload(payload);
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
  }

  _verifyPayload({
    id, username, date, content, isdelete,
  }) {
    if (!id || !username || !date || !content) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof (id) !== 'string'
    || typeof (id) !== 'string'
    || typeof (username) !== 'string'
    || typeof (content) !== 'string'
    || typeof (isdelete) !== 'boolean') {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }
    if (isdelete) {
      return {
        id, username, date, content: '**komentar telah dihapus**',
      };
    }
    return {
      id, username, date, content,
    };
  }
}
module.exports = GetComment;
