import { InstanceBase, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { InstanceBaseExt, PanasonicTypes } from './types.js'
import PQueue from 'p-queue'
import axios, { type AxiosInstance, AxiosResponse } from 'axios'

export { UpgradeScripts }

export default class ModuleInstance extends InstanceBase<PanasonicTypes> implements InstanceBaseExt {
	config!: ModuleConfig // Setup in init()
	#queue = new PQueue({ concurrency: 1, interval: 500, intervalCap: 1 })
	#controller = new AbortController()
	#axiosClient!: AxiosInstance

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.createClient()

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updatePresets() // export Presets
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', `destroy. PID ${process.pid}, ID: ${this.id}. Label: ${this.label}`)
		this.#queue.clear()
		this.#controller.abort()
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.#queue.clear()
		this.createClient()
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	private updateActions(): void {
		this.setActionDefinitions(UpdateActions(this))
	}

	private updateFeedbacks(): void {
		this.setFeedbackDefinitions(UpdateFeedbacks(this))
	}

	private updatePresets(): void {
		UpdatePresets(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	private createClient(host = this.config.host, port = this.config.port): void {
		this.#axiosClient = axios.create({ baseURL: `http://${host}:${port}/cgi-bin/` })
	}

	public async httpGet(path: string, priority: number = 0): Promise<void> {
		// We dont want to send a stream of camera selections, so instead of letting a queue build, only let the last message through
		this.#queue.clear()
		return await this.#queue.add(
			async ({ signal }) => {
				if (!this.#axiosClient) throw new Error('Axios Client not initialised')
				return await this.#axiosClient
					.get(path, { signal: signal })
					.then((_response: AxiosResponse<any, any>) => {
						return
					})
					.catch((_err) => {
						// The device always returns a HTTP even when the message works, so we ignore it
						return
					})
			},
			{ priority: priority, signal: this.#controller.signal },
		)
	}
}
