import { LayoutBlock } from '@rocket.chat/ui-kit';
import { IDuty, TodoType } from '../interfaces/IDuty';
import { ContentGeneral } from '../lib/content';
import { OeDutyApp } from '../../OeDutyApp';

export function announceBlock(app: OeDutyApp, data: IDuty, repeat?: boolean): LayoutBlock[] {
    let team = '';
    for (const [index, person] of data.team.entries()) {
        team += `${index ? ', ' : ''}*${person.username}*`;
    }

    const start = `${data.startDate.date}/${data.startDate.month}`;
    const announceMessage = repeat
        ? ContentGeneral.repeatCaption(start, team)
        : ContentGeneral.announceCaption(start, team);

    const block: LayoutBlock[] = [{
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: announceMessage,
        },
    }, {
        type: 'divider',
    }];

    data.todoList.forEach((item) => {
        const label = (item.status === TodoType.DONE) ? `~${item.label}~` : item.label;

        block.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: label,
            },
            ...!data.ended && item.check && {
                accessory: {
                    type: 'button',
                    appId: app.getID(),
                    actionId: 'done-todo',
                    blockId: 'done-todo',
                    text: {
                        type: 'plain_text',
                        text: 'Done',
                    },
                    value: String(item.key),
                },
            },
        });
    });

    return block;
}
