import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }


  getLang = (text: string) => {
    if (!text) {
      return 'en'
    }
    const regexKorean = /[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/g
    if (String(text).match(regexKorean)) return 'ko'

    if (
      String(text)
        .split('')
        .filter(char => /\p{Script=Han}/u.test(char))
        .join('') === String(text)
    )
      return 'zh-CN'

    const regexJP = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/
    if (regexJP.test(String(text))) return 'ja-JP'

    return 'en'
  }


  @Get()
  async getHello(@Query('text') text: string, @Res() res: Response) {
    if (!text) return {
      error: true,
    }
    const streamToBuffer = async (readableStream: fs.ReadStream) => {
      const chunks = [];
      for await (const chunk of readableStream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    }

    const PATH = path.resolve(`./audio/${text}.mp3`);
    const gtts = require('node-gtts')(this.getLang(text));
    return gtts.save(PATH, `${text}`, function () {
      streamToBuffer(fs.createReadStream(PATH)).then((response) => {
        res.send(response)
        fs.unlinkSync(PATH)
      })
    })
  }
}
