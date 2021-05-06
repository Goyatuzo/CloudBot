﻿import * as Discord from "discord.js";

import presenceEvent from "./handlers/events/presence";
import messageEvent from "./handlers/events/message";
import readyEvent from './handlers/events/ready';

import { Configuration } from "../helpers/environment";
import { connect } from './tools/mongo'

/**
 * BOT token = process.env.DISCORD_TOKEN
 * DB URL = process.env.LURKER_DB
 * DB Username = process.env.LURKER_USERNAME
 * DB Password = process.env.LURKER_PASSWORD
 * DB Default = process.env.LURKER_SCHEMA
 */
//Startup.init();
connect(_ => {
    try {
        var bot = new Discord.Client();

        bot.on('ready', () => readyEvent(bot));
        bot.on('presenceUpdate', presenceEvent);
        bot.on('message', messageEvent(bot));

        bot.login(Configuration.DISCORD_TOKEN);
    } catch (ex) {
        console.error(ex);
    }
});
