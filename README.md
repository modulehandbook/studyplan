# Studyplan
### A MEVN-based Tool for HTW IMI students to plan their studies and choose optional modules.


Developed as [HTW IMI-Project](https://imi-bachelor.htw-berlin.de/showtime/) (WiSe21/22).

Based on [studplan](https://github.com/JuliaZamaitat/studyplan) by [Julia Zamaitat](https://github.com/JuliaZamaitat).

### Team:
* [Krist Baliev](https://github.com/FlyingBaum) 
* [Linh Phuong Chu](https://github.com/ChuChuPL)
* [Leon Grahl](https://github.com/nt2743) 
* [Ramadhan Irfan](https://github.com/Devianirfan) 
* [Ben Sauerländer](https://github.com/BenSauerlaender) 
* [Viet Anh Jimmy Tran](https://github.com/jimmy080900) 
* [Leonard Valentin](https://github.com/LennoxCode) 

### Supervisor:
* [Prof. Dr. Barne Kleinen](https://github.com/bkleinen)


## Set up development environment

WARNING: It is highly recommended to use a linux machine. Otherwise a lot of scripts may not run correctly. Also it is recommended to use docker-cli instead of docker-desktop.

### 1. Install docker and docker-compose
Further information on [docker.com/get-docker](https://docs.docker.com/get-docker/) and [docker.com/compose/install](https://docs.docker.com/compose/install/).

### 2. Clone the repo
Clone this repository to your local machine.

### 3. Build docker container and seed the Database
Run the following command inside the project-root-directory.

```bash
sudo npm run init
```
## Use the development environment

### Start Docker-Desktop
* If you have docker-desktop installed: Start this first.

* If you have only docker-engine installed: Do nothing.

### Start the environment
```bash
sudo npm run start
```
* Open App on [http://localhost:8080](http://localhost:8080) (changes will be applied automatically)
* You can login with test/test or admin/admin

### Stop the environment
```bash
sudo npm run stop
```
### See logs
```bash
sudo npm run logs
```

You can also specifie which logs you want to see. To do so just add ( vue-app / node-server / mongo-db )

For example:
```bash
sudo npm run logs vue-app
```

### Seed the Database
- You can seed everything with: (this will override all data in the  local DB)

    ```bash
    sudo npm run init-seed
    ```
    You can also use ```init-seed-no-warning ```

- You can also seed single files with:
    ```bash
    sudo npm run seed <List of files>
    ```
    - For example run ``` sudo npm run seed modalCourses testAndAdmin``` to seed the DB with all ModalCourses, test- and admin-user
    - The seeding-scripts are defined in ```seed```
    - You can pass ```-- --no-warning``` as first argument to ignore the warnings. 
        
        For example: ```sudo npm run seed -- --no-warning semester```

### Lint and format code

#### run this command either in ```client/``` or in ```root``` to lint and format the vue-app / node-server code: 
```bash
npm run lint
```

#### Or to lint and format both run:
```bash
npm run lint-all
```

### Run Server Tests (run in ```root```)
```bash
npm run test
```

### Test the algorithm (warnig: this will nuke the database)
```bash
npm run testAlgo
```

### Clean reset the enviroment
#### If you have, for example, problems with not installed node packages run this command to completely rebuild the docker images:
```bash
npm run clean-docker-packages
```

#### If you want to completely reinstall the node packages on your local machine run this command either in ```client/``` or in ```root``` to clean the vue-app-packages / node-server-packages:
```bash
npm run clean-packages
```

#### Or to clean both run:
```bash
npm run clean-packages-all
```

## Deploy to HTW-Server

### Prerequisite

* Be inside the HTW network (or VPN)

* Configured SSH connection to the server.

### Deploy

To deploy vue-app and node-server to the production-server, do the following:

1. Clean your git working tree and commit any changes (check with git status) (main-branch will be deployed)

2. run ```./deploy prepare``` (use ```--no-cache``` to rebuild the node modules)

3. check the ```tmp-vue``` and ```tmp-node``` (thats the files, that will be deployed) (in ```.filesToDeploy``` is difined, which backend files will be deployed)

4. run ```./deploy deploy```

### Enviroment Variables

- Non-secret variables are stored inside ```ecosystem.config.js```

* Secret variables are stored in a file, which path ist defined as env-variable in ```ecosytem.config.js``` (```SECRET_PATH```).  
In ```secrets.js``` should be all variables defined, that are listed in ```secrets.js.example```.

## Additional information
* You may want not always prefix the docker commands with ```sudo```, so look [here](https://docs.docker.com/engine/install/linux-postinstall/).
* In ```docker-dev-db``` the local database is stored. To reset remove the directory.