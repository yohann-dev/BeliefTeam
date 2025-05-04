import { db } from '../firebase.ts';

export class BelieveTokensService {

   constructor() {}

    async getAll(): Promise<any[]> {
        const tokens = await db.collection('believeTokens').get();

        return tokens.docs.map(doc => doc.data());
    }

}
