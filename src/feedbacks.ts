import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from './main.js'

export type FeedbackSchema = Record<string, never>

export function UpdateFeedbacks(_self: ModuleInstance): CompanionFeedbackDefinitions<FeedbackSchema> {
	const feedbacks: CompanionFeedbackDefinitions<FeedbackSchema> = {}
	return feedbacks
}
