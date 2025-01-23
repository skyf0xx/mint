// types/global.d.ts
interface Window {
    arweaveWallet?: {
        connect(permissions: string[]): Promise<void>;
        disconnect(): Promise<void>;
        getActiveAddress(): Promise<string>;
        getPermissions: () => Promise<string[]>;
    };
}
