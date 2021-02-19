import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { OeDutyApp } from '../../OeDutyApp';
import { ContentGeneral } from '../lib/content';
import { notifyUser } from '../lib/helpers';

export async function ListCommand(app: OeDutyApp, context: SlashCommandContext, read: IRead, modify: IModify): Promise<void> {
    const room = context.getRoom();
    const user = context.getSender();

    const message = ContentGeneral.commands.list(app.teamList);
    await notifyUser({ app, user, room, message, modify });
}
