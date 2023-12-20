# BobApp

Two readme in One:

- Legacy readme
- Readme in progress with CI/CD, but lack of configuration

CI/CD in progress, he need to configure for use you're space.


## Legacy readme

### Front-end 

Go inside folder the front folder:

> cd front

Install dependencies:

> npm install

Launch Front-end:

> npm run start;

#### Docker

Build the container:

> docker build -t bobapp-front .

Start the container:

> docker run -p 8080:8080 --name bobapp-front -d bobapp-front

### Back-end

Go inside folder the back folder:

> cd back

Install dependencies:

> mvn clean install

Launch Back-end:

>  mvn spring-boot:run

The tests:

On github Actions, download and open the artifacts with a browser

#### Docker

The containers are configured on a workflow Github Actions.
Go on it and modify "" for you're own space/account

OPEN Docker desktop and search for your images 
Then run it.





## WIP CI/CD Readme

### Front-end 

Go inside folder the front folder:

> cd front

Install dependencies:

> npm install

Launch Front-end:

> npm run start;

#### Docker

The container are configured on a workflow Github Actions.
Go on it and modify "" for you're own space/account

OPEN Docker desktop and search for your images 
Then run it.

### Back-end

Go inside folder the back folder:

> cd back

Install dependencies:

> mvn clean install

Launch Back-end:

>  mvn spring-boot:run

Tests automaticaly played:

On github Actions choose test workflow, download and open the artifacts with a browser.


#### Docker

The container are configured on a workflow Github Actions.
Go on it and modify "" for you're own space/account

OPEN Docker desktop and search for your images 
Then run it.
