import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'


// create express app
const app = express()

// мидлварь - ф-ция, к-рая умеет внутри себя обрабатывать реквесты и респонсы.
// получаем мидлварь.
const corsMiddleware = cors();
app.use(corsMiddleware)
// app.use (cors()) - в оригинале

// получаем мидлварь
const jsonBodyMiddleware = bodyParser.json()
// этот мидлварь засовываем сюда:
app.use(jsonBodyMiddleware)
// app.use(bodyParser.json()) - в оригинале


const port = process.env.PORT || 5001

let bloggers: BloggerViewModelType[] = [
    /*{id: 1, name: "Dimych", youtubeUrl: "https://www.youtube.com/c/ITKAMASUTRA/videos"},
    {id: 2, name: "Lenko", youtubeUrl: "https://www.youtube.com/channel/UCkgXcNSMktRtfMiv64Pxo5g/videos"},
    {id: 3, name: "Humberman", youtubeUrl: "https://www.youtube.com/c/AndrewHubermanLab/videos"},
    {id: 4, name: "Goblin", youtubeUrl: "https://www.youtube.com/c/DmitryPuchkov/videos"},
    {id: 5, name: "Yamshchikov", youtubeUrl: "https://www.youtube.com/channel/UCQMteJvING2dzFIFbBYdipw/videos"}*/
]

let posts: PostViewModelType[] = [
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
]

const errorsCollect = (errors: FieldErrorType[], message: string, field: string) => {
    const error: FieldErrorType = {
        message: message,
        field: field
    }
    errors.push(error)
}

const errorResponse = (res: Response, errorsMessages: FieldErrorType[], resultCode: number) => {
    const responseObj: APIErrorResultType = {
        errorsMessages: errorsMessages,
        resultCode: resultCode
    }
    res.status(400).send(responseObj)
}


app.get('/', (req: Request, res: Response) => {
    res.send('ping')
})

app.get('/bloggers', (req: Request, res: Response) => {
    res.status(200).send(bloggers)
})

app.post('/bloggers', (req: Request, res: Response) => {
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
    const errors: FieldErrorType[] = []
    const reg = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?")
    /*    console.log(req.body.name)
        console.log(typeof req.body.name)*/

// -------------- Проверка имени --------------------------

    if (typeof req.body.name !== "string") {
        console.log(req.body.name)
        errorsCollect(errors, "Error Type: Name should be the string", "name")
    } else {
        if (!req.body.name.trim()) {
            errorsCollect(errors, "Error Type: the field is empty", "name")
        }
        if (req.body.name.length > 15) {
            errorsCollect(errors, "Error Type: Yor name should be less than 15 symbols", "name")
        }
        // ------------ Проверка урла --------------------------------------
    }
    //const test =  reg.test(req.body.youtubeUrl)
    if (!reg.test(req.body.youtubeUrl)) {
        errorsCollect(errors, "Error Type: your Url is empty or not valid", "youtubeUrl")
    } else {
        //console.log('else', req.body.youtubeUrl.length)
        if (!req.body.youtubeUrl.trim()) {
            errorsCollect(errors, "Error type: the field is empty", "youtubeUrl")
        }
        if (req.body.youtubeUrl.length > 100) {
            //console.log('url err')
            errorsCollect(errors, "Error type: the field should be less than 100 symbols", "youtubeUrl")
        }
        /*
        * Если ошибка юзера - 201. result code 1, ты ошибся.
        *
        * */
    }
    if (errors.length !== 0) {
        errorResponse(res, errors, 1)
    } else {
        const body: BloggerInputModelType = req.body
        const newBlogger: BloggerViewModelType = {
            id: getLastId(bloggers) + 1,
            name: body.name,
            youtubeUrl: body.youtubeUrl
        }
        bloggers.push(newBlogger)
        res.status(201)
        res.send(newBlogger)
    }
})

