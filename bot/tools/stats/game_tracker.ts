﻿import { GuildMember } from "discord.js";
import * as UserMethods from "../user_methods";

import stats from "../stats/stats";
import { GameType } from "../../../helpers/discord-js-enums";
import { connectedDb } from '../../tools/mongo';

/**
 * When the user starts playing a game, call this function.
 * @param user
 */
function beginLogging(user: GuildMember, game: string) {
    if (!user.presence.game.streaming && user.presence.game.type === GameType.PLAYING) {
        stats.addGame(user, game);
    }
}

/**
 * When the user stops playing a game, call this function.
 * @param user
 */
async function endLogging(user: GuildMember, game: string) {
    const timeBegan: Date = stats.startedAt(user, game);
    const timeEnded: Date = new Date();
    stats.removeGame(user, game);

    if (timeBegan === null || ((timeEnded.getTime() - timeBegan.getTime()) / 1000) < 1) {
        return;
    }

    const match = await connectedDb.collection('discord_db_user').findOne({ userId: user.id });

    if (!match) {
        return;
    }

    console.log(`Processing gametime ${user.displayName} for ${game}`);

    let newEntry = {
        "sessionBegin": timeBegan,
        "sessionEnd": timeEnded,
        "gameName": game,
        "userId": match.userId,
        "gameDetail": user.presence.game.details ? user.presence.game.details : null,
        "gameState": user.presence.game.state
    }

    if (game === "League of Legends") {
        newEntry["gameType"] = user.presence.game.assets ? user.presence.game.assets.largeText : null;
    }

    const gametimeCollection = connectedDb.collection('game_time');
    gametimeCollection.insertOne(newEntry).catch(err => {
        console.error(err);
    });

    console.log(`Logged ${(timeEnded.getTime() - timeBegan.getTime()) / 1000} seconds for ${match.username} playing ${newEntry.gameName}`);
    // If a valid number of seconds, be sure to add it to the database.
    // writeNewTimeRow(user, seconds);
}

export default function (before: GuildMember, after: GuildMember) {
    const beforeGameName = UserMethods.getGameName(before);
    const afterGameName = UserMethods.getGameName(after);

    const userQuitGame = beforeGameName && beforeGameName !== afterGameName;
    const presenceChanged = beforeGameName === afterGameName && JSON.stringify(before.presence.game) !== JSON.stringify(after.presence.game);

    // If the user has a game on before, that means they quit that game.
    if (userQuitGame || presenceChanged) {
        endLogging(before, beforeGameName);
    }

    // If the user has a game on after, that means they began playing the game
    if (afterGameName) {
        beginLogging(after, afterGameName);
    }
}
