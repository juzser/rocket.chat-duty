import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { OeDutyApp } from '../../OeDutyApp';
import { TodoType } from '../interfaces/IDuty';
import { ContentGeneral } from '../lib/content';
import { getDateId, getDateObj, notifyUser } from '../lib/helpers';
import { getData } from '../lib/services';

export async function ShowCommand(app: OeDutyApp, context: SlashCommandContext, read: IRead, modify: IModify): Promise<void> {
    const room = context.getRoom();
    const user = context.getSender();

    const dateId = getDateId(getDateObj());
    const duty = await getData(dateId, read);

    if (!duty) {
        notifyUser({ app, message: ContentGeneral.error.notset, user, room, modify});
        return;
    }

    let team = '';
    for (const [index, person] of duty.team.entries()) {
        team += `${index ? ', ' : ''}*${person.username}*`;
    }

    const finishWorks = duty.todoList.filter((todo) => {
        return todo.check && todo.status === TodoType.DONE;
    }).map((e) => e.label).join(', ');

    const message = ContentGeneral.commands.show(team, finishWorks);
    await notifyUser({ app, user, room, message, modify });
}
