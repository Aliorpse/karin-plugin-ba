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
		this.data.accounts.push({
			fid: fid,
			server: server,
		})
		this.store()
	}
	delAccount(index) {
		this.data.accounts.splice(index, 1)
		this.store()
	}
	setDefaultAccount(index) {
		this.data.default_account = index
	}
}
