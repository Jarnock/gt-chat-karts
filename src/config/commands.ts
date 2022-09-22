import { Game, PlayerSendsCommand } from "@gathertown/gather-game-client";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/GameEventContexts";

interface CommandList {
  [command: string]: {
    description: string;
    helptext?: string;
    example?: string;
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

const vehicles = {
  red: {
    spritesheet:
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/8Q3f9H0vFCqauF3h/30spKwsAjXGHJvKZut8gdK",
    normal:
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/8Q3f9H0vFCqauF3h/L7D4bMl00Ina1Nt0OnyByk",
  },
  blue: {
    spritesheet:
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/8Q3f9H0vFCqauF3h/fnKfcyelRys1PTt6sKE2Wk",
    normal:
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/8Q3f9H0vFCqauF3h/Gt01rnhG4BnU4TBr1QT5wT",
  },
  green: {
    spritesheet:
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/8Q3f9H0vFCqauF3h/GDlzUa16VjD0CyXMosA7gQ",
    normal:
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/8Q3f9H0vFCqauF3h/kVm8oCdMIoyulF7bh7n8mM",
  },
  yellow: {
    spritesheet:
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/8Q3f9H0vFCqauF3h/P9CW8PtMip2MlDn6Vwn6lq",
    normal:
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/8Q3f9H0vFCqauF3h/iWmVdkTzmKbdoFiZO3MmIL",
  },
};

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
          contents:
            `Command: /${parser[1]}` +
            `\nInstructions:\n${
              commandList[parser[1]].helptext ??
              commandList[parser[1]].description
            }` +
            (commandList[parser[1]].example
              ? `\nExample:\n${commandList[parser[1]].example}`
              : "") +
            `\n--------`,
        });
      } else if (parser.length === 1) {
        game.chat(context.playerId!, [], context.player!.map!, {
          contents:
            `Command: /${"help"}` +
            `\nInstructions:\n${commandList["help"].helptext}` +
            `\n--------`,
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
      "Gives you a go-kart! Can accept a color as a parameter. Currently accepts 'red' 'yellow' 'blue' and 'green'.",
    example: "'/go-kart blue'",
    public: true,
    fx: async ({ game, context, parser }: CommandProps) => {
      if (parser.length > 1 && Object.keys(vehicles).includes(parser[1])) {
        game.setVehicleId(
          JSON.stringify({
            id: "CustomGoKart",
            vehicleSpritesheet:
              vehicles[parser[1] as keyof typeof vehicles].spritesheet,
            vehicleNormal: vehicles[parser[1] as keyof typeof vehicles].normal,
          }),
          context.playerId
        );
        game.setSpeedModifier(2, context.playerId);
      } else {
        game.setVehicleId(
          JSON.stringify({
            id: "CustomGoKart",
            vehicleSpritesheet: vehicles["red"].spritesheet,
            vehicleNormal: vehicles["red"].normal,
          }),
          context.playerId
        );
        game.setSpeedModifier(2, context.playerId);
      }
    },
  },
};
