import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path'
import * as fs from 'fs';
import { Response } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }


  getLang = (txt) => {
    const regexKorean = /[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/g
    if (txt.match(regexKorean)) return 'ko'

    if (
      txt
        .split('')
        .filter(char => /\p{Script=Han}/u.test(char))
        .join('') === txt
    )
      return 'zh-CN'

    const regexJP = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/
    if (regexJP.test(txt)) return 'ja-JP'

    return 'en'
  }


  @Get()
  async getHello(@Query('text') text: string, @Res() res: Response) {
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
