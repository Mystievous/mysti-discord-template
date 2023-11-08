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

export interface ComponentConfig<b extends AnyComponentBuilder = AnyComponentBuilder, i extends MessageComponentInteraction = MessageComponentInteraction> {
  type: ComponentType;
  id: string;
  builder: b;
  execute?: (client: ClientExtended, interaction: i) => void;
}

export interface ButtonConfig extends ComponentConfig<ButtonBuilder, ButtonInteraction> {
  type: ComponentType.Button;
}

export interface RoleSelectConfig extends ComponentConfig<RoleSelectMenuBuilder, RoleSelectMenuInteraction> {
  type: ComponentType.RoleSelect;
}

export interface UserSelectConfig extends ComponentConfig<UserSelectMenuBuilder, UserSelectMenuInteraction> {
  type: ComponentType.UserSelect;
}

export interface StringSelectConfig extends ComponentConfig<StringSelectMenuBuilder, StringSelectMenuInteraction> {
  type: ComponentType.StringSelect;
}

export interface ChannelSelectConfig extends ComponentConfig<ChannelSelectMenuBuilder, ChannelSelectMenuInteraction> {
  type: ComponentType.ChannelSelect;
}

export interface MentionableSelectConfig extends ComponentConfig<MentionableSelectMenuBuilder, MentionableSelectMenuInteraction> {
  type: ComponentType.MentionableSelect;
}
