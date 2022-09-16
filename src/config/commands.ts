import { Game, PlayerSendsCommand } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/GameEventContexts";

interface CommandList {
  [command: string]: {
    description: string;
    helptext?: string;
    public: boolean;
    fx: Function;
  };
}

interface CommandProps {
  game: Game;
  parser: string[];
  context: ServerClientEventContext;
  playerSendsCommand: PlayerSendsCommand;
}

export const commandList: CommandList = {
  commands: {
    description:
      "Chats to the user all the public commands registered by this extension.",
    public: true,
    fx: async ({ game, context }: CommandProps) => {
      Object.keys(commandList).forEach((key) => {
        if (commandList[key].public) {
          game.chat(context.playerId!, [], context.player!.map!, {
            contents: `Command: /${key}\nDescription: ${commandList[key].description}\n--------`,
          });
        }
      });
    },
  },
  help: {
    description: "Chats to the user detailed instructions about a command.",
    public: true,
    helptext: "Enter /help [command] to get details about /[command].",
    fx: async ({ game, context, parser }: CommandProps) => {
      if (parser.length > 1 && commandList[parser[1]].public) {
        game.chat(context.playerId!, [], context.player!.map!, {
          contents: `Command: /${parser[1]}\nInstructions:\n${
            commandList[parser[1]].helptext ??
            commandList[parser[1]].description
          }\n--------`,
        });
      } else if (parser.length === 1) {
        game.chat(context.playerId!, [], context.player!.map!, {
          contents: `Command: /${"help"}\nInstructions:\n${
            commandList["help"].helptext
          }\n--------`,
        });
      } else {
        game.chat(context.playerId!, [], context.player!.map!, {
          contents: `Sorry, no such command found.\n--------`,
        });
      }
    },
  },

  /*
  "command": {
    description: "Short description of what the command does",
    public: true or false, determines if command is shown when /command is run.
    fx: {({game, parser, context, playerSendsCommand}: CommandProps) => {}} //This is the function that is run when the command is used. Can be async if needed.
  }
  */

  "fun-fact": {
    description: "Chats a fun fact to the user.",
    public: true,
    fx: async ({ game, context }: CommandProps) => {
      const res = await (
        await fetch("https://asli-fun-fact-api.herokuapp.com/")
      ).json();

      game.chat(context.playerId!, [], context.player!.map!, {
        contents: `🎲 Fun Fact: ${res.data.fact.toLowerCase()}\n--------`,
      });
    },
  },

  "secret-cat-fact": {
    description:
      "Chats a cat fact to the user, but the command is hidden from /commands",
    public: false,
    fx: async ({ game, context }: CommandProps) => {
      const res = await (
        await fetch("https://meowfacts.herokuapp.com/")
      ).json();

      game.chat(context.playerId!, [], context.player!.map!, {
        contents: `🐱 Secret Cat Fact: ${res.data[0].toLowerCase()}\n--------`,
      });
    },
  },

  "go-kart": {
    description: "Provides a go-kart for the user on command.",
    helptext:
      "Gives you a go-kart! Your cart will fall off if you interact with something, and be cleaned up automatically.",
    public: true,
    fx: async ({ game, context }: CommandProps) => {
      game.setVehicleId(
        JSON.stringify({
          id: "CustomGoKart",
          vehicleSpritesheet:
            "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/rOyxaSNfaWoBAmHL/oSrvJtnYOl1RdygeNhEBMY",
          vehicleNormal:
            "https://cdn.gather.town/storage.googleapis.com/gather-town-dev.appspot.com/uploads/jWPtQUVNBX941s7Y/9MGlPImpzGq2WBbGss6fRv",
        }),
        context.playerId
      );
      game.setSpeedModifier(2, context.playerId);
    },
  },
};
