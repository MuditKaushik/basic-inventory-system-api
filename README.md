# basic-inventory-system
consist basic operation of inventory system.

# System and Tools Using
1. Editor using is VS Code.
2. OS is Windows 10.

# Technology Stack
1. Node v11.6.0
2. Node.js and express.js.
3. Database is MSSQL.
4. Sequelize ORM to create and seed DB.
5. Rxjs

# Steps to create and seed Database
1. Goto the path `api/inventory-db/config` and create copy of file `config.json.template` and rename that to `config.json`.
1. Goto the path `api/inventory-db/` in terminal window.
2. Run `npx sequelize-cli db:create` to create database.
3. Run `npx sequelize-cli db:migrate` to run migrations.
4. Run `npx sequelize-cli db:seed:all` to seed you db.