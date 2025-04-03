class baUser {
    constructor(qid){
        this.qid = qid
        this.accounts = []
        this.default_account = 0
    }
    addAccount(fid, server){
        this.accounts.push({
            fid: fid,
            server: server
        })
    }
    
}