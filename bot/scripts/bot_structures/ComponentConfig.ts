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
import { ClientExtended } from "scripts/ClientExtended";

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

export abstract class ComponentConfig<
  b extends AnyComponentBuilder = AnyComponentBuilder,
  i extends MessageComponentInteraction = MessageComponentInteraction,
> {
  readonly type: ComponentType;
  readonly id: string;
  execute?: ComponentExecute<i>;

  private readonly createBuilder: () => b;

  constructor(
    type: ComponentType,
    id: string,
    createBuilder: () => b,
    execute?: ComponentExecute<i>,
  ) {
    this.type = type;
    this.id = id;
    this.createBuilder = createBuilder;
    this.execute = execute;
  }

  getBuilder(data?: string): b {
    const builder = this.createBuilder();
    builder.setCustomId(data ? addData(this.id, data) : this.id);
    return builder;
  }
}

export class ButtonConfig extends ComponentConfig<
  ButtonBuilder,
  ButtonInteraction
> {
  constructor(
    id: string,
    createBuilder: () => ButtonBuilder,
    execute?: ComponentExecute<ButtonInteraction>,
  ) {
    super(ComponentType.Button, id, createBuilder, execute);
  }
}

export class RoleSelectConfig extends ComponentConfig<
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction
> {
  constructor(
    id: string,
    createBuilder: () => RoleSelectMenuBuilder,
    execute?: ComponentExecute<RoleSelectMenuInteraction>,
  ) {
    super(ComponentType.RoleSelect, id, createBuilder, execute);
  }
}

export class UserSelectConfig extends ComponentConfig<
  UserSelectMenuBuilder,
  UserSelectMenuInteraction
> {
  constructor(
    id: string,
    createBuilder: () => UserSelectMenuBuilder,
    execute?: ComponentExecute<UserSelectMenuInteraction>,
  ) {
    super(ComponentType.UserSelect, id, createBuilder, execute);
  }
}

export class StringSelectConfig extends ComponentConfig<
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
> {
  constructor(
    id: string,
    createBuilder: () => StringSelectMenuBuilder,
    execute?: ComponentExecute<StringSelectMenuInteraction>,
  ) {
    super(ComponentType.StringSelect, id, createBuilder, execute);
  }
}

export class ChannelSelectConfig extends ComponentConfig<
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction
> {
  constructor(
    id: string,
    createBuilder: () => ChannelSelectMenuBuilder,
    execute?: ComponentExecute<ChannelSelectMenuInteraction>,
  ) {
    super(ComponentType.ChannelSelect, id, createBuilder, execute);
  }
}

export class MentionableSelectConfig extends ComponentConfig<
  MentionableSelectMenuBuilder,
  MentionableSelectMenuInteraction
> {
  constructor(
    id: string,
    createBuilder: () => MentionableSelectMenuBuilder,
    execute?: ComponentExecute<MentionableSelectMenuInteraction>,
  ) {
    super(ComponentType.MentionableSelect, id, createBuilder, execute);
  }
}

//
// Helper Functions
//

// Runtime check for a component's export
export function isComponentConfig(value: unknown): value is ComponentConfig {
  return value instanceof ComponentConfig;
}
