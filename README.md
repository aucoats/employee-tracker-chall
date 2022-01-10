# Employee Tracker

## Description

Employee tracker used to track departments, roles, and employees. Allows the user to view and interact with database with the command line. Built using Node.js, mysql2, inquirer, dotenv, and console.table. 

## Usage
User must first 

    npm init

at the root of the repo. 
Run 

    npm i mysql2 inquirer dotenv console.table

to install all required npm packages. 
The .env file in the root of the repository will need to be updated with the user's MySQL login credentials. 
Additionally, user must utilize MySQL commands 

    source db/db.sql 

    source db/schema.sql

    source db/seeds.sql 

to create databases that the application can interact with. This is only for demo of the application and seeds.sql can be altered to fit your organization's information. 

Invoke application using 

    node index.js



## Deployed
Demo of deployed app: 

![Deployed](./assets/images/deployed.gif)

With sound: 

![Video Walkthrough](https://drive.google.com/file/d/1_2YnJSwpzR39FllpNr9dytcV0Zc4MIE1/view)
