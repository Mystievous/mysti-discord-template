# Mystievous' Discord Bot Template

## Info
This template uses [Discord.js](https://discord.js.org/) to assemble a discord bot, to then be run through Docker.

To run this without docker, it will require the environment variables from `envs`, or use the `.env` file directly in `index.ts` with a node package like `dotenv`.

## Usage
1. Make sure that you have [docker](https://www.docker.com/) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) installed.  
On windows, it is recommended to use WSL 2 instead of using windows directly.
2. Create and clone a new repository using this template.
3. Navigate to `./src/bot`, and run `yarn install` to install the required node modules.
4. Configure the environment variables in `./envs/` as described in `./envs/template.env`
5. run `docker compose up --build` to build and run the container

## Commands
Slash commands can be created in *a subfolder* of the `./commands/` folder. There are example commands already provided in `./commands/example/`.

```ts
export default {
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Example Command for the template repository."),
  async execute(client, interaction) {
    return await interaction.reply(
      `Hello, ${userMention(interaction.user.id)}`
    );
  },
} as CommandConfig;
```

They must be of the type `CommandConfig` which has the following properties:
- `data`: The `SlashCommandBuilder` that describes the command. You also define any user inputs through this builder.
- `execute`: The function to execute when this command is run by a user. This has additional parameters that are passed in:
  - `client`: The current `ClientExtended` of the bot. This includes the normal information, along with the database connection.
  - `interaction`: The object describing the command usage. This will include the user's id `interaction.user.id`.

Once configured and added to a subfolder of `./commands/`, you must run `yarn deploy-commands` to deploy the commands **to the server/guild defined in your `.env` through `GUILD_ID`**.

I have not currently added a way to do global commands.

## Components (i.e. Buttons, Selects)
Components can be created in *a subfolder* of the `./components/` folder. There are example components already provided in `./components/example/`, as well as a usage example in `./commands/example/actionrow.ts`.

```ts
export default new ButtonConfig(
  "accept",
  new ButtonBuilder()
    .setLabel("Accept")
    .setStyle(ButtonStyle.Primary),
  async (client, interaction) => {
    await interaction.reply({
      content: `Accepted, ${userMention(interaction.user.id)}`,
      ephemeral: true,
    });
  }
);
```

Components are different from commands in that they are classes that you must make a `new` instance of.

The constructor parameters are as follows:
- `id`: The unique ID of the component.
- `data`: The `ComponentBuilder` that describes the command. These will be the specific builder type of the component you are building.
- `execute`: The function to execute when this component is interacted with by a user. This has additional parameters that are passed in:
  - `client`: The current `ClientExtended` of the bot. This includes the normal information, along with the database connection.
  - `interaction`: The object describing the interaction between the user and the component. This will include the user's id `interaction.user.id`.
  - `data?`: An optional parameter that includes the label of the interacted component, if one is assigned (see "Dynamic Component Data" below.)

> [!WARNING]  
> Don't use semicolons in component IDs nor any Dynamic Data as described below.

To retrieve the builder for a component, to use in action rows, use `component.getBuilder()`  
For further usage with custom data, see below.

### Dynamic Component Data
In many situations, you may wish to have a component created by the bot that has an assigned "label", to identify it.

For instance, imagine you have a command where users can submit images, and you want buttons where other users could like them, and have that synced to the database. It won't cut it to just have all the component ids be `like`!  
In this case, you could give each one custom data that corresponds to the database Row ID of the image it's attached to. 

Behind the scenes, this concatenates the regular ID of the button with the custom data with a semicolon between. 
```ts
const customId = 'like';
const data = 2;

const resulting = addData(customId, data) // "like;2"
```
Note that you don't have to do any of that yourself, it is done automatically when you do `component.getBuilder(data)`.

> [!WARNING]  
> Discord component IDs have a max character limit of 100, so be cautious of getting too close to that!
