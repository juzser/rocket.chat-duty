import { IUser } from '@rocket.chat/apps-engine/definition/users';

export type IPerson = Pick<IUser, 'username' | 'id' | 'name'>;

export enum TodoType {
    ACTIVE = 'todo',
    DONE = 'done',
}

export interface IStartDate {
    date: number;
    month: number;
    year: number;
}

export interface ITodo {
    key: string;
    label: string;
    status: TodoType;
    check: boolean;
}

export interface IDuty {
    id: string; // date
    msgId: string;
    team: Array<IPerson>;
    teamIndex: number;
    todoList: Array<ITodo>;
    startDate: IStartDate;
    ended: boolean;
}
