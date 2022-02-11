# OOTD. Year2 Full Stack Development Project with Nodejs and Expressjs (Server stopped)
> Each day is a page in your fashion story.

## Overview
Hello everyone. OOTD (Outfit of The Day) is a outfit sharing web platform which encourages people to wear their own style of wearing no matter it is trending or not. OOTD is a practical platform for whose loves clothes matching and fashion, connects people with the same interest on the digital world.
The link to [OOTD](http://10.114.32.122/~julian/ootd-frontend/Frontend/front.html) (Metropolia VPN is required to access the link).

## User stories
- As an app designer, I want to apply technology around people and create a platform for people with the same hobbies and interests, so that we can bring people closer together in the Internet.
- As a fashion lover, I want to have a platform to see more different style of dressing, so that I can exchange ideas about clothes matching with others.
and get inspiration
- As an app admin, I would remove all hate speech, offending and racism content, so that we can keep a healthy and professtional web environment in the application.

## How to OOTD?
- On Front page, you can view the button `Login`, after scrolling effect, you will see the register href attribute and redirect to the register page. You can create an user account with `username`, `email` and `password`.
- On Login homepage, you can view the `navigation bar` (`Home`, `Hightlight`, `Search`, `Post`, `Profile`, `Settings`, `Logout`) on top of site, also the latest posts at the middle of the homepage. Besides, you can give or remove a like from the post by clicking the `heart`. When you click the author username on the post, it will bring you to the profile of the author, and you can see all the posts posted by that user.
- On Upload post, you can upload a post with a outfit `picture`, `category` of outfit and description.
- On profile post, you can view your own profile picture, username, total number of posts, total number of getting liked and your own description. When you click the your profile picture, you can upload/update your profile picture by uploading photos from your device. And when you click the `edit profile` button, you can change your own `username`, `email`, `password` and `description` by input your current `password`. When you click the `setting` button, it is not fully developed, but users can delete their own user account from there.
- On every post, only admin and the owner of the posts can delete the posts. They can see a rubbish bin button on the top right corner of the post.


## Stack
- Frontend: [Code](https://gitlab.metropolia.fi/chungc/ootd-y2p2-project/-/tree/main/Frontend) HTML, CSS for Web UI/UX design. Javascript for changing the DOM and connect with Backend code.
- Backend: [Code](https://gitlab.metropolia.fi/chungc/ootd-y2p2-project/-/tree/main/Backend) Javascript, NodeJS and Express for funcational execution.
- Database: [SQL file](https://gitlab.metropolia.fi/chungc/ootd-y2p2-project/-/blob/main/ootd.sql) SQL on Metropolia phpMyAdmin for data management.

##Backend tools and libraries
- Node.js with Express.js library
- Datbase: mysql2, phpMyAdmin tools
- Password Hashing: bcryptjs package, jsonwebtoken
- Validation: express-validator
- Login authentication: passport-jwt library, passport-local Strategy, JWT Strategy
- Upload image: sharp, multer

## Running Server for database, backend and frontend (Server stopped)
- Please connect to Metropolia VPN
- Database is running on user Metropolia server, (https://users.metropolia.fi/phpMyAdmin/)
- Backend is running on remote EduCloud virtual server, (http://10.114.32.122/), running automatically with `pm2 start app.js`
- Frontend is also running on remote Educloud virtual server, (http://10.114.32.122/~julian/ootd-frontend/Frontend/front.html)

## Installation
1. Clone the repo ([Frontend](https://gitlab.metropolia.fi/chungc/ootd-y2p2-project/-/tree/main/Backend), [Backend](https://gitlab.metropolia.fi/chungc/ootd-y2p2-project/-/tree/main/Frontend)) into 2 different directories in your virtual server machine. If you want to clone [it](https://gitlab.metropolia.fi/chungc/ootd-y2p2-project/-/tree/main) to your local machine, then just git clone the whole repo to Visual Studio Code.
    ```bash
    git clone https://gitlab.metropolia.fi/chungc/ootd-y2p2-project.git
    ```
2. Install dependencies in `Backend` folder
    ```bash
    cd ootd-y2p2-project
    cd Backend
    npm i
    ```
3. Create `.env` file in `Backend` folder and fill in the empty fields with your database info
    ```bash
    DB_HOST=mysql.metropolia.fi
    DB_USER=<your-db-user>
    DB_PASS=<your-db-user_password>
    DB_NAME=<your-db-name>
    JWT_SECRET=secret
    ```
4. The url is different for running on remote server or localhost, please edit the url on every js file in `Frontend` folder
    ```bash
    const url = 'http://localhost:3000';
    ```
    ```bash
    const url = 'http://<your-ip-address>/app';
    ```
5. Run app.js in `Backend` folder
    ```bash
    cd ootd-y2p2-project
    cd Backend
    node app.js
    ```
6. To run app.js on server forever, restart on crash with pm2
    ```bash
    sudo npm install -g pm2
    pm2 start app.js
    ```

## Dependencies
- bcryptjs
- body-parser
- cors
- dotenv
- exif
- express
- express-validator
- http
- jsonwebtoken
- lodash
- multer
- mysql2
- passport
- passport-jwt
- passport-local
- sharp

## Credits
- Chan Chung Yin, Julian (Database, Backend)
- Hoi Chit Yu, Boris (Frontend)


