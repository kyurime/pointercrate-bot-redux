require('dotenv').config();

import { DiscordInteractions, PartialApplicationCommand, Interaction, InteractionResponse, InteractionResponseType, InteractionType, ApplicationCommandOptionType, MessageFlags } from "slash-commands";
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import * as fs from "fs";
import * as path from "path";
import Subcommand from "./utils/subcommand";
import Command from "./utils/command";
import { test_db } from "./database/user";

const app = express();

const interaction = new DiscordInteractions({
  applicationId: process.env.APPLICATION_ID!,
  authToken: process.env.DISCORD_TOKEN!,
  publicKey: process.env.PUBLIC_KEY!,
});

const COMMANDS: Command[] = [];

function add_command(group: Command) {
  if (!(COMMANDS.includes(group))) {
    COMMANDS.push(group);
  }
}

require("require-all")({
  dirname: __dirname + "/commands",
  filter: /\.js$/,
  recursive: false,
  map: (name: string, module_path: string) => {
    // this isn't even ts anymore. good job me
    if (fs.statSync(module_path).isFile()) {
      const group_object = require(path.resolve(module_path));
      const group: Command = new group_object.default();

      if (group instanceof Command) {
        add_command(group);
      }
    }
  }
});

app.use(bodyParser.json());

app.get("/", (_req: Request, res: Response) => {
  return res.sendStatus(204);
});

app.post("/", async (req: Request, res: Response<InteractionResponse>) => {
  const signature = req.header("X-Signature-Ed25519");
  const timestamp = req.header("X-Signature-Timestamp");

  if (!signature || !timestamp) {
    return res.sendStatus(401);
  }

  // official discord library unironically uses this to get the rawbody
  const verified = await interaction.verifySignature(signature, timestamp, JSON.stringify(req.body));
  if (!verified) {
    return res.sendStatus(401);
  }

  // we can consider our data to be correct at this point
  const body: Interaction = req.body;

  switch (body.type) {
    case InteractionType.PING:
      return res.json({
        type: InteractionResponseType.PONG
      });
    case InteractionType.APPLICATION_COMMAND:
      try {
        const command = COMMANDS.find((group) => group.command.name == body.data.name);
        if (command) {
          return res.json(await command.on_command(body));
        }

        throw new Error("command not found");
      } catch (e) {
        console.error(e);

        return res.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: MessageFlags.EPHEMERAL,
            content: `error processing command with \`${e.message}\`.`
          }
        });
      }
  }
});

async function init_commands() {
  for await (const group of COMMANDS) {
    const application_command: PartialApplicationCommand = {
      name: group.command.name,
      description: group.command.description,
      options: group.command.options,
    }

    if (group.testing) {
      await interaction.createApplicationCommand(application_command, process.env.TEST_GUILD);
    } else {
      await interaction.createApplicationCommand(application_command);
    }
  }
}

init_commands();
test_db();

app.listen(process.env.PORT ?? 80, () => { console.log("initialized") });