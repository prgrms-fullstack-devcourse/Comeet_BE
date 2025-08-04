import { AxiosError } from "axios";

interface IAxiosResponse {
    status?: number;
    statusText?: string;
    data?: any;
    url?: string;
}

export class AxiosException
    extends Error
    implements IAxiosResponse
{
    status?: number;
    statusText?: string;
    data?: any;
    url?: string;

    constructor(data?: IAxiosResponse) {
        super(data && JSON.stringify(data));
        data && Object.assign(this, data);
    }

    static fromAxiosError(err: AxiosError): AxiosException {
        return new AxiosException({
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            url: err.response?.config.url
        });
    }
}