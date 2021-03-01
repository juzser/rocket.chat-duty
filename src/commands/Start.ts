import { IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

import { OeDutyApp } from '../../OeDutyApp';

import { announceBlock } from '../blocks/announceBlock';
import { IDuty, IPerson, ITodo, TodoType } from '../interfaces/IDuty';
import { getDateId, getDateObj, sendMessage, updateMessage } from '../lib/helpers';
import { getData, updateData } from '../lib/services';

export async function StartCommand(
    app: OeDutyApp,
    sender: IUser,
    read: IRead,
    modify: IModify,
    persis: IPersistence,
    params?: Array<string>,
): Promise<void> {
    // Get existing duty
    const dateObj = getDateObj();
    const dateId = getDateId(dateObj);

    const duty = await getData(dateId, read);
    const isExistDuty = duty ? true : false;

    const prevDate = getDateObj('prev');
    const lastDuty = await getData(getDateId(prevDate), read);

    /** Get Team index by params or next team */
    let teamIndex = 0;
    let teamRepeat = false;

    if (params && params.length) { // Get team index by param
        teamIndex = parseInt(params[0], 10);
    } else if (duty || lastDuty) { // Next team
        const pDuty = duty ? duty : lastDuty;
        teamIndex = (pDuty.teamIndex === app.teamList.length - 1)
            ? 0
            : pDuty.teamIndex + 1;

        // If a team did not complete the min jobs, they have to do it again.
        // 0 to disable this function
        if (lastDuty && app.minCompletedJobs) {
            const completedJobsCount = lastDuty.todoList.filter((i) => i.status === TodoType.DONE).length;

            if (completedJobsCount < app.minCompletedJobs) {
                teamRepeat = true;
                teamIndex = lastDuty.teamIndex;
            }
        }
    }

    const team: Array<IPerson> = [];

    for (const username of app.teamList[teamIndex]) {
        const user = await read.getUserReader().getByUsername(username);
        const personData: IPerson = {
            username: user.username,
            id: user.id,
            name: user.name,
        };

        team.push(personData);
    }

    // Get Todo list
    const todoList = app.todoList.map((t) => {
        const todo: ITodo = {
            key: t.key,
            label: t.label,
            status: TodoType.ACTIVE,
            check: t.check ? true : false,
        };

        return todo;
    });

    // Prepare data
    const dutyData: IDuty = {
        id: dateId,
        msgId: '',
        team,
        teamIndex,
        todoList,
        startDate: dateObj,
        ended: false,
    };

    // Update previous duty status
    const prevDateId = getDateId(getDateObj('prev'));
    const prevDuty = await getData(prevDateId, read);

    if (prevDuty) {
        prevDuty.ended = true;
        await updateData(prevDateId, prevDuty, persis);

        // Rebuild the message
        const prevBlocks = modify.getCreator().getBlockBuilder();
        announceBlock(prevBlocks, prevDuty);

        await updateMessage({ app, messageId: prevDuty.msgId, sender, modify, blocks: prevBlocks });
    }

    // Store
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `duty-${dateId}`);

    // Build message block
    const room = app.announceRoom;
    const blocks = modify.getCreator().getBlockBuilder();
    announceBlock(blocks, dutyData, teamRepeat);
    const msgId = await sendMessage({ app, modify, room, blocks });

    dutyData.msgId = msgId || '';

    if (!isExistDuty) {
        await persis.createWithAssociation(dutyData, association);
    } else {
        await persis.updateByAssociation(association, dutyData);
    }
}
