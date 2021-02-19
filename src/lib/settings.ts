import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';
export const settings: Array<ISetting> = [
    {
        id: 'Bot_Username',
        type: SettingType.STRING,
        packageValue: 'rocket.cat',
        required: true,
        public: false,
        i18nLabel: 'duty_bot_username',
        i18nDescription: 'duty_bot_description',
    },
    {
        id: 'announce_room',
        type: SettingType.STRING,
        packageValue: 'general',
        public: false,
        required: false,
        i18nLabel: 'announce_room_label',
        i18nDescription: 'announce_room_desc',
    },
    {
        id: 'cron_pattern',
        type: SettingType.STRING,
        packageValue: '',
        public: false,
        required: false,
        i18nLabel: 'todo_cron_pattern_label',
        i18nDescription: 'todo_cron_pattern_desc',
    },
    {
        id: 'team_list',
        type: SettingType.CODE,
        packageValue: '',
        multiline: true,
        public: false,
        required: false,
        i18nLabel: 'team_list_label',
        i18nDescription: 'team_list_desc',
    },
    {
        id: 'todo_list',
        type: SettingType.CODE,
        packageValue: '',
        multiline: true,
        public: false,
        required: false,
        i18nLabel: 'todo_list_label',
        i18nDescription: 'todo_list_desc',
    },
];