app.get('/bloggers/:id', (req: Request, res: Response) => {
    /*
    * id вытаскиваем из параметров.
    * Ищем в массиве по айдишке то видео, которое равно айдишке.
    * Выводим видео.
    * Сделать проверку на непустой айдишник.
    * Проверку на айдишни - намбер.
    * */
    const errors: FieldErrorType[] = []
    const id = parseInt(req.params.id)
    const blogger = bloggers.find(bl => bl.id === id)
    if (!id) {
        errorsCollect(errors, "Error type: You have no id", "id")
        res.send(400)
    }
    /*    if (Number.isNaN(id)) {
            const error: FieldErrorType = {
                message: "Error type: Your id is not a number",
                field: "id"
            }
            errors.push(error)
        }*/
    if (!blogger) {
        errorsCollect(errors, "Error type: Your id is out of range", "id")
    }
    if (errors.length !== 0) {
        errorResponse(res, errors, 404)
    } else {
        //const blogger = bloggers.find(bl => bl.id === id)
        res.status(200)
        res.send(blogger)
    }
})

app.put('/bloggers/:id', (req: Request, res: Response) => {
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
    const errors: FieldErrorType[] = []
    const id = parseInt(req.params.id)
    const blogger = bloggers.find(bl => bl.id === id)
    const reg = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?")
    if (!id) {
        errorsCollect(errors, "Error Type: You have no id", "id")
    }
    console.log('id', id)
    /*    if (Number.isNaN(id)) {
            const error: FieldErrorType = {
                message: "Error Type: id is not a number",
                field: "id"
            }
            errors.push(error)
        }*/

// ----------------------------------------- Проверка name ------------------------------------------------
    if (typeof req.body.name !== "string") {
        errorsCollect(errors, "Error Type: Your name should be a string type", "name")
    } else {
        if (!req.body.name.trim()) {
            errorsCollect(errors, "Error Type: You should define your name", "name")
        }
        if (req.body.name.length > 15) {
            errorsCollect(errors, "Error Type: You should enter the name less than 15 symbols", "name")
        }
    }
//    console.log(req.body.youtubeUrl)
// -------------------------------------- Проверка youtubeUrl --------------------------------------------
    if (typeof req.body.youtubeUrl !== "string") {
        errorsCollect(errors, "Error Type: Your link should be a string", "youtubeUrl")
    } else {
        if (!req.body.youtubeUrl) {
            errorsCollect(errors, "Error Type: You should specify your link", "youtubeUrl")
        }
        console.log(req.body.youtubeUrl)
        if (req.body.youtubeUrl.length > 100) {
            errorsCollect(errors, "Error Type: Your link should be less than 100 symbols", "youtubeUrl")
        }
        if (!reg.test(req.body.youtubeUrl)) {
            errorsCollect(errors, "Error Type: You should specify valid url", "youtubeUrl")
        }
    }
    if (errors.length !== 0) {
        errorResponse(res, errors, 1)
    }
    if (!blogger) {
        errorsCollect(errors, "Error Type: Your id is out of range", "id")
        errorResponse(res, errors, 404)
    }

    /*    if (errors.length !== 0 || !blogger) {
            const responseObj: APIErrorResultType = {
                errorsMessages: errors,
                resultCode: blogger ? 400 : 404
            }
            res.send(responseObj)
        }*/

    else {
        const body: BloggerInputModelType = req.body
        blogger.name = body.name
        blogger.youtubeUrl = body.youtubeUrl
        res.send(204)
    }
})

app.delete('/bloggers/:id', (req: Request, res: Response) => {
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
    const errors: FieldErrorType[] = []
    const id = parseInt(req.params.id)
    const blogger = bloggers.find(bl => bl.id === id)
    if (!id) {
        errorsCollect(errors, "Error Type: You should specify the id", "id")
    }
    /*    // Кмк, эта проверка не нужна, т.к. выше мы из айдишки делаем намбер.
        if (Number.isNaN(req.params.id)) {
            const error: FieldErrorType = {
                message: "Error Type: Your id should be a number",
                field: "id"
            }
            errors.push(error)
        }*/
    if (!blogger) {
       // errorsCollect(errors, "Error Type: Your id is out of range", "id")
        errorResponse(res, errors, 404)
    }
    if (errors.length !== 0) {
        errorResponse(res, errors, 400)
    }
    /*  if (errors.length !== 0 || !blogger) {
          const responseObj: APIErrorResultType = {
              errorsMessages: errors,
              resultCode: !blogger ? 400 : 404
          }
          res.send(responseObj)
      } */

    else {
        bloggers = bloggers.filter(bl => bl.id === id)
        res.status(204).send()
    }
})

