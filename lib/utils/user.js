import { redis } from 'node-karin'

export class baUser {
	constructor(qid) {
		;(this.qid = qid),
			(this.data = {
				accounts: [],
				default_account: 0,
				preferences: {
					waifu: null,
				},
			})
		this.init()
	}

	async init() {
		const res = await redis.get(`karin:plugin-ba:user_data:${this.qid}`)
		this.data = res ? JSON.parse(res) : this.data
	}
	async store() {
		await redis.set(
			`karin:plugin-ba:user_data:${this.qid}`,
			JSON.stringify(this.data)
		)
	}
	addAccount(fid, server) {
		this.accounts.push({
			fid: fid,
			server: server,
		})
		this.store()
	}
	delAccount(index) {
		this.accounts.splice(index, 1)
		this.store()
	}
	setDefaultAccount(index) {
		this.default_account = index
	}
}
