# Discord Bot

## Commands

Slash commands can be created in _a subfolder_ of the `./bot/commands/` folder. There are example commands already provided in `./bot/commands/example/`.

```ts
export default makeSlashCommand({
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Example Command for the template repository."),
  async execute(_client, interaction) {
    await interaction.reply(`Hello, ${userMention(interaction.user.id)}`);
  },
});
```

Unused parameters must be prefixed with an underscore (like `_client` above), otherwise type checking will fail.

Commands must be one of the `CommandConfig` types which have the following properties:

- `global`: A flag marking whether the command should be added globally, otherwise it will be registered only to the individual guild from `./bot/envs/.env`
- `data`: The `CommandBuilder` that describes the command. You also define any user inputs through this builder.
- `execute`: The function to execute when this command is run by a user. This has additional parameters that are passed in:
  - `client`: The current `ClientExtended` of the bot. This includes the normal information, along with the loaded commands and components.
  - `interaction`: The object describing the command usage. This will include the user's id in `interaction.user.id`.

Besides `makeSlashCommand`, there's `makeSubcommandCommand` for commands with subcommands (see `./bot/commands/example/subcommand.ts`), and `makeMessageContextMenuCommand` / `makeUserContextMenuCommand` for right-click menu commands (see `./bot/commands/example/message-context-menu.ts`). The context menu makers set the command type themselves, so `interaction` is already typed as a message or user interaction.

### Autocomplete

String, number and integer options can suggest values as the user types. Mark the option with `.setAutocomplete(true)`, and add an `autocomplete` function to the command (or to the subcommand, for subcommand commands). There's an example in `./bot/commands/example/autocomplete.ts`.

```ts
async autocomplete(_client, interaction) {
  const typed = interaction.options.getFocused();
  const matches = names.filter((name) => name.includes(typed)).slice(0, 25);
  await interaction.respond(matches.map((name) => ({ name, value: name })));
},
```

- It must `respond()` within 3 seconds, and can't be deferred, so keep lookups fast.
- Discord shows at most 25 suggestions.
- If a command has more than one autocompleted option, `getFocused(true)` returns `{ name, value }`, so you can tell which option is being typed in.

> [!WARNING]  
> Suggestions aren't enforced: users can still submit any text, so validate the value in `execute`.

Once configured and added to a subfolder of `./bot/commands/`, you must run `just bot deploy` to deploy the commands **(Non-global commands are only deployed to the server/guild that is defined in your `.env` through `GUILD_ID`)**.

## Components (i.e. Buttons, Selects)

Components can be created in _a subfolder_ of the `./bot/components/` folder. There are example components already provided in `./bot/components/example/`, as well as a usage example in `./bot/commands/example/actionrow.ts`.

```ts
export default makeButton({
  id: "accept",
  createBuilder: () =>
    new ButtonBuilder().setLabel("Accept").setStyle(ButtonStyle.Primary),
  async execute(_client, interaction) {
    await interaction.reply({
      content: `Accepted, ${userMention(interaction.user.id)}`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
```

Components are made with the `make*` function for their type: `makeButton`, `makeStringSelect`, `makeUserSelect`, `makeRoleSelect`, `makeChannelSelect` and `makeMentionableSelect`.

The fields are as follows:

- `id`: The unique ID of the component.
- `createBuilder`: A function that returns the `ComponentBuilder` that describes the component. These will be the specific builder type of the component you are building. A fresh builder is created every time `getBuilder()` is called, so separate uses never overwrite each other.
- `execute`: The function to execute when this component is interacted with by a user. This has additional parameters that are passed in:
  - `client`: The current `ClientExtended` of the bot. This includes the normal information, along with the loaded commands and components.
  - `interaction`: The object describing the interaction between the user and the component. This will include the user's id `interaction.user.id`.
  - `data?`: An optional parameter that includes the custom data of the interacted component, if one is assigned (see "Dynamic Component Data" below.)

> [!WARNING]  
> Don't use semicolons in component IDs. (Dynamic Data as described below may contain them.)

To retrieve the builder for a component, to use in action rows, use `component.getBuilder()`
For further usage with custom data, see below.

### Dynamic Component Data

In many situations, you may wish to have a component created by the bot that has an assigned "label", to identify it.

