import { StatusService } from './status.service';
export declare class StatusController {
    private readonly statusService;
    constructor(statusService: StatusService);
    getStatus(): Promise<string>;
}
