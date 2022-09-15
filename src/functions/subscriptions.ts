import { Game } from "@gathertown/gather-game-client";
import { commandList } from "../config/commands";

/*
    //Space Member Permssions, to create Moderator or Owner limited actions.
    Note: spaceId here is the randomly generated characters before the space name, ie spaceId\\spaceName, not both parts
    [spaceId:string]:{playerId:{currentlyEquippedWearables:{...},name:string,roles:{DEFAULT_BUILDER:boolean,OWNER:boolean,DEFAULT_MOD:boolean}}}
*/
import { spaceRoles } from "../functions/connection";

export const subscribeToEvents = (game: Game): void => {
  /*
    game.subscribeToEvent("playerChats",({playerChats},context)=>{
        
    })
    */
  /*
    game.subscribeToEvent("playerMoves",({playerMoves},context)=>{
        
    })
    */
  /*
    game.subscribeToEvent("playerInteracts",({playerInteracts},context)=>{
        
    })
    */

  game.subscribeToEvent(
    "playerSendsCommand",
    ({ playerSendsCommand }, context) => {
      const parser = playerSendsCommand.command.split(" ");

      commandList[parser[0]].fx({ game, parser, playerSendsCommand, context });
    }
  );

  /*
    game.subscribeToEvent("playerTriggersItem",({playerTriggersItem},context)=>{
        
    })
    */
};

const checkPermissions = (game: Game, playerId: string, roles: string[]) => {
  //OWNER, DEFAULT_MOD, DEFAULT_BUILDER
  let check: boolean[] = [];
  for (let role of roles) {
    check.push(spaceRoles[game.spaceId!.split("\\")[0]][playerId!].roles[role]);
  }
  return check.every(Boolean);
};
