export declare class TokenManager {
    private auth_url;
    private token;
    private expire_in;
    private obtained_time;
    constructor();
    isExpired(): boolean;
    getToken(): Promise<string>;
}
