class AddedReply {
  constructor(payload){
    const {id, content, owner} = this._verifyPayload(payload);
    this.id = id;
    this.content = content;
    this.owner = owner;
  }
  _verifyPayload({id, content, owner}){
    if(!id||!content||!owner){
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if(typeof(id)!=='string'||typeof(content)!=='string'||typeof(owner)!=='string'){
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_SPESIFICATION');
    }
    return {id, content, owner}
  }
}

module.exports= AddedReply;