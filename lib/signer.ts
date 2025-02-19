import { createData, ArweaveSigner } from 'warp-arbundles';
import { JWKInterface } from 'arweave/node/lib/wallet';

interface SignDataItemOptions {
    data: Uint8Array;
    tags?: { name: string; value: string }[];
    target?: string;
    anchor?: string;
}

export function createUnsecureSigner(wallet: JWKInterface) {
    return async function signDataItem({
        data,
        tags,
        target,
        anchor,
    }: SignDataItemOptions): Promise<{ id: string; raw: Buffer }> {
        const signer = new ArweaveSigner(wallet);
        const dataItem = createData(data, signer, { tags, target, anchor });
        await dataItem.sign(signer);
        const id = await dataItem.id;
        const raw = dataItem.getRaw();
        return { id, raw };
    };
}
