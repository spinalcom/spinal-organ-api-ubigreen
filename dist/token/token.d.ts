export declare class Token {
    static token: {
        access_token: string;
        token_type: string;
        expires_in: number;
    };
    private static USERNAME;
    private static PASSWORD;
    private static HOST;
    private static VIRTUALNETWORK;
    private static TOKEN_PROCESS;
    private static REFRESH_TOKEN_PROCESS;
    private static tokenExpiredDate;
    static getTokenacc(): AsyncGenerator<typeof Token.token, never, unknown>;
    static it: AsyncGenerator<{
        access_token: string;
        token_type: string;
        expires_in: number;
    }, never, unknown>;
    static getToken(): Promise<typeof Token.token>;
    static sendTokenRequest(): Promise<typeof Token.token>;
    static getRefreshToken(): Promise<typeof Token.token>;
    static tokenIsExpired(): boolean;
}
