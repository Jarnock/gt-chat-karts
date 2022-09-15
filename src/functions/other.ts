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

export const gokartCleanup = (game: Game) => {
  setInterval(() => {
    Object.keys(game.completeMaps).forEach((map) => {
      let emptygokarts = Object.values(
        game.completeMaps[map].objects ?? {}
      ).filter((object) => object.id?.startsWith("GOKART_"));
      emptygokarts.forEach(async (gokart) => {
        await game.deleteObject(map, gokart.id!, true);
      });
    });
  }, 5000);
};
