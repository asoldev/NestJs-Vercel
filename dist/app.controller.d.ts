import { Response } from 'express';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getLang: (text: string) => "en" | "ko" | "zh-CN" | "ja-JP";
    getHello(text: string, res: Response): Promise<any>;
}