For instance, imagine you have a command where users can submit images, and you want buttons where other users could like them, and have that synced to the database, without using reactions.
It might not cut it to just have all the component ids be set to `like`, as that would cause the interactions to look the same!
In this case, you could give each one custom data that corresponds to the database Row ID of the image it's attached to.

Behind the scenes, this concatenates the regular ID of the button with the custom data with a semicolon between.

```ts
const customId = "like";
const data = "2";

const resulting = addData(customId, data); // "like;2"
```

Note that you don't have to do any of that yourself, it is done automatically when you do `component.getBuilder(data)`.

> [!WARNING]  
> Discord component IDs have a max character limit of 100, so be cautious of getting too close to that!

## Modals

Unlike components, modals aren't registered ahead of time. They're built inline wherever you need one (in a command or component's `execute`), so any pre-filled values can come straight from the surrounding code. Then show it with `promptModal` from `./bot/scripts/promptModal.ts`, which waits for the user to submit it. There's a full example in `./bot/commands/example/modal.ts`.

```ts
const modal = new ModalBuilder()
  .setTitle("Edit Message")
  .addLabelComponents(
    new LabelBuilder()
      .setLabel("Message")
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId("text")
          .setStyle(TextInputStyle.Paragraph)
          .setValue(message.content), // pre-filled
      ),
  );

const submit = await promptModal(interaction, modal);
if (!submit) return; // the user closed it, or it timed out

const text = submit.fields.getTextInputValue("text");
await submit.reply({ content: "Saved!", flags: MessageFlags.Ephemeral });
```

- `promptModal` sets the modal's custom ID itself, and only accepts the submission from the same user and invocation, so multiple people can use it at once.
- It returns `null` if the user closes the modal or doesn't submit in time (15 minutes by default). Discord doesn't tell the bot when a modal is closed, so this is the only way to know.
- Reply to `submit` (the submitted modal), not the original `interaction`.
- If the reply takes time (e.g. uploading `files`), `deferReply` on `submit` first, then `editReply`.

> [!WARNING]  
> Showing a modal must be the **first** response to an interaction, so don't `deferReply` or `reply` before calling `promptModal`.

> [!NOTE]  
> If the bot restarts while a modal is open, submitting it will show "This interaction failed".

## API Interaction

API-related code lives in the `./bot/scripts/api` directory.

This includes:

- `utils/orval-mutator.ts` which is the `fetch` wrapper that the generated code uses to send requests to the api (it adds the API URL and key from your `.env`)
- `errors.ts` which contains `UnexpectedResponseError`, for API responses a command doesn't handle
- `generated/` which will be automatically created by the orval library based on our OpenAPI schema generated by FastAPI.

### Generating API Code

To generate code with orval, just run `just generate-api-client`.<br/>
This will automatically generate the `openapi.json` schema file from FastAPI, and run orval to generate the Typescript code from it based on the `orval.config.mjs` configuration.

### API Key

To generate the API key, run `just generate-api-key` and copy it to your `.env` file.

### Using API endpoints

To use API endpoints, you just have to import the functions (named after the endpoint's function name in the API, in camelCase) and use them like normal.

They are asynchronous, so you will have to `await` their response.

They return the response `status` along with its `data`, instead of throwing on error statuses. The `data` type depends on which `status` you check, so handle each status the endpoint can return. Only network errors (e.g. the API being down) are thrown.

An example of using the `createEntry` endpoint:

```ts
import { createEntry } from "app/scripts/api/generated/endpoints/entries";
import { UnexpectedResponseError } from "app/scripts/api/errors";

const name = "Entry Name";

const response = await createEntry({ name });

switch (response.status) {
  case 200:
    console.log(`Created entry ${response.data.id}`);
    break;
  case 409:
    console.log("An entry with that name already exists.");
    break;
  // Statuses this command doesn't expect; the command handler logs and replies
  case 400:
  case 401:
  case 403:
  case 422:
    throw new UnexpectedResponseError("createEntry", response);
}
```

## Linting & Type Checking

- `just bot lint` runs [oxlint](https://oxc.rs/docs/guide/usage/linter.html) with type-aware rules (e.g. catching promises that aren't awaited).
- `just bot typecheck` runs the TypeScript compiler without emitting any files.

The bot itself runs with [tsx](https://tsx.is/), which doesn't type check, so run these before committing.
