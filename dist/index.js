"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
// create express app
const app = (0, express_1.default)();
// мидлварь - ф-ция, к-рая умеет внутри себя обрабатывать реквесты и респонсы.
// получаем мидлварь.
const corsMiddleware = (0, cors_1.default)();
app.use(corsMiddleware);
// app.use (cors()) - в оригинале
// получаем мидлварь
const jsonBodyMiddleware = body_parser_1.default.json();
// этот мидлварь засовываем сюда:
app.use(jsonBodyMiddleware);
// app.use(bodyParser.json()) - в оригинале
const port = 5001;
let bloggers = [
    { id: 1, name: "Dimych", youtubeUrl: "https://www.youtube.com/c/ITKAMASUTRA/videos" },
    { id: 2, name: "Lenko", youtubeUrl: "https://www.youtube.com/channel/UCkgXcNSMktRtfMiv64Pxo5g/videos" },
    { id: 3, name: "Humberman", youtubeUrl: "https://www.youtube.com/c/AndrewHubermanLab/videos" },
    { id: 4, name: "Goblin", youtubeUrl: "https://www.youtube.com/c/DmitryPuchkov/videos" },
    { id: 5, name: "Yamshchikov", youtubeUrl: "https://www.youtube.com/channel/UCQMteJvING2dzFIFbBYdipw/videos" }
];
let posts = [
    {
        id: 1,
        title: 'Back video',
        shortDescription: 'New video about back',
        content: 'Some content1',
        bloggerId: 1,
        bloggerName: 'Dimych'
    },
    {
        id: 2,
        title: 'Some awesome video',
        shortDescription: "New awesome video",
        content: 'Some content2',
        bloggerId: 2,
        bloggerName: 'Lenko'
    },
    {
        id: 3,
        title: 'Health video',
        shortDescription: 'New video about health',
        content: 'Some content3',
        bloggerId: 3,
        bloggerName: 'Huberman'
    },
    {
        id: 4,
        title: 'History video',
        shortDescription: 'New video about history',
        content: 'Some content4',
        bloggerId: 4,
        bloggerName: 'Goblin'
    },
    {
        id: 5,
        title: 'AI video',
        shortDescription: 'New AI video',
        content: 'Some content5',
        bloggerId: 5,
        bloggerName: 'Yamshchikov'
    }
];
app.get('/', (req, res) => {
    res.send('ping');
});
app.get('/hs_01/api/bloggers', (req, res) => {
    res.send(bloggers);
});
app.post('/hs_01/api/bloggers', (req, res) => {
    /*
    * В теле реквеста передаю req.body.name, req.body.youtubeUrl.
    * В ф-ции нужно сгенерить id, либо найти последний id.
    * Создать объект с новым видео, куда запилить данные из тела запроса + сгенеренный айди
    * Запушить новый объект в уже существующий массив с объектами.
    * Сделать все проверки.
    * Список проверок:
    * 1. Имя не пустое.
    * 2. Имя < 15 символов.
    * 3. Имя - строка.
    * 4. Линка не пустая.
    * 5. Линка соответствует паттерну.
    * 6. Может, еще проверки нужны, спросить ТП.
    * 7.
    */
    const errors = [];
    const reg = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    console.log(req.body.name);
    console.log(typeof req.body.name);
    if (typeof req.body.name !== "string") {
        const error = {
            message: "Name should be the string",
            field: "name"
        };
        errors.push(error);
    }
    else {
        if (!req.body.name.trim()) {
            const error = {
                message: "Type error: the field is empty",
                field: "name"
            };
            errors.push(error);
        }
        if (req.body.name.length > 15) {
            const error = {
                message: "Yor name should be less than 15 symbols",
                field: "name"
            };
            errors.push(error);
        }
        //const test =  reg.test(req.body.youtubeUrl)
        if (!reg.test(req.body.youtubeUrl)) {
            console.log('if');
            const error = {
                message: "Error type: the field is not a valid url",
                field: "youtubeUrl"
            };
            errors.push(error);
        }
        else {
            console.log('else', req.body.youtubeUrl.length);
            if (!req.body.youtubeUrl.trim()) {
                const error = {
                    message: "Error type: the field is empty",
                    field: "youtubeUrl"
                };
                errors.push(error);
            }
            if (req.body.youtubeUrl.length > 100) {
                console.log('url err');
                const error = {
                    message: "Error type: the field is empty",
                    field: "youtubeUrl"
                };
                errors.push(error);
            }
        }
        /*
        * Если ошибка юзера - 201. result code 1, ты ошибся.
        *
        * */
    }
    console.log(errors);
    if (errors.length !== 0) {
        const responseObj = {
            errorsMessages: errors,
            resultCode: 400
        };
        res.status(400).send(responseObj);
    }
    else {
        const body = req.body;
        const newBlogger = {
            id: getLastId(bloggers) + 1,
            name: body.name,
            youtubeUrl: body.youtubeUrl
        };
        bloggers.push(newBlogger);
        res.status(201);
        res.send(newBlogger);
    }
});
app.get('/hs_01/api/bloggers/:id', (req, res) => {
    /*
    * id вытаскиваем из параметров.
    * Ищем в массиве по айдишке то видео, которое равно айдишке.
    * Выводим видео.
    * Сделать проверку на непустой айдишник.
    * Проверку на айдишни - намбер.
    * */
    const errors = [];
    const id = parseInt(req.params.id);
    const blogger = bloggers.find(bl => bl.id === id);
    if (!id) {
        const error = {
            message: "Error type: You have no id",
            field: "id"
        };
        errors.push(error);
    }
    if (Number.isNaN(id)) {
        const error = {
            message: "Error type: Your id is not a number",
            field: "id"
        };
        errors.push(error);
    }
    if (!blogger) {
        const error = {
            message: "Error type: Your id is out of range",
            field: "id"
        };
        errors.push(error);
    }
    if (errors.length !== 0) {
        const responseObject = {
            errorsMessages: errors,
            resultCode: 404
        };
        res.status(404).send(responseObject);
    }
    else {
        const blogger = bloggers.find(bl => bl.id === id);
        res.status(201);
        res.send(blogger);
    }
});
app.put('/hs_01/api/bloggers/:id', (req, res) => {
    /*
    * Найти по айдишнику блогера в массиве.
    * Запушить обновленные данные в найденный объект.
    * -------------
    * Проверки:
    * Айдишка не пустая.
    * Айдишка - намбер.
    * Айдишка в пределах скоупа.
    * -------
    * Нэйм не пустое.
    * Нэйм - строка.
    * Нэйм до 15 символов.
    * -----------
    * УРЛ не пустой.
    * УРЛ - строка.
    * УРЛ - проверка регэкспа.
    * УРЛ - до 100 символов.
    *----------
    * Проверка, пустой ли массив с ошибками.
    * Запилить элс.
    */
    /*
    * Вопрос ТП: как работает это: const blogger = bloggers.find(bl => bl.id === id)
    * Т.е. в случае тру - в переменной будет объект, в фолс - фолс.
    * Может, правильно и блогеру вставить тип или так не делают?
    * const blogger: BloggerViewModelType = bloggers.find( bl => bl.id === id)
* */
    const errors = [];
    const id = parseInt(req.params.id);
    const blogger = bloggers.find(bl => bl.id === id);
    const reg = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    if (!id) {
        const error = {
            message: "Error Type: You have no id",
            field: "id"
        };
        errors.push(error);
    }
    console.log('id', id);
    if (Number.isNaN(id)) {
        const error = {
            message: "Error Type: id is not a number",
            field: "id"
        };
        errors.push(error);
    }
    if (!req.body.name) {
        const error = {
            message: "Error Type: You should define your name",
            field: "name"
        };
        errors.push(error);
    }
    if (typeof req.body.name !== "string") {
        const error = {
            message: "Error Type: Your name should be a string type",
            field: "name"
        };
        errors.push(error);
    }
    if (req.body.name.length > 15) {
        console.log(req.body);
        const error = {
            message: "Error Type: You should enter the name less than 15 symbols",
            field: "name"
        };
        errors.push(error);
    }
    console.log(req.body.youtubeUrl);
    if (!req.body.youtubeUrl) {
        const error = {
            message: "Error Type: You should specify your link",
            field: "youtubeUrl"
        };
        errors.push(error);
    }
    console.log(req.body.youtubeUrl);
    console.log(req.body.youtubeUrl);
    if (req.body.youtubeUrl.length > 100) {
        const error = {
            message: "Error Type: Your link should be less than 100 symbols",
            field: "youtubeUrl"
        };
        errors.push(error);
    }
    if (typeof req.body.youtubeUrl !== "string") {
        const error = {
            message: "Error Type: Your link should be a string",
            field: "youtubeUrl"
        };
        errors.push(error);
    }
    if (!reg.test(req.body.youtubeUrl)) {
        const error = {
            message: "Error Type: You should specify valid url",
            field: "youtubeUrl"
        };
        errors.push(error);
    }
    if (!blogger) {
        const error = {
            message: "Error Type: Your id is out of range",
            field: "id"
        };
        errors.push(error);
    }
    if (errors.length !== 0 || !blogger) {
        const responseObj = {
            errorsMessages: errors,
            resultCode: blogger ? 400 : 404
        };
        res.send(responseObj);
    }
    else {
        const body = req.body;
        blogger.name = body.name;
        res.send(204);
    }
});
app.delete('/hs_01/api/bloggers/:id', (req, res) => {
    /*
    * Создать переменную для массива ошибок.
    * Создать переменную блогера, в которую запихнуть поиск блогера по айдишке.
    * Удалить по айдишке - т.е. применить метод фильтр к массиву, где указать,
    * что пропустить все айдишки, которые не равны нашей айдишке из реквеста.
    * Проверить массив с ошибками на наличие ошибок
    * Проверки:
    * Айдишка не пустая.
    * Айдишка - намбер.
    * Айдишка в пределах скоупа.
    *
    * */
    const errors = [];
    const id = parseInt(req.params.id);
    const blogger = bloggers.find(bl => bl.id === id);
    if (!id) {
        const error = {
            message: "Error Type: You should specify the id",
            field: "id"
        };
        errors.push(error);
    }
    // Кмк, эта проверка не нужна, т.к. выше мы из айдишки делаем намбер.
    if (Number.isNaN(req.params.id)) {
        const error = {
            message: "Error Type: Your id should be a number",
            field: "id"
        };
        errors.push(error);
    }
    if (!blogger) {
        const error = {
            message: "Error Type: Your id is out of range",
            field: "id"
        };
        errors.push(error);
    }
    if (errors.length !== 0 || !blogger) {
        const responseObj = {
            errorsMessages: errors,
            resultCode: !blogger ? 400 : 404
        };
        res.send(responseObj);
    }
    else {
        bloggers = bloggers.filter(bl => bl.id === id);
        res.send(204);
    }
});
app.get('/hs_01/api/posts', (req, res) => {
    res.send(posts);
});
app.post('/hs_01/api/posts', (req, res) => {
    /*
    * Создать массив для ошибок.
    * Заюзать самодельную ф-цию поиска последнего элемента.
    * Втулить после него новый объект.
    * Вывести новый объект.
    * Сделать проверки.
    * Айди генерится самостоятельно.
    * Проверить, есть ли в массиве ошибок ошибки
    * ----------
    * Тайтл не пустой, с тримом().
    * Тайтл - строка.
    * Тайтл не больше 30.
    * ------------
    * Короткое описание не пустое.
    * Описание - строка.
    * Описание не больше 100.
    * ----------------
    * Контент не пустой.
    * Контент - строка.
    * Контент не больше 1000.
    * ---------------
    * БлогерАйди не пустой.
    * БлогерАйди - намбер.
    * Он вообще делается тут или как-то должен внутри программы связываться с тем, что есть?
    * -------------------------------
    * БлогерНэйм не пустой.
    * БлогерНэйм - строка.
    * БлогерНэйм -
    * */
    const errors = [];
    if (!req.body.title.trim()) {
        const error = {
            message: "Error Type: You should specify the title",
            field: "title"
        };
        errors.push(error);
    }
    if (typeof req.body.title !== "string") {
        const error = {
            message: "Error Type: Your title should by type string",
            field: "string"
        };
        errors.push(error);
    }
    if (req.body.title.length > 30) {
        const error = {
            message: "Error Type: Your title should be less than 30 symbols",
            field: "title"
        };
        errors.push(error);
    }
    if (!req.body.shortDescription.trim()) {
        const error = {
            message: "Error Type: You should specify the short description",
            field: "shortDescription"
        };
        errors.push(error);
    }
    if (typeof req.body.shortDescription !== "string") {
        const error = {
            message: "Error Type: Your input should be the string type",
            field: "shortDescription"
        };
        errors.push(error);
    }
    if (req.body.shortDescription.length > 100) {
        const error = {
            message: "Error Type: You should enter less than 100 symobls",
            field: "shortDescription"
        };
        errors.push(error);
    }
    if (!req.body.content) {
        const error = {
            message: "Error Type: Your content is empty",
            field: "content"
        };
        errors.push(error);
    }
    if (typeof req.body.content !== "string") {
        const error = {
            message: "Error Type: Your content should be type string",
            field: "content"
        };
        errors.push(error);
    }
    if (!req.body.bloggerId) {
        const error = {
            message: "Error Type: You have empty id",
            field: "bloggerId"
        };
        errors.push(error);
    }
    if (typeof req.body.bloggerId !== "number") {
        const error = {
            message: "Error Type: You should enter a number",
            field: "bloggerId"
        };
        errors.push(error);
    }
    if (req.body.content.length > 1000) {
        const error = {
            message: "Error Type: Your content should be less than 1000 symbols",
            field: "content"
        };
        errors.push(error);
    }
    if (errors.length !== 0) {
        const responseObj = {
            errorsMessages: errors,
            resultCode: 404
        };
        res.send(responseObj);
    }
    else {
        const body = req.body;
        const post = {
            id: getLastPostsId(posts) + 1,
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            bloggerId: body.bloggerId,
            bloggerName: "Ask why in postInput is not specified at swagger"
        };
        res.send(post);
    }
});
app.get('/hs_01/api/posts/:id', (req, res) => {
    /*
    * Сделать массив для ошибок.
    * Объявить айдишку, присвоить ей значение из реквест.айди, сделать намбером.
    * Сделать post, запилить туда поиск по массиву нужной айдишки
    * Проверки.
    * Айди не пустой.
    * Айди в пределах скоупа.
    * Айди - намбер.
    * Проверить массив с ошибками на наличие ошибок.
    * Если ок - вернуть 200 и сам объект
    *
    * */
    const errors = [];
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    if (!id) {
        const error = {
            message: "Error Type: You should specify some id",
            field: "id"
        };
        errors.push(error);
    }
    if (!post) {
        const error = {
            message: "Error Type: Your id is out of range",
            field: "id"
        };
        errors.push(error);
    }
    if (errors.length !== 0 || !post) {
        const responseObj = {
            errorsMessages: errors,
            resultCode: 404
        };
        res.send(responseObj);
    }
    else {
        res.status(200).send(post);
    }
});
app.put('/hs_01/api/posts/:id', (req, res) => {
    /*
    * Создать массив с ошибками.
    * Айдишник сделать намбером.
    * Сделать пост, в массиве постов проверить, не выходит ли он за границы скоупа.
    * Проверки:
    * Айди существует.
    * Айди не за пределами скоупа
    * ------------------------------
    * Тайтл не пустой.
    * Тайтл - строка.
    * Тайтл не больше 30 символов.
    * -----------------
    * Кор. описание не пустое.
    * Кор. описание - строка.
    * Кор. описание не больше 100 символов.
    * ---------------------
    * Контент не пустой.
    * Контент - строка.
    * Конт не больше 1000 символов.
    * -------------
    * БлогерАади не пустой.
    * БлогерАйди - намбер.
    * ----------
    * Проверить массив с ошибками на наличие ошибок.
    * Присвоить определенным полям объекта Пост новые значения
    * */
    const errors = [];
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    if (!id) {
        const error = {
            message: "Error Type: You should specify the id",
            field: "id"
        };
        errors.push(error);
    }
    if (!post) {
        const error = {
            message: "Error Type: Your id is out of range",
            field: "id"
        };
        errors.push(error);
    }
    if (!req.body.title) {
        const error = {
            message: "Error Type: Your should specify the title",
            field: "title"
        };
        errors.push(error);
    }
    if (typeof req.body.title !== "string") {
        const error = {
            message: "Error Type: Your title should be string type",
            field: "title"
        };
        errors.push(error);
    }
    if (req.body.title.length > 30) {
        const error = {
            message: "Error Type: Your title should be less than 30 symbols",
            field: "title"
        };
        errors.push(error);
    }
    if (!req.body.shortDescription) {
        const error = {
            message: "Error Type: You should specify the short descripiton",
            field: "shortDescription"
        };
        errors.push(error);
    }
    if (typeof req.body.shortDescription !== "string") {
        const error = {
            message: "Error Type: your short description should be string type",
            field: "shortDescription"
        };
        errors.push(error);
    }
    if (req.body.shortDescription.length > 100) {
        const error = {
            message: "Error Type: Your short description should be less than 100",
            field: "shortDescription"
        };
        errors.push(error);
    }
    if (!req.body.content) {
        const error = {
            message: "Error Type: You should specify the content",
            field: "content"
        };
        errors.push(error);
    }
    if (typeof req.body.content) {
        const error = {
            message: "Error Type: Your content should be the string",
            field: "content"
        };
        errors.push(error);
    }
    if (req.body.content.length > 1000) {
        const error = {
            message: "Error Type: Your content should be less than 1000 symbols",
            field: "content"
        };
        errors.push(error);
    }
    if (!req.body.bloggerId) {
        const error = {
            message: "Error Type: You should specify blogger Id",
            field: "bloggerId"
        };
        errors.push(error);
    }
    if (typeof req.body.bloggerId !== "number") {
        const error = {
            message: "Error Type: Your blogger Id should be the number",
            field: "bloggerId"
        };
        errors.push(error);
    }
    if (errors.length !== 0 || !post) {
        const responseObj = {
            errorsMessages: errors,
            resultCode: !post ? 400 : 404
        };
        res.send(responseObj);
    }
    else {
        const body = req.body;
        post.title = body.title;
        post.shortDescription = body.shortDescription;
        post.content = body.content;
        post.bloggerId = body.bloggerId;
        res.send(204);
    }
});
app.delete('/hs_01/api/posts/:id', (req, res) => {
    /*
    * Сделать массив для ошибок.
    * Сделать айдишку, сделать ее намбером.
    * Сделать пост, найти файндом, находится ли он в скоупе
    * Проверки:
    * Айдишка существует.
    * Айдишка в пределах скоупа.
    * Сделать новый массив, запилить туда отфильтрованный массив.
    *
    * */
    const errors = [];
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    if (!id) {
        const error = {
            message: "Error Type: You should specify the Id",
            field: "id"
        };
        errors.push(error);
    }
    if (!post) {
        const error = {
            message: "Error Type: Your Id is out of range",
            field: "id"
        };
        errors.push(error);
    }
    if (errors.length !== 0 || !post) {
        const responseObj = {
            errorsMessages: errors,
            resultCode: !post ? 400 : 404
        };
        res.send(responseObj);
    }
    else {
        posts = posts.filter(p => p.id !== id);
        res.status(204);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
function getLastId(bloggersArrayAkaDataFromDB) {
    let lastIndex = 0;
    bloggersArrayAkaDataFromDB.forEach(el => {
        if (el.id > lastIndex) {
            lastIndex = el.id;
        }
    });
    return lastIndex;
}
function getLastPostsId(postsArray) {
    let lastIndex = 0;
    postsArray.forEach(el => {
        if (el.id > lastIndex) {
            lastIndex = el.id;
        }
    });
    return lastIndex;
}
//# sourceMappingURL=index.js.map