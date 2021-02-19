import { IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { BlockBuilder } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

import { OeDutyApp as appClass } from '../../OeDutyApp';
import { IStartDate } from '../interfaces/IDuty';
import { AppConfig } from './config';

/**
 * Sends a message using bot
 *
 * @param app
 * @param modify
 * @param room Where to send message to
 * @param message (optional) What to send
 * @param attachments (optional) Message attachments
 * @param blocks (optional) Message blocks
 *
 * @returns messageId
 */
export async function sendMessage({ app, modify, room, message, attachments, blocks }: {
    app: appClass,
    modify: IModify,
    room: IRoom,
    message?: string,
    attachments?: Array<IMessageAttachment>,
    blocks?: BlockBuilder,
}): Promise<string | undefined> {
    const msg = modify.getCreator().startMessage()
        .setGroupable(false)
        .setSender(app.botUser)
        .setUsernameAlias(AppConfig.alias)
        .setAvatarUrl(AppConfig.avatar)
        .setRoom(room);

    if (message && message.length > 0) {
        msg.setText(message);
    }
    if (attachments && attachments.length > 0) {
        msg.setAttachments(attachments);
    }
    if (blocks !== undefined) {
        msg.setBlocks(blocks);
    }

    try {
        return await modify.getCreator().finish(msg);
    } catch (error) {
        app.getLogger().log(error);
        return;
    }
}

/**
 * Notifies user using bot
 *
 * @param app
 * @param modify
 * @param user Who to notify
 * @param message What to send
 * @param attachments (optional) Message attachments (such as action buttons)
 */
export async function notifyUser({ app, message, user, room, modify, attachments }: {
    app: appClass,
    message: string,
    user: IUser,
    room: IRoom,
    modify: IModify,
    attachments?: Array<IMessageAttachment>,
}): Promise<void> {
    const msg = modify.getCreator().startMessage()
        .setSender(app.botUser)
        .setUsernameAlias(AppConfig.alias)
        .setAvatarUrl(AppConfig.avatar)
        .setText(message)
        .setRoom(room)
        .getMessage();
    try {
        await modify.getNotifier().notifyUser(user, msg);
    } catch (error) {
        app.getLogger().log(error);
    }
}

/**
 * Update a message using bot
 *
 * @param app
 * @param modify
 * @param messageId Update which message by id
 * @param message (optional) What to send
 * @param attachments (optional) Message attachments
 * @param blocks (optional) Message blocks
 *
 * @returns messageId
 */
export async function updateMessage({ app, modify, messageId, sender, message, attachments, blocks }: {
    app: appClass,
    modify: IModify,
    messageId: string,
    sender: IUser,
    message?: string,
    attachments?: Array<IMessageAttachment>,
    blocks?: BlockBuilder,
}): Promise<void> {
    const msg = await modify.getUpdater().message(messageId, sender);
    msg.setEditor(msg.getSender());

    if (message && message.length > 0) {
        msg.setText(message);
    }
    if (attachments && attachments.length > 0) {
        msg.setAttachments(attachments);
    }
    if (blocks !== undefined) {
        msg.setBlocks(blocks);
    }

    try {
        return await modify.getUpdater().finish(msg);
    } catch (error) {
        app.getLogger().log(error);
        return;
    }
}

/**
 * Get dateObj
 *
 * @param direction? prev
 */
export function getDateObj(direction?: string): IStartDate {
    /* Create id by monday date */
    const currentDate = new Date();
    const curDay = currentDate.getDay();

    const alpha = (direction && direction === 'prev') ? -7 : 0;

    // set date to Monday of current week, start from Sunday 0
    currentDate.setDate(currentDate.getDate() + (1 - curDay) + alpha);

    const d: IStartDate = {
        date: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
    };

    return d;
}

/**
 * Get dateId
 *
 * @param dateObj
 */
export function getDateId(dateObj: IStartDate): string {
    return `${dateObj.date}-${dateObj.month}-${dateObj.year}`;
}
