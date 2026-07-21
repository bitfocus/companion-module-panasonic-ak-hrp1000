import type ModuleInstance from './main.js'

export type VariableSchema = Record<string, never>

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions({})
}
