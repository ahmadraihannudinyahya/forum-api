class GetReply{
  constructor(payload){
    const {id, content, date, username, commentId} = this._verifyPayload(payload);
    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.commentId = commentId;
  }
  _verifyPayload({id, content, date, username, isdelete, commentId}){
    if(!id||!content||!date||!username||!commentId){
      throw new Error('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if(typeof(id)!=='string'||typeof(commentId)!=='string'||typeof(content)!=='string'||typeof(date)!=='string'||typeof(username)!=='string'||typeof(isdelete)!=='boolean'){
      throw new Error('GET_REPLY.NOT_MEET_DATA_SPESIFICATION');
    }
    if(isdelete){
      return {id, content : '**komentar telah dihapus**', date, username, commentId}
    }
    return {id, content , date, username, commentId}
  }
}

module.exports = GetReply;