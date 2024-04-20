"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
        this.getLang = (text) => {
            if (!text) {
                return 'en';
            }
            const regexKorean = /[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/g;
            if (String(text).match(regexKorean))
                return 'ko';
            if (String(text)
                .split('')
                .filter(char => /\p{Script=Han}/u.test(char))
                .join('') === String(text))
                return 'zh-CN';
            const regexJP = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;
            if (regexJP.test(String(text)))
                return 'ja-JP';
            return 'en';
        };
    }
    async getHello(text, res) {
        if (!text)
            return {
                error: true,
            };
        const streamToBuffer = async (readableStream) => {
            const chunks = [];
            for await (const chunk of readableStream) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        };
        const PATH = path.resolve(`./audio/${text}.mp3`);
        const gtts = require('node-gtts')(this.getLang(text));
        return gtts.save(PATH, `${text}`, function () {
            streamToBuffer(fs.createReadStream(PATH)).then((response) => {
                res.send(response);
                fs.unlinkSync(PATH);
            });
        });
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('text')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map