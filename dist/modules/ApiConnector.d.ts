export declare class ApiConnector {
    private TokenManager;
    constructor();
    getConfig(): Promise<{
        headers: {
            "Content-Type": string;
            Authorization: string;
        };
    }>;
    get<T>(url: string): Promise<import("axios").AxiosResponse<T, any>>;
    post(url: string, data: any): Promise<import("axios").AxiosResponse<any, any>>;
}
