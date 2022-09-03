const express = require('express')
const viewRouter = require('./routes/viewRoutes')
const userRouter = require('./routes/userRoutes')
const likeRouter = require('./routes/likeRoutes')
const comenntRouter = require('./routes/commentRoutes')
const postRouter = require('./routes/postRoutes')
const path = require('path')
const cors = require("cors")
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController');


const app = express()

app.use(express.static('./public'))

const corsOptions = {
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.urlencoded({extended: true, limit: '10kb'}))
app.use(cookieParser())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App is running on port ${port}...`)
})

//ROUTES
app.use('/', viewRouter)
app.use('/users', userRouter)
app.use('/like', likeRouter)
app.use('/comment', comenntRouter)
app.use('/post', postRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
