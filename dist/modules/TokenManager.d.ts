export declare class TokenManager {
    private auth_url;
    tokenGenerator: AsyncGenerator<any, void, void>;
    constructor();
    isExpired(obtained_time: number, expire_in: number): boolean;
    private generateToken;
    getToken(): Promise<string>;
}
