import { Response } from 'express';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getLang: (text: string) => "ko" | "zh-CN" | "ja-JP" | "en";
    getAudio(text: string, res: Response): Promise<any>;
    getHello(): string;
}
