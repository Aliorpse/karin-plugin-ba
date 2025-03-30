class baUser {
    constructor(qid){
        this.QID = qid
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