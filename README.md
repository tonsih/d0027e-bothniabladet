# Bothniabladet (D0027E - Examination Assignment)

This repository contains the code and resources for the Bothniabladet project 
developed as part of the D0027E course. The project, named "Bothniabladet" is 
developed for a fictional company of the same name and incorporates an image 
management system with e-commerce functionality and includes a plethora of 
features such as user login and registration, image uploading, order creation, 
extraction and display of image metadata, image requests, and much more.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js: The project requires Node.js version 18.16.0 LTS or higher. You can 
download and install the latest LTS version of Node.js from the official 
Node.js website: [https://nodejs.org](https://nodejs.org). This will also 
install npm (Node Package Manager) along with Node.js.

## Development Environment Setup

To set up the development environment for this project, follow these 
instructions:

1. Navigate to the project directory.

2. Create an `.env` file in the project root directory and provide the 
necessary configuration variables. Refer to the `.env.example` file for the 
required variables and their format.

3. Run the "[install_dev_deps.sh](install_dev_deps.sh)" script to install the required dependencies:
    ```shell
    ./install_dev_deps.sh
    ```

4. ***Alternative to step 3.***  
Run the following command to install the required dependencies:

    ```shell
    npm i && cd client && npm i && cd ..
    ```

    or

    ```shell
    npm install && cd client && npm install && cd ..
    ```


5. Once the dependencies are installed and the `.env` file is configured, start 
the development servers by running the following command:

    ```shell
    npm run dev
    ```

   This command will start the backend server and the client server 
   simultaneously, running them in parallel.

   By default, the client server is configured to run on `http://localhost:3000`.

6. You should now have the development environment up and running. Access the 
application by opening your web browser and visiting `http://localhost:3000`.

Note: The SQL file "[db.sql](server/configs/db.sql)" for the MySQL database is 
included in the repository at `server/configs/db/db.sql`. This file contains the 
necessary SQL statements for setting up the MySQL database schema and initial 
data. 

### Development Environment Setup Demonstration
![development-environment-setup-preview](assets/d0027e-development_environment_setup.gif)
