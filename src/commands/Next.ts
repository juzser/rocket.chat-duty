import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { OeDutyApp } from '../../OeDutyApp';
import { ContentGeneral } from '../lib/content';
import { getDateId, getDateObj, notifyUser } from '../lib/helpers';
import { getData } from '../lib/services';

export async function NextCommand(app: OeDutyApp, context: SlashCommandContext, read: IRead, modify: IModify): Promise<void> {
    const room = context.getRoom();
    const user = context.getSender();

    const dateId = getDateId(getDateObj());
    const duty = await getData(dateId, read);

    if (!duty) {
        notifyUser({ app, message: ContentGeneral.error.noNext, user, room, modify});
        return;
    }

    let team = '';
    for (const [index, username] of app.teamList[duty.teamIndex + 1].entries()) {
        team += `${index ? ', ' : ''}*${username}*`;
    }

    const message = ContentGeneral.commands.next(team);
    await notifyUser({ app, user, room, message, modify });
}
