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

export function addData(id: string, data: string): `${string};${string}` {
  return `${id};${data}`;
}

export function separateData(fullId: string): ComponentIdentifier {
  const parts = fullId.split(";");
  const output: ComponentIdentifier = {
    id: parts[0],
  };
  if (parts.length > 1) {
    output.data = parts[1];
  }
  return output;
}

export abstract class ComponentConfig<
  b extends AnyComponentBuilder = AnyComponentBuilder,
  i extends MessageComponentInteraction = MessageComponentInteraction
> {
  readonly type: ComponentType;
  readonly id: string;
  private builder: b;
  execute?: (client: ClientExtended, interaction: i, data?: string) => void;

  constructor(
    type: ComponentType,
    id: string,
    builder: b,
    execute?: (client: ClientExtended, interaction: i, data?: string) => void
  ) {
    this.type = type;
    this.id = id;
    this.builder = builder;
    this.execute = execute;
  }

  getBuilder(label?: string): b {
    let id = this.id;
    if (label) {
      id = addData(id, label);
    }
    this.builder.setCustomId(id);
    return this.builder;
  }
}

export class ButtonConfig extends ComponentConfig<
  ButtonBuilder,
  ButtonInteraction
> {
  constructor(
    id: string,
    builder: ButtonBuilder,
    execute?: (
      client: ClientExtended,
      interaction: ButtonInteraction,
      data?: string
    ) => void
  ) {
    super(ComponentType.Button, id, builder, execute);
  }
}

export class RoleSelectConfig extends ComponentConfig<
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction
> {
  constructor(
    id: string,
    builder: RoleSelectMenuBuilder,
    execute?: (
      client: ClientExtended,
      interaction: RoleSelectMenuInteraction,
      data?: string
    ) => void
  ) {
    super(ComponentType.RoleSelect, id, builder, execute);
  }
}

export class UserSelectConfig extends ComponentConfig<
  UserSelectMenuBuilder,
  UserSelectMenuInteraction
> {
  constructor(
    id: string,
    builder: UserSelectMenuBuilder,
    execute?: (
      client: ClientExtended,
      interaction: UserSelectMenuInteraction,
      data?: string
    ) => void
  ) {
    super(ComponentType.UserSelect, id, builder, execute);
  }
}

export class StringSelectConfig extends ComponentConfig<
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
> {
  constructor(
    id: string,
    builder: StringSelectMenuBuilder,
    execute?: (
      client: ClientExtended,
      interaction: StringSelectMenuInteraction,
      data?: string
    ) => void
  ) {
    super(ComponentType.StringSelect, id, builder, execute);
  }
}

export class ChannelSelectConfig extends ComponentConfig<
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction
> {
  constructor(
    id: string,
    builder: ChannelSelectMenuBuilder,
    execute?: (
      client: ClientExtended,
      interaction: ChannelSelectMenuInteraction,
      data?: string
    ) => void
  ) {
    super(ComponentType.ChannelSelect, id, builder, execute);
  }
}

export class MentionableSelectConfig extends ComponentConfig<
  MentionableSelectMenuBuilder,
  MentionableSelectMenuInteraction
> {
  constructor(
    id: string,
    builder: MentionableSelectMenuBuilder,
    execute?: (
      client: ClientExtended,
      interaction: MentionableSelectMenuInteraction,
      data?: string
    ) => void
  ) {
    super(ComponentType.MentionableSelect, id, builder, execute);
  }
}
