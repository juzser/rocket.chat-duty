import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { OeDutyApp } from '../../OeDutyApp';

import { HelpCommand } from './Help';
import { ListCommand } from './List';
import { NextCommand } from './Next';
import { PrevCommand } from './Prev';
import { ShowCommand } from './Show';
import { StartCommand } from './Start';

export class DutyCommand implements ISlashCommand {
    public command = 'duty';
    public i18nParamsExample = 'duty_cmd_params';
    public i18nDescription = 'duty_cmd_desc';
    public providesPreview = false;

    private CommandEnum = {
        Help: 'help',
        List: 'list',
        Next: 'next',
        Prev: 'prev',
        Show: 'show',
        Start: 'start',
        Schedule: 'schedule',
        ScheduleCancel: 'schedule-cancel',
    };

    constructor(private readonly app: OeDutyApp) { }
    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const [command, ...params] = context.getArguments();

        if (!command) {
            return await HelpCommand(this.app, context, read, modify);
        }

        switch (command) {
            case this.CommandEnum.List:
                await ListCommand(this.app, context, read, modify);
                break;
            case this.CommandEnum.Next:
                await NextCommand(this.app, context, read, modify);
                break;
            case this.CommandEnum.Prev:
                await PrevCommand(this.app, context, read, modify);
                break;
            case this.CommandEnum.Show:
                await ShowCommand(this.app, context, read, modify);
                break;
            case this.CommandEnum.Start:
                await StartCommand(this.app, context.getSender(), read, modify, persis, params);
                break;
            case this.CommandEnum.Schedule:
                // Cancel any previous jobs first
                await modify.getScheduler().cancelJob('oe-duty');
                if (this.app.schedulePattern) {
                    await modify.getScheduler().scheduleRecurring({
                        id: 'oe-duty',
                        interval: this.app.schedulePattern,
                        data: {},
                    });
                }
                break;
            case this.CommandEnum.ScheduleCancel:
                await modify.getScheduler().cancelJob('oe-duty');
                break;

            default:
                await HelpCommand(this.app, context, read, modify);
        }
    }
}
