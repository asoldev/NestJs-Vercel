import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }


  getLang = (text: string) => {
    const regexKorean = /[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/g
    if (text.match(regexKorean)) return 'ko'

    if (
      text
        .split('')
        .filter(char => /\p{Script=Han}/u.test(char))
        .join('') === text
    )
      return 'zh-CN'

    const regexJP = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/
    if (regexJP.test(text)) return 'ja-JP'

    return 'en'
  }

  @Get('/audio')
  async getAudio(@Query('text') text: string, @Res() res: Response) {
    const streamToBuffer = async (readableStream: fs.ReadStream) => {
      const chunks = [];
      for await (const chunk of readableStream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    }


    const PATH = path.join('var/task/tmp', `/audio/${text.toLocaleLowerCase()}.mp3`);

    fs.writeFileSync(PATH, '')
    const gtts = require('node-gtts')(this.getLang(text.toLocaleLowerCase()));
    return gtts.save(PATH, `${text}`, function () {
      streamToBuffer(fs.createReadStream(PATH)).then((response) => {
        res.send(response)
        fs.unlinkSync(PATH)
      })
    })
  }

  @Get()
  getHello() {
    return "Hello"
  }
}
