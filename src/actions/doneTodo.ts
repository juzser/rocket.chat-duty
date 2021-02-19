import { IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

import { OeDutyApp } from '../../OeDutyApp';
import { announceBlock } from '../blocks/announceBlock';
import { TodoType } from '../interfaces/IDuty';
import { ContentGeneral } from '../lib/content';
import { getDateId, getDateObj, notifyUser, sendMessage } from '../lib/helpers';
import { getData, updateData } from '../lib/services';

export async function doneTodo({ app, data, room, user, read, persis, modify }: {
    app: OeDutyApp,
    room: IRoom,
    data: string,
    user: IUser,
    read: IRead,
    persis: IPersistence,
    modify: IModify,
}) {
    const dateId = getDateId(getDateObj());
    const duty = await getData(dateId, read);

    if (!duty) {
        notifyUser({ app, message: ContentGeneral.error.noDuty, user, room, modify});
        return;
    }

    if (duty.ended) {
        notifyUser({ app, message: ContentGeneral.error.dutyEnded, user, room, modify});
        return;
    }

    if (duty.team.findIndex((e) => e.username === user.username) === -1) {
        notifyUser({ app, message: ContentGeneral.error.notOwner, user, room, modify});
        return;
    }

    // Finish a job
    try {
        const todoIndex = duty.todoList.findIndex((e) => e.key === data);
        const todoJob = duty.todoList[todoIndex];
        if (todoJob.status === TodoType.DONE) {
            duty.todoList[todoIndex].status = TodoType.ACTIVE;
            await sendMessage({
                app,
                modify,
                room,
                message: ContentGeneral.notFinishAJob(todoJob.label),
            });
        } else {
            duty.todoList[todoIndex].status = TodoType.DONE;
            await sendMessage({
                app,
                modify,
                room,
                message: ContentGeneral.doneAJob(todoJob.label),
            });
        }
    } catch (e) {
        notifyUser({ app, message: e.message, user, room, modify});
        return;
    }

    await updateData(dateId, duty, persis);


    // Rebuild the message
    const message = await modify.getUpdater().message(duty.msgId, user);
    message.setEditor(message.getSender());

    const block = modify.getCreator().getBlockBuilder();
    await announceBlock(block, duty);
    message.setBlocks(block);

    return modify.getUpdater().finish(message);
}
