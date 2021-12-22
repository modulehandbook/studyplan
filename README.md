# IMI module selection
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

### 1. Install docker and docker-compose
Further information on [docker.com/get-docker](https://docs.docker.com/get-docker/) and [docker.com/compose/install](https://docs.docker.com/compose/install/).

### 2. Clone the repo
Clone this repository to your local machine.

### 3. Build docker container
Run the following command inside the project-directory.

```bash
sudo docker-compose build
```
### 4. Start docker container
Run the following command inside the project-directory.
```bash
sudo docker-compose up
```

### 5. Seeding the Database
To set up a test user run (in a second terminal window):
```bash
sudo docker exec node-server node seeds/usersWithStudyplanAndSemester.js
```
## Use the development environment

### Start Docker-Desktop
* If you have docker-desktop installed: Start this first.

* If you have only docker-engine installed: Do nothing.

### Start the environment
```bash
sudo docker-compose up
```
* add ```-d``` flag to run in background
* open App on [http://localhost:8080](http://localhost:8080) (changes will be applied automatically)

### Stop the environment
```bash
sudo docker-compose down
```
### See logs
```bash
sudo docker-compose logs
```

## Additional information
* You may want not always prefix the docker commands with ```sudo```, so look [here](https://docs.docker.com/engine/install/linux-postinstall/).
* In ```docker-dev-db``` the local database is stored. To reset remove the directory.
* ```client/.eslintrc.js``` can be ignored.