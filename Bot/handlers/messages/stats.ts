﻿import {Message, Client, TextChannel} from "discord.js";
import * as _ from "lodash";

import {getDurationSumTimeSorted} from "../../database/times_table";

function _stringifyTime(seconds) {
    const m = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const h = Math.floor(m / 60);
    const minutes = m % 60;

    const days = Math.floor(h / 24);
    const hours = Math.floor(h % 24);
    return days + ' days ' + hours + ' hours ' + minutes + ' minutes ' + secs + ' seconds';
}

function _formatResults(results) {
    let summary = "";

    results.map(row => {
        summary += `${row.name}\n - ${_stringifyTime(row.duration)}\n`;
    });
    return summary;
}

export default function (message: Message) {
    const tokens = _.drop(message.cleanContent.split(" "));
    const client = message.client;

    // If the user only requests stats, then print out the server's stats.
    if (tokens.length === 0) {
        const users = (message.channel as TextChannel).server.members;
        const userIds = users.map(user => user);

        getDurationSumTimeSorted(userIds, results => {
            client.sendMessage(message.channel, `Visit http://lurkerbot.azurewebsites.net/query?serverId=${message.server.id} for a graphical summary.`, (error: Error) => {
                console.log("Error sending a message:");
                console.log(error);
            });
        });
    } else if (tokens[0] === "me") {
        client.sendMessage(message.channel, `Visit http://lurkerbot.azurewebsites.net/query?userId=${message.author.id} for a graphical summary.`, (error: Error) => {
            console.log("Error sending a message:");
            console.log(error);
        });
    }
}
