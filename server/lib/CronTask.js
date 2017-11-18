const cron = require('node-cron')
const log = require('./log')('CronTask')

class CronTask {
	constructor(name, cronString, job) {
		this.name = name
		this.cronString = cronString
		this.runOnce = job
		this.task = cron.schedule(cronString, () =>
			this.runOnce((err, res) => {
				if(err) log.error(err)
			}), false)
	}

	start(cb) {
		if(this.task.running) return log.warn(`${this.name} cron job already started`)
		log.info(`${this.name} cron job started`, { cronString: `'${this.cronString}'` })
		this.runOnce((err, res) => {
			if(err) return log.err(err)
			this.task.start()
			cb()
		})
	}

	stop() {
		this.task.stop()
		log.info(`${this.name} cron job stopped`)
	}

	isRunning() {
		this.task.running
	}
}

module.exports = CronTask
