import { redis } from 'node-karin'

class baUser {
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
	async save() {
		await redis.set(
			`karin:plugin-ba:user_data:${this.qid}`,
			JSON.stringify(this.data)
		)
	}
}

async function newUser(qid){
	const user = new baUser(qid)
	await user.init()
	return user
}

export { baUser, newUser }