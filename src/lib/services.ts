import { IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';

import { IDuty } from '../interfaces/IDuty';

/**
 * Get data from association
 *
 * @param day Date of Monday of the week want to get data (ex: 19-01-2020)
 * @param read
 */
export async function getData(dateId: string, read: IRead): Promise<IDuty> {
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `duty-${dateId}`);

    const [ data ] = await read.getPersistenceReader().readByAssociation(association);

    return data as IDuty;
}

/**
 * Update Game data in association
 *
 * @param newData
 * @param persis
 */
export async function updateData(dateId: string, newData: IDuty, persis: IPersistence): Promise<string> {
    // Save to store
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `duty-${dateId}`);
    return persis.updateByAssociation(association, newData);
}
