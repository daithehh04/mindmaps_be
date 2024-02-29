# Mindmap Management

This is my personal project called "Mindmap Management". This project is still being developed continously so that I can make a better profile for my CV and improve my technical skills.

The purpose of this application is helps users organize and represent information in an intuitive way, supporting understanding of structure and relationships between elements

## Technologies used

- BackEnd: NodeJS (ExpressJS)
- Database: PostgreSQL (Sequelize)
- Some of packaged used:
  - Jsonwebtoken (Jwt - Create token for authentication)
  - BcryptJs (Create user's password)
  - Nodemailer (Send mail for user forgot password)
  - PassportJs (Support write Api for social)
    - Multer (Local file storages)
    - Cloudinary (Online cloud for saving images and files)

## How to run this project?

- Clone the project

```shell
git clone https://github.com/daithehh04/mindmaps_be.git
```

- Install all available packages

```shell
npm install
```

- Create .env file (Same variables with .sample.env)
- Redirect to the root of application and start the project by using the command (npm start)

```shell
npm start
```

## Result

So far, I have published this project with some available features below:

- Authentication: Sign up, Login, Logout, Renew token
- Mindmap
  - Create / Get / Update / Remove one / Remove all / Restore mindmap
  - Share mindmap by mindmap's link
- User
  - Update user's information
  - Update user's avatar using Multer and Cloudinary
- These are some of main features that I feel very pleased to research and practice
  - Authentication (Using accessToken and refreshToken)
  - RestAPI (Mindmap,...)
  - Upload images and attachments (Using multer and cloudinary)
