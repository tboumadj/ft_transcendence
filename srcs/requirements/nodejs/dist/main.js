"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const express = require("express");
const session = require("express-session");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: [
            "http://" + process.env.LOCAL_IP,
            "http://" + process.env.LOCAL_IP + ":3000/",
            "http://" + process.env.LOCAL_IP + ":8080",
            "http://" + process.env.LOCAL_IP + ":8081",
            "http://" + process.env.LOCAL_IP + ":9000",
            "https://api.intra.42.fr/",
            "https://signin.intra.42.fr/",
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '../uploadAvatar'), {
        prefix: '/api/uploadAvatar',
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(cookieParser());
    app.use(express.json());
    app.use(session({
        name: 'connect.sid',
        secret: 'boumboum',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map