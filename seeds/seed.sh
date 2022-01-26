#!/bin/bash

#check if docker-compose is running
DOCKERPS=$(sudo docker-compose ps --services --filter "status=running")
if [ $(grep "mongo-db" <<< "$DOCKERPS") = "mongo-db"  ] && [ $(grep "node-server" <<< "$DOCKERPS") = "node-server"  ]
then
    echo "docker-compose is running"
else
    echo "Please start docker-compose first"
    exit 1;
fi

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

cd "$parent_path"

if [ "$1" = "--no-warning" ]; then
    NO_WARNING=true
    shift
else
    NO_WARNING=false
fi


#iterate over all arguments
for arg in "$@"; do
  FILE="${arg}.js"
  if test -f "$FILE"; then
    
    if $NO_WARNING ; then
          sudo docker exec node-server node "seeds/${FILE}"
    else
        if [ $(awk 'NR==1 {print;exit}' ${FILE}) ]; then
            echo "Warning on ${FILE}:"
            echo $(awk 'NR==2 {print;exit}' ${FILE})
            read -r -p "Continue (y/n)?" CONT
            if ! [ "$CONT" = "y" ]; then
                echo "skip ${FILE}"
            else
                sudo docker exec node-server node "seeds/${FILE}"
            fi
        fi
    fi
  else
    echo "Cant find ${FILE}"
  fi
done