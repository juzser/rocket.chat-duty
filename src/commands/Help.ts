import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { OeDutyApp } from '../../OeDutyApp';
import { ContentGeneral } from '../lib/content';
import { notifyUser } from '../lib/helpers';

export async function HelpCommand(app: OeDutyApp, context: SlashCommandContext, read: IRead, modify: IModify): Promise<void> {
    const message = ContentGeneral.help;

    await notifyUser({ app, user: context.getSender(), room: context.getRoom(), message, modify });
}
