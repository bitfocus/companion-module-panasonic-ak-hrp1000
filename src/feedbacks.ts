import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from './main.js'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type FeedbackSchema = {}

export function UpdateFeedbacks(_self: ModuleInstance): CompanionFeedbackDefinitions<FeedbackSchema> {
	const feedbacks: CompanionFeedbackDefinitions<FeedbackSchema> = {}
	return feedbacks
}