app.get('/posts', (req: Request, res: Response) => {
    res.status(200).send(posts)
})

app.post('/posts', (req: Request, res: Response) => {
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
    const errors: FieldErrorType[] = []
// ------------------------------------------------ Проеврка тайтла ------------------------------------------------
    if (typeof req.body.title !== "string") {
        errorsCollect(errors, "Error Type: Your title should by type string", "string")
    } else {
        if (!req.body.title.trim()) {
            errorsCollect(errors, "Error Type: You should specify the title", "title")
        }

        if (req.body.title.length > 30) {
            errorsCollect(errors, "Error Type: Your title should be less than 30 symbols", "title")
        }
    }
// ---------------------------------------- Проверка короткого описания ---------------------------------------------
    if (typeof req.body.shortDescription !== "string") {
        errorsCollect(errors, "Error Type: Your input should be the string type", "shortDescription")
    } else {
        if (!req.body.shortDescription.trim()) {
            errorsCollect(errors, "Error Type: You should specify the short description", "shortDescription")
        }

        if (req.body.shortDescription.length > 100) {
            errorsCollect(errors, "Error Type: You should enter less than 100 symobls", "shortDescription")
        }
    }
// ------------------------------------------- Проверка контента -----------------------------------------------------
    if (typeof req.body.content !== "string") {
        errorsCollect(errors, "Error Type: Your content should be type string", "content")
    } else {
        if (!req.body.content.trim()) {
            errorsCollect(errors, "Error Type: Your content is empty", "content")
        }
        if (req.body.content.length > 1000) {
            errorsCollect(errors, "Error Type: Your content should be less than 1000 symbols", "content")
        }
    }
// ------------------------------------------ Проверка BloggerId ------------------------------------------------------

    if (!req.body.bloggerId) {
        errorsCollect(errors, "Error Type: You have empty id", "bloggerId")
    }
    if (typeof req.body.bloggerId !== "number") {
        errorsCollect(errors, "Error Type: You should enter a number", "bloggerId")
    }
    if (errors.length !== 0) {
        errorResponse(res, errors, 1)
    } else {
        const body: PostInputModelType = req.body
        const post: PostViewModelType = {
            id: getLastPostsId(posts) + 1,
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            bloggerId: body.bloggerId,
            bloggerName: "Ask why in postInput is not specified at swagger"
        }
        res.send(post)
    }
})

app.get('/posts/:id', (req: Request, res: Response) => {
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
    const errors: FieldErrorType[] = []
    const id = parseInt(req.params.id)
    const post = posts.find(p => p.id === id)
    if (!id) {
        errorsCollect(errors, "Error Type: You should specify some id", "id")
    }
    if (!post) {
        errorsCollect(errors, "Error Type: Your id is out of range", "id")
        errorResponse(res, errors, 404)
    }
    if (errors.length !== 0) {
        errorResponse(res, errors, 400)
    }
    /*    if (errors.length !== 0 || !post) {
            const responseObj: APIErrorResultType = {
                errorsMessages: errors,
                resultCode: 404
            }
            res.send(responseObj)
        } */
    else {
        res.status(200).send(post)
    }
})

app.put('/posts/:id', (req: Request, res: Response) => {
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
    const errors: FieldErrorType[] = []
    const id = parseInt(req.params.id)
    const post = posts.find(p => p.id === id)
    if (!id) {
        errorsCollect(errors, "Error Type: You should specify the id", "id")
    }
// --------------------------------- Проверка тайтла ---------------------------------------------------------------
    if (typeof req.body.title !== "string") {
        errorsCollect(errors, "Error Type: Your title should be string type", "title")
    } else {
        if (!req.body.title.trim()) {
            errorsCollect(errors, "Error Type: Your should specify the title", "title")
        }
        if (req.body.title.length > 30) {
            errorsCollect(errors, "Error Type: Your title should be less than 30 symbols", "title")
        }
    }
// --------------------------------- Проверка короткого описания ----------------------------------------------------
    if (typeof req.body.shortDescription !== "string") {
        errorsCollect(errors, "Error Type: your short description should be string type", "shortDescription")
    } else {
        if (!req.body.shortDescription.trim()) {
            errorsCollect(errors, "Error Type: You should specify the short descripiton", "shortDescription")
        }
        if (req.body.shortDescription.length > 100) {
            errorsCollect(errors, "Error Type: Your short description should be less than 100", "shortDescription")
        }
    }
// --------------------------------------- Проверка контента ---------------------------------------------------------
    if (typeof req.body.content !== "string") {
        errorsCollect(errors, "Error Type: Your content should be the string", "content")
    } else {
        if (!req.body.content.trim()) {
            errorsCollect(errors, "Error Type: You should specify the content", "content")
        }
        if (req.body.content.length > 1000) {
            errorsCollect(errors, "Error Type: Your content should be less than 1000 symbols", "content")
        }
    }
// -------------------------------------- Проверка bloggerId ---------------------------------------------------------
    if (!req.body.bloggerId) {
        errorsCollect(errors, "Error Type: You should specify blogger Id", "bloggerId")
    }
    if (typeof req.body.bloggerId !== "number") {
        errorsCollect(errors, "Error Type: Your blogger Id should be the number", "bloggerId")
    }
    if (errors.length !== 0) {
        errorResponse(res, errors, 1)
    }
    if (!post) {
        errorsCollect(errors, "Error Type: Your id is out of range", "id")
        errorResponse(res, errors, 404)
    }
    /*    if (errors.length !== 0 || !post) {
            const responseObj: APIErrorResultType = {
                errorsMessages: errors,
                resultCode: !post ? 400 : 404
            }
            res.send(responseObj)
        } */
    else {
        const body: PostInputModelType = req.body
        post.title = body.title;
        post.shortDescription = body.shortDescription;
        post.content = body.content;
        post.bloggerId = body.bloggerId;
        res.send(204)
    }
})

app.delete('/posts/:id', (req: Request, res: Response) => {
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
    const errors: FieldErrorType[] = []
    const id = parseInt(req.params.id)
    const post = posts.find(p => p.id === id)
    if (!id) {
        errorsCollect(errors, "Error Type: You should specify the Id", "id")
    }
    if (!post) {
       // errorsCollect(errors, "Error Type: Your Id is out of range", "id")
        errorResponse(res, errors, 404)
    }
    if (errors.length !== 0) {
        errorResponse(res, errors, 400)
    }
/*    if (errors.length !== 0 || !post) {
        const responseObj: APIErrorResultType = {
            errorsMessages: errors,
            resultCode: !post ? 400 : 404
        }
        res.send(responseObj)
    } */
    else {
        posts = posts.filter(p => p.id !== id)
        res.status(204).send()
    }

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function getLastId(bloggersArrayAkaDataFromDB: BloggerViewModelType[]) {
    let lastIndex = 0;
    bloggersArrayAkaDataFromDB.forEach(el => {
        if (el.id > lastIndex) {
            lastIndex = el.id
        }
    })
    return lastIndex
}

function getLastPostsId(postsArray: PostViewModelType[]) {
    let lastIndex = 0;
    postsArray.forEach(el => {
        if (el.id > lastIndex) {
            lastIndex = el.id
        }
    })
    return lastIndex
}

type BloggerViewModelType = {
    id: number
    name: string
    youtubeUrl: string
}

type APIErrorResultType = {
    errorsMessages: FieldErrorType[]
    resultCode: number
}

type FieldErrorType = {
    message: string
    field: string
}

type BloggerInputModelType = {
    name: string
    youtubeUrl: string
}

type PostViewModelType = {
    id: number
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName: string
}

type PostInputModelType = {
    title: string
    shortDescription: string
    content: string
    bloggerId: number
}