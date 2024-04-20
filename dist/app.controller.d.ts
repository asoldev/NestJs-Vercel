import { AppService } from './app.service';
import { Response } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getLang: (txt: any) => "ko" | "zh-CN" | "ja-JP" | "en";
    getHello(text: string, res: Response): Promise<any>;
}
