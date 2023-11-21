<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Тестовое задание](https://outline.42px.org/s/1af645e0-35bc-4f7d-83f6-f6e85cea9051) написано с использованием техологий:

[Docker](https://www.docker.com/),
[Nestjs](https://docs.nestjs.com/),
[TypeScript](https://www.typescriptlang.org/),
[TypeOrm](https://typeorm.io/). 

## Installation

```bash
$ docker-compose up -d --build
```
На основе `.env.dist` нужно создать `.env` с такими тестовыми данными:

```bash
POSTGRES_PASSWORD=postgres
POSTGRES_USERNAME=postgres
POSTGRES_DATABASE=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432

PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=pgadmin4
```
Проект доступен по урл `http://localhost:4040` <br/>
Админ БД доступен по урл `http://localhost:5050` <br/>

## Configuring Postgres DB

1. In the left-hand sidebar, click `Servers` to expand the `Servers` menu.
2. Right-click on `Servers` and select `Register -> Server`.
3. In the `Genera`l tab of the `Create - Server` dialog, we can give the server a name of our choice.
4. In the `Connection tab`, fill in the following details:

```bash
Host name/address: db
Port: 5432
Maintenance database: postgres
Username: postgres
Password: postgres
```

## Filling the database

Необходимо заполнить таблицу `user` тестовыми данными (2-3 записи будет вполне достаточно).

## API urls

`/api` - общий поддомен для всей АПИ 

У всех запросов типа `/invoice` обязательный заголовок:
```
X-User-Id: 1
```

`POST /api/invoice` - создание счета
```
Content-Type: application/json

{
  "name": "test name",
  "location": "test location"
}
```

`GET /api/invoice?page=1&pageSize=20` - вывод всех счетов пользователя для ИД `X-User-Id` <br/>
Query параметры `page` и `pageSize` добавлены для пагинации и не обязательны.

`GET /api/invoice/1` - вывод счета с ИД 1

`DELETE /api/invoice/1` - удаление счета с ИД 1

`PATCH /api/invoice/1` - редактирование счета с ИД 1, переименование его
```
Content-Type: application/json

{
  "name": "test name 2"
}
``` 

`POST /api/transfer` - перевод крон с одного счета на другой
```
Content-Type: application/json
X-User-Id: 1

{
  "senderInvoiceId": 1,
  "receiverInvoiceId": 2,
  "amount": 10
}
```

`POST /api/transfer/replenish` - пополнение счета на 5000 крон реальными деньгами 
```
Content-Type: application/json

{
  "password": "123456",
  "invoiceId": 1
}
```

## Remarks

Я не сделал все так, как хотел из-за нехватки времени. <br/>
- Например, я бы вынес все связанное с переводами между счетами в другой сервис.
- Я для переводов использовал транзакции для работы с БД.
В принципе, и для функционала создания/вывода/апдейта счетов тоже в некоторых местах лучше было бы также
использовать транзакции.
- пароль для запроса пополнения я бы делал с применением библиотеки хэширования паролей `bcrypt` и передавал в запросе его хэш.
Для безопасности. Я понимаю, что это тестовое, поэтому исп. пароль без хэша.

## Stay in touch

- Author - [Yurii Martynovych](https://github.com/tibetan)

