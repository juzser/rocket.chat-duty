import {
    IAppAccessors,
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { ISetting } from '@rocket.chat/apps-engine/definition/settings';
import { UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

import { doneTodo } from './src/actions/doneTodo';
import { DutyCommand } from './src/commands/DutyCommand';
import { StartCommand } from './src/commands/Start';
import { ITodo } from './src/interfaces/IDuty';
import { settings } from './src/lib/settings';

export class OeDutyApp extends App {
    /**
     * The bot username who sends the messages
     */
    public botUsername: string;

    /**
     * The bot user sending messages
     */
    public botUser: IUser;

    /**
     * The room to post announcement
     */
    public announceRoom: IRoom;

    /**
     * List of persons grouped by week
     */
    public teamList: Array<Array<string>>;

    /**
     * List of works in a week
     */
    public todoList: Array<ITodo>;

    /**
     * Schedule to run `duty start` command
     */
    public schedulePattern: string;

    /**
     * Min completed jobs
     */
    public minCompletedJobs: number;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    /**
     * Implements the click of a button
     */
    public async executeBlockActionHandler(context: UIKitBlockInteractionContext, read: IRead, http: IHttp, persis: IPersistence, modify: IModify) {
        const data = context.getInteractionData();
        const { user, room } = data;

        switch (data.actionId) {
            case 'done-todo':
                await doneTodo({ app: this, data: data.value as string, room: room as IRoom, user, read, persis, modify });
                break;
        }

        return {
            success: true,
            triggerId: data.triggerId,
        };
    }

    /**
     * Loads the user who'll be posting messages as the botUser
     *
     * @param environmentRead
     * @param configModify
     */
    public async onEnable(environmentRead: IEnvironmentRead, configModify: IConfigurationModify): Promise<boolean> {
        this.botUsername = await environmentRead.getSettings().getValueById('Bot_Username');
        if (this.botUsername) {
            this.botUser = await this.getAccessors().reader.getUserReader().getByUsername(this.botUsername) as IUser;
        } else {
            return false;
        }

        const teamList = await environmentRead.getSettings().getValueById('team_list');
        const todoList = await environmentRead.getSettings().getValueById('todo_list');

        this.teamList = JSON.parse(teamList);
        this.todoList = JSON.parse(todoList);
        this.schedulePattern = await environmentRead.getSettings().getValueById('cron_pattern');
        this.minCompletedJobs = await environmentRead.getSettings().getValueById('min_complete');

        if (!this.teamList || !this.todoList) {
            return false;
        }

        const announceRoomName = await environmentRead.getSettings().getValueById('announce_room');

        if (announceRoomName) {
            this.announceRoom = await this.getAccessors().reader.getRoomReader().getByName(announceRoomName) as IRoom;
        } else {
            return false;
        }

        return true;
    }

    /**
     * Updates messages when settings are updated
     *
     * @param setting
     * @param configModify
     * @param read
     * @param http
     */
    public async onSettingUpdated(setting: ISetting, configModify: IConfigurationModify, read: IRead, http: IHttp): Promise<void> {
        switch (setting.id) {
            case 'Bot_Username':
                this.botUsername = setting.value;
                if (this.botUsername) {
                    this.botUser = await this.getAccessors().reader.getUserReader().getByUsername(this.botUsername) as IUser;
                }
                break;
            case 'announce_room':
                const announceRoomName = setting.value;

                if (announceRoomName) {
                    this.announceRoom = await this.getAccessors().reader.getRoomReader().getByName(announceRoomName) as IRoom;
                }
                break;
            case 'partner_list':
                this.teamList = JSON.parse(setting.value);
                break;
            case 'todo_list':
                this.todoList = JSON.parse(setting.value);
                break;
            case 'cron_pattern':
                this.schedulePattern = setting.value;
                break;
            case 'min_complete':
                this.minCompletedJobs = setting.value;
                break;
        }
    }

    /**
     * Add `duty` slash command
     *
     * @param configuration
     */
    public async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        // Settings
        await Promise.all(settings.map((setting) => configuration.settings.provideSetting(setting)));

        // Schedule `/duty start` command
        await configuration.scheduler.registerProcessors([{
            id: 'oe-duty',
            processor: async (job, read, modify, http, persis) => {
                await StartCommand(this, job.sender, read, modify, persis);
            },
        }]);

        // Slash Command
        await configuration.slashCommands.provideSlashCommand(new DutyCommand(this));
    }
}
