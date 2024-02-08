# BobApp

Clone project:

> git clone XXXXX

## Front-end

Go inside folder the front folder:

> cd front

Install dependencies:

> npm install

Launch Front-end:

> npm run start;

## Back-end

Go inside folder the back folder:

> cd back

Install dependencies:

> mvn clean install

Launch Back-end:

>  mvn spring-boot:run

Launch the tests:

> mvn clean install


## Docker Deployment

Create a network for the app :

> docker network create bobapp_ntwk

### Back-end

Go inside folder the back folder:

> cd back

Build the Back-end container:

> docker build -t bobapp-back .

Start the container:

> docker run --network bobapp_ntwk -p 8080:8080 --name bobapp-back -d bobapp-back

### Front-end

Go inside folder the front folder:

> cd front

Build the container:

> docker build -t bobapp-front .

Start the container:

> docker run --network bobapp_ntwk -p 4200:80 --name bobapp-front -d bobapp-front