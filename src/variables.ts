import type ModuleInstance from './main.js'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type VariableSchema = {}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions({})
}
