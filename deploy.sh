#!/bin/bash

##########################
#only for debug
cd studyplan;
########################

tmp_node=../tmp-node/
tmp_vue=../tmp-vue/
files=../.filesToDeploy 

##########################################################
if [ "$1" = "prepare" ]; then # mode = prepare
  
  NO_CACHE=false;
  
  if [ "$2" = "--no-cache" ]; then
    NO_CACHE=true;
  fi
  
  echo "fetch repo..."

  #update git-repo
  git checkout main || exit;
  git fetch || exit;
  git reset --hard origin/main || exit;
  
  echo "build vue..."

  #build vue
  cd client &&
  if $NO_CACHE ; then
    rm -rf node_modules && echo "deleted node_modules" 
    rm -f package-lock.json  && echo "deleted package-lock.json" 
  fi
  
  npm i || exit;
  npm run build || exit;

  echo "copy files..."

  # copy vue files
  rm -fr ../"$tmp_vue";
  mkdir ../"$tmp_vue";
  cp -r dist/* ../"$tmp_vue";
  
  #move node files 
  cd ..; 
  rm -fr "$tmp_node";
  mkdir "$tmp_node";

  #go through each file/directory specified in .filesToDeploy
  cat "$files" | while read line; do 
    if [ -d "$line" ]; then #is directory?
      cp -r "$line" "$tmp_node";
    elif [ -f "$line" ]; then # is file ?
      cp "$line" "$tmp_node";
    else
      echo -e "WARNING can not find: $line"
    fi
  done;

  echo "prepare is done. ready to deploy"

#####################################################################################
elif [ "$1" = "deploy" ]; then # mode = deploy


  echo "This will override data from the live-production-server!"
  read -r -p "Continue (y/n)?" CONT
  if ! [ "$CONT" = "y" ]; then
    exit;
  fi

  echo "send vue data..."

  #deploy vue
  ssh local@studyplan.f4.htw-berlin.de 'rm -rf /var/www/html/*' > log.txt || exit;
  cat "log.txt"
  scp -r "$tmp_vue"* local@studyplan.f4.htw-berlin.de:/var/www/html/ || exit;

  echo "send node-api data..."

  #deploy node-server
  ssh local@studyplan.f4.htw-berlin.de 'rm -rf /var/www/api/*' > log.txt || exit;
  cat "log.txt"
  scp -r "$tmp_node"* local@studyplan.f4.htw-berlin.de:/var/www/api/ || exit;

  echo "npm install..."
  ssh local@studyplan.f4.htw-berlin.de 'cd /var/www/api/ && npm i --only=prod' > log.txt || exit;
  cat "log.txt"

  echo "restart pm2..."
  ssh local@studyplan.f4.htw-berlin.de 'pm2 restart main' > log.txt || exit;
  cat "log.txt"

  #clean up
  echo "clean up..."
  rm -fr "$tmp_node";
  rm -fr "$tmp_vue";
  rm "log.txt"

  echo "all done."

#####################################################################################
else # mode = unkown
  echo "please use './deploy prepare' or './deploy deploy' ";
  exit;
fi
