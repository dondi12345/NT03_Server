import express from 'express';
import { engine } from 'express-handlebars';
import { portConfig } from '../Enviroment/Env';

export function InitWebServer() {
    const app = express();
    const port = portConfig.portWebServer;

    app.use(express.static("../../../public"));
    app.engine(
        'hbs',
        engine({
            extname: '.hbs',
            helpers: require('./helpers/handlebars'),
        }),
    );
    app.set('view engine', 'hbs');
    app.set('views', '../../../resources/WebServer/views');

    app.get('/', (req, res) => {
        res.render('home');
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}