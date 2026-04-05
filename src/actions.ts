import type { CompanionActionDefinitions, CompanionInputFieldNumber } from '@companion-module/base'

import type ModuleInstance from './main.js'

export enum ActionId {
	SelectCamera = 'select_camera',
}

export type ActionSchema = {
	[ActionId.SelectCamera]: {
		options: {
			camera: number
		}
	}
}

const CameraOption = {
	id: 'camera',
	type: 'number',
	label: 'Camera',
	default: 1,
	min: 1,
	max: 99,
	range: true,
	step: 1,
	asInteger: true,
} as const satisfies CompanionInputFieldNumber

export function UpdateActions(self: ModuleInstance): CompanionActionDefinitions<ActionSchema> {
	const actions: CompanionActionDefinitions<ActionSchema> = {
		[ActionId.SelectCamera]: {
			name: 'Select Camera',
			options: [CameraOption],
			callback: async (event) => {
				const camera = event.options.camera
				if (!Number.isInteger(camera) || camera < 1 || camera > 99) {
					self.log('error', `Invalid camera selection: ${camera} — must be 1-99`)
					return
				}
				await self.httpGet(`aw_cam?cmd=XPT:${camera}&res=1`)
			},
		},
	}
	return actions
}
