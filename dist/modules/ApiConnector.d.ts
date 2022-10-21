export declare class ApiConnector {
    private TokenManager;
    constructor();
    getConfig(): Promise<{
        headers: {
            "Content-Type": string;
            Authorization: string;
        };
    }>;
    get(url: string): Promise<import("axios").AxiosResponse<any, any>>;
    post(url: string, data: any): Promise<import("axios").AxiosResponse<any, any>>;
}
