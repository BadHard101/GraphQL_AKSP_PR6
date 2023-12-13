const express = require('express');
const {graphqlHTTP}=require('express-graphql');
const port = 1234; // номер порта
const schema = require('./schema/schema');
//выполнение серий функций req,res при совпадении корневого пути
const app = express(); // инициализация объекта приложения
app.use(
    '/library',
    graphqlHTTP({
        schema: schema,
        graphiql: true
    }));
app.listen(port); // прослушиваем порт 1234
