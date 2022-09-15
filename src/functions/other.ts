import { Game } from "@gathertown/gather-game-client";

export const danceParty = (game: Game): void => {
  let randomTime = Math.floor(Math.random() * 300);

  setInterval(() => {
    for (let player of Object.keys(game.players)) {
      game.move(4, false, player);
    }
    randomTime = Math.floor(Math.random() * 300);
  }, randomTime);
};
