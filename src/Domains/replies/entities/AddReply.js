class AddReply{
  constructor(payload){
    const {owner, commentId, content, threadId} = this._verifyPayload(payload);
    this.owner = owner;
    this.commentId = commentId;
    this.content = content;
    this.threadId = threadId;
  }

  _verifyPayload({owner, commentId, content, threadId}){
    if(!owner||!commentId||!content||!threadId){
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if(typeof(owner)!=='string'||typeof(commentId)!=='string'||typeof(content)!=='string'||typeof(threadId)!=='string'){
      throw new Error('ADD_REPLY.NOT_MEET_DATA_SPESIFICATION')
    }
    return {owner, commentId, content, threadId}
  }
}

module.exports = AddReply;