# MYOS Coding Assignment

**Developer Name: Arif Fikri Abas**

## Solution Overview

In order to address this challenge, I have used **Node.js** with **Typescript** as the primary programming language and **npm** as the project build tool. (Dependency management and etc.)

Node.js: 12.19.0

NPM: 6.14.8

## How to run the project

Go to the project directory.

```bash
npm install
npm run start
```

## How to connect to DB

The project is setup to connect to MySQL in Google Cloud Platform

In order to have your local machine connected, Kindly share with me (arif.fikri@outlook.com) your public IP to be whitelisted

Once your IP is whitelisted, you will be able to connect to DB and explore the data

## Creating your own DB

I have provided DB dump in this repo in case you want to create and run your own MySQL

Refer to : dbdump/myos-ecommerce.dump

Please update `.env` file with the appropriate value of locally running MySQL

### How to run unit tests

```bash
npm test
```

## Postman collection

Refer to file **postman/MYOS-ArifFikri.postman_collection.json** to use with Postman for testing

Import collection into postman

Use 2 endpoints available

- GET /product
- POST /checkout
