import { BlockBuilder, BlockElementType, ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';

import { IDuty, TodoType } from '../interfaces/IDuty';
import { ContentGeneral } from '../lib/content';

export function announceBlock(block: BlockBuilder, data: IDuty) {
    let team = '';
    for (const [index, person] of data.team.entries()) {
        team += `${index ? ', ' : ''}*${person.username}*`;
    }

    const start = `${data.startDate.date}/${data.startDate.month}`;

    block
        .addSectionBlock({
            text: block.newMarkdownTextObject(ContentGeneral.announceCaption(start, team)),
        });

    block.addDividerBlock();

    data.todoList.forEach((item, index) => {
        const label = (item.status === TodoType.DONE) ? `~${item.label}~` : item.label;

        block.addSectionBlock({
            text: block.newMarkdownTextObject(label),
            ...!data.ended && item.check && {
                    accessory: {
                    type: BlockElementType.BUTTON,
                    actionId: 'done-todo',
                    text: block.newPlainTextObject('Done'),
                    value: String(item.key),
                },
            },
        });
    });
}
