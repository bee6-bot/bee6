import type { RESTPostAPIApplicationCommandsJSONBody, CommandInteraction } from 'discord.js';
import { z } from 'zod';
import type { StructurePredicate } from '../util/loaders.ts';

/**
 * The type of integration
 *
 * @see https://discord.com/developers/docs/resources/application#application-object-application-integration-types
 */

export enum IntegrationType {
	/**
	 * App is installable to servers
	 */
	GUILD = 0,
	/**
	 * App is installable to users
	 */
	USER = 1,
}

/**
 * The context in which the command can be used
 *
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types
 */
export enum InteractionContext {
	/**
	 * Interaction can be used within servers
	 */
	GUILD = 0,
	/**
	 * Interaction can be used within DMs with the app's bot user
	 */
	BOT_DM = 1,
	/**
	 * Interaction can be used within Group DMs and DMs other than the app's bot user
	 */
	PRIVATE_CHANNEL = 2,
}

export type CommandOption = {
	choices?: {
		name: string;
		value: string;
	}[];
	description: string;
	name: string;
	required?: boolean;
	type: number;
}


/**
 * Defines the structure of a command
 */
export type Command = {
	/**
	 * The data for the command
	 */
	data: RESTPostAPIApplicationCommandsJSONBody & {
		contexts?: InteractionContext[],
		integration_types?: IntegrationType[],
		options?: CommandOption[]
	};

	/**
	 * The function to execute when the command is called
	 *
	 * @param interaction - The interaction of the command
	 */
	execute(interaction: CommandInteraction): Promise<void> | void;
};

/**
 * Defines the schema for a command
 */
export const schema = z.object({
	data: z.record(z.any()),
	execute: z.function(),
	integration_types: z.array(z.number()).default([0, 1, 2]),
	contexts: z.array(z.number()).default([0, 1, 2]),
	options: z.array(z.object({
		type: z.number(),
		name: z.string(),
		description: z.string(),
	})).default([]),
});

/**
 * Defines the predicate to check if an object is a valid Command type.
 */
export const predicate: StructurePredicate<Command> = (structure: unknown): structure is Command =>
	schema.safeParse(structure).success;
