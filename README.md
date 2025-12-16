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

### Docker

Build the container:

> docker build -t antoinelm/bobapp-front:latest .  

Start the container:

> docker run -p 80:80 --name bobapp-front -d antoinelm/bobapp-front:latest

## Back-end

Go inside folder the back folder:

> cd back

Install dependencies:

> mvn clean install

Launch Back-end:

>  mvn spring-boot:run

Launch the tests:

> mvn clean install

### Docker

Build the container:

> docker build -t antoinelm/bobapp-back:latest . 

Start the container:

> docker run -p 8080:8080 --name bobapp-back -d antoinelm/bobapp-back:latest
