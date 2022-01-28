#!/bin/bash

# cd ..
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

############
#set options
############

#read first argument
if [ "$1" = "--on-prod" ]; then
    ON_PROD=true
    shift #remove first argument

    #set env-variable
    export MONGODB_URI=$(cat ../ecosystem.config.js | grep MONGODB_URI | awk -F'"' '{print $2}')

else
    ON_PROD=false
fi

#read second argument
if [ "$1" = "--no-warning" ]; then
    PRINT_WARNING=false
    shift #remove second argument
else
    PRINT_WARNING=true
fi

##################
#check prequsition
##################

if [ "$ON_PROD" = false ] ; then
	#check if docker-compose is running
	DOCKERPS=$(sudo docker-compose ps --services --filter "status=running")
	if [ $(grep "mongo-db" <<< "$DOCKERPS") = "mongo-db"  ] && [ $(grep "node-server" <<< "$DOCKERPS") = "node-server"  ]
	then
	    echo "docker-compose is running"
	else
	    echo "Please start docker-compose first"
	    exit 1;
	fi
fi

################
#run all scripts
################

#iterate over all arguments (scripts to seed)
for arg in "$@"; do
  FILE="${arg}.js"
  #check if file exists
  if test -f "$FILE"; then
    #If print warning option is set and file has a warning: print warning
    if [ "$PRINT_WARNING" = true ] ; then
	    firstline=$(awk 'NR==1 {print;exit}' ${FILE})
        if [ "${firstline:2:9}" = warning ]; then
            echo "Warning on ${FILE}:"
	    #print file's second line # should be a warning about what will/can happen
            warn=$(awk 'NR==2 {print;exit}' ${FILE})
	    echo $warn
	    echo "Continue (y/n)?"
	    #read user input
            read -r CONT
	    echo ""
	    #skip if usere dont wrote y
            if ! [ "$CONT" = "y" ]; then
                echo "skip ${FILE}"
		continue # skip file
            fi
        fi
    fi
    #run node script
    if [ "$ON_PROD" = true ] ; then
	node ${FILE}
    else
    	sudo docker exec node-server node "seeds/${FILE}"
    fi
  else
    echo "Cant find ${FILE}"
  fi
done