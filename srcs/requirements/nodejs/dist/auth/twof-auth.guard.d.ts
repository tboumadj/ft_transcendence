import { NestMiddleware } from "@nestjs/common";
export declare class TwofMiddleware implements NestMiddleware {
    use(user: any): Promise<boolean>;
}
