"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitWebServer = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_handlebars_1 = require("express-handlebars");
const Env_1 = require("../Enviroment/Env");
const __1 = require("../..");
function InitWebServer() {
    const app = (0, express_1.default)();
    const port = Env_1.portConfig.portWebServer;
    app.use(express_1.default.static(path_1.default.join(__1.rootDir, './public')));
    app.engine('hbs', (0, express_handlebars_1.engine)({
        extname: '.hbs',
        helpers: require('./helpers/handlebars'),
    }));
    app.set('view engine', 'hbs');
    app.set('views', path_1.default.join(__1.rootDir, './resources/views'));
    app.get('/', (req, res) => {
        res.render('home');
    });
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
exports.InitWebServer = InitWebServer;
