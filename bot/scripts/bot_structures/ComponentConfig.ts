import {
  AnyComponentBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction,
  ComponentType,
  MentionableSelectMenuBuilder,
  MentionableSelectMenuInteraction,
  MessageComponentInteraction,
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction,
} from "discord.js";

import { ClientExtended } from "app/scripts/ClientExtended";

export interface ComponentIdentifier {
  id: string;
  data?: string;
}

const SEPARATOR = ";" as const;

export function addData(
  id: string,
  data: string,
): `${string}${typeof SEPARATOR}${string}` {
  return `${id}${SEPARATOR}${data}`;
}

// Split a custom ID into the component ID and its optional data payload.
// Only the first separator splits, so the data may contain ";"
export function separateData(fullId: string): ComponentIdentifier {
  const index = fullId.indexOf(SEPARATOR);
  if (index === -1) {
    return { id: fullId };
  }
  return { id: fullId.slice(0, index), data: fullId.slice(index + 1) };
}

// Handler for a component interaction. `data` is the optional payload
// encoded in the custom ID, with `addData`.
export type ComponentExecute<I extends MessageComponentInteraction> = (
  client: ClientExtended,
  interaction: I,
  data?: string,
) => Promise<void>;

// Everything in a component file
export interface ComponentDefinition<
  B extends AnyComponentBuilder,
  I extends MessageComponentInteraction,
> {
  // Unique ID, used to route interactions to this component. Must not contain ";"
  id: string;
  // Creates the builder, called by every `getBuilder()`.
  // Fresh builders are required because of custom data storage.
  createBuilder: () => B;
  execute: ComponentExecute<I>;
}

// A loaded component, with the definition along with the type and `getBuilder()`
export interface ComponentConfig<
  B extends AnyComponentBuilder = AnyComponentBuilder,
  I extends MessageComponentInteraction = MessageComponentInteraction,
> extends ComponentDefinition<B, I> {
  type: ComponentType;
  // Builds the component, with `data` encoded into the custom ID with `addData`
  getBuilder: (data?: string) => B;
}

// Creates a `make*` function for one component type
function componentMaker<
  B extends AnyComponentBuilder,
  I extends MessageComponentInteraction,
>(type: ComponentType) {
  return (definition: ComponentDefinition<B, I>): ComponentConfig<B, I> => ({
    ...definition,
    type,
    getBuilder(data) {
      const builder = definition.createBuilder();
      builder.setCustomId(data ? addData(definition.id, data) : definition.id);
      return builder;
    },
  });
}

export const makeButton = componentMaker<ButtonBuilder, ButtonInteraction>(
  ComponentType.Button,
);
export const makeChannelSelect = componentMaker<
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction
>(ComponentType.ChannelSelect);
export const makeMentionableSelect = componentMaker<
  MentionableSelectMenuBuilder,
  MentionableSelectMenuInteraction
>(ComponentType.MentionableSelect);
export const makeUserSelect = componentMaker<
  UserSelectMenuBuilder,
  UserSelectMenuInteraction
>(ComponentType.UserSelect);
export const makeRoleSelect = componentMaker<
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction
>(ComponentType.RoleSelect);
export const makeStringSelect = componentMaker<
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
>(ComponentType.StringSelect);

//
// Helper Functions
//
//
const COMPONENT_TYPES: ReadonlySet<unknown> = new Set([
  ComponentType.Button,
  ComponentType.StringSelect,
  ComponentType.UserSelect,
  ComponentType.RoleSelect,
  ComponentType.ChannelSelect,
  ComponentType.MentionableSelect,
]);

// Runtime check for a component's export
export function isComponentConfig(value: unknown): value is ComponentConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    COMPONENT_TYPES.has(value.type) &&
    "id" in value &&
    typeof value.id === "string" &&
    "getBuilder" in value &&
    typeof value.getBuilder === "function" &&
    "execute" in value &&
    typeof value.execute === "function"
  );
}
