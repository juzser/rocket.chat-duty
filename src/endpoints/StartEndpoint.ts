import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

import { OeDutyApp } from './../../OeDutyApp';

import { StartCommand } from '../commands/Start';

export class StartEndpoint extends ApiEndpoint {
    public path: string = 'duty-start';

    constructor(public app: OeDutyApp) {
        super(app);
    }

    // tslint:disable-next-line:max-line-length
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        await StartCommand(this.app, this.app.botUser, read, modify, persis);
        return this.success();
    }
}
