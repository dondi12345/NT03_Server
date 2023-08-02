import express from 'express';
import path from 'path'; 
import { engine } from 'express-handlebars';
import { portConfig } from '../Enviroment/Env';
import { rootDir } from '../..';

export function InitWebServer() {
    const app = express();
    const port = portConfig.portWebServer;
    app.use(express.static(path.join(rootDir, './public')));
    app.engine(
        'hbs',
        engine({
            extname: '.hbs',
            helpers: require('./helpers/handlebars'),
        }),
    );
    app.set('view engine', 'hbs');
    app.set('views', path.join(rootDir, './resources/views'));

    app.get('/', (req, res) => {
        res.render('home');
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}