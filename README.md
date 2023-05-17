# Bothniabladet (D0027E - Examination Assignment)

This repository contains the code and resources for the Bothniabladet project 
developed as part of the D0027E course. The project, named 'Bothniabladet' is 
developed for a fictional company of the same name. It encompasses an image 
management system with e-commerce functionality and includes a plethora of 
useful features such as user login and registration, image uploading, order 
creation, extraction and display of image metadata, image requests, and much 
more.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js: The project requires Node.js version 18.16.0 LTS or higher. You can 
download and install the latest LTS version of Node.js from the official 
Node.js website: [https://nodejs.org](https://nodejs.org). This will also 
install npm (Node Package Manager) along with Node.js.

## Development Environment Setup

To set up the development environment for this project, follow these 
instructions:

1. Open the terminal or command prompt and navigate to the project directory.

2. Run the following command to install the required dependencies:

```shell
npm install
```

or

```shell
npm i
```

3. Create an `.env` file in the project root directory and provide the 
necessary configuration variables. Refer to the `.env.example` file for the 
required variables and their format.

4. Once the dependencies are installed and the `.env` file is configured, start 
the development servers by running the following command:

```shell
npm run dev
```

This command will start the backend server and the client server 
simultaneously, allowing you to work with both parts of the application in 
parallel.

By default, the client server is configured to run on `http://localhost:3000`.

5. You should now have the development environment up and running. Access the 
application by opening your web browser and visiting `http://localhost:3000`.
