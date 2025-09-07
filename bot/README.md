# Discord Bot

## Commands
Slash commands can be created in *a subfolder* of the `./bot/commands/` folder. There are example commands already provided in `./bot/commands/example/`.

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
} as SlashCommandConfig;
```

They must be one of the `CommandConfig` types which have the following properties:
- `global`: A flag marking whether the command should be added globally, otherwise it will be registered only to the individual guild from `./bot/envs/.env`
- `data`: The `CommandBuilder` that describes the command. You also define any user inputs through this builder.
- `execute`: The function to execute when this command is run by a user. This has additional parameters that are passed in:
  - `client`: The current `ClientExtended` of the bot. This includes the normal information, along with the database connection.
  - `interaction`: The object describing the command usage. This will include the user's id in `interaction.user.id`.

Once configured and added to a subfolder of `./bot/commands/`, you must run `just bot deploy` to deploy the commands **(Non-global commands are only deployed to the server/guild defined in your `.env` through `GUILD_ID`**.

## Components (i.e. Buttons, Selects)
Components can be created in *a subfolder* of the `./bot/components/` folder. There are example components already provided in `./bot/components/example/`, as well as a usage example in `./bot/commands/example/actionrow.ts`.

```ts
export default new ButtonConfig(
  "accept",
  new ButtonBuilder()
    .setLabel("Accept")
    .setStyle(ButtonStyle.Primary),
  async (client, interaction) => {
    await interaction.reply({
      content: `Accepted, ${userMention(interaction.user.id)}`,
      flags: MessageFlags.Ephemeral
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

For instance, imagine you have a command where users can submit images, and you want buttons where other users could like them, and have that synced to the database, without using reactions. 
It might not cut it to just have all the component ids be set to `like`, as that would cause the interactions to look the same!
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


## API Interaction

API-related code lives in the `./bot/scripts/api` directory.

This includes `axios.ts` which is the definition for the axios client, which the bot uses to send requests to the api, as well as all the folders that correspond to each "area" in the FastAPI python application.

Each "area" folder includes a `models.ts` which is a direct typescript translation of the pydantic models found in the `models.py` of each area in the python backend.

For example, this `models.py` file in python
```py
class EntryBase(BaseAppModel):
    name: Annotated[str, Field(max_length=45)]

class EntryPublic(EntryBase):
    id: int

class EntryCreate(EntryBase):
    pass
```

turns into the following `models.ts` file in typescript
```ts
export interface EntryBase {
    name: string;
}

export interface EntryPublic extends EntryBase {
    id: number;
}

export interface EntryCreate extends EntryBase { }
```

You can see how the fields are represented the same between the two.
These models are used for inputs and outputs for the API endpoints, so for the best results they must be identical.

Each area also includes the `controller.ts` file, which similarly should have functions for every endpoint found in the `view.py` for each area.

The following `controller.ts` file simply has a function to send a post request to `/entries` in the api.
```ts
import { api } from "../axios";
import { EntryCreate, EntryPublic } from "./models";

const routeUrl = "/entries";

export async function createEntry(entry: EntryCreate) {
  const { data } = await api.post<EntryPublic>(`${routeUrl}`, entry);
  return data;
}
```

Note that we leverage generics with `api.post<EntryPublic>(...)` to ensure that the return type matches the response type of the api endpoint.

Ideally, all real *logic* with these endpoints will happen on the api side, and the `controller.ts` files will simply be a way to catalog the inputs and outputs it needs.