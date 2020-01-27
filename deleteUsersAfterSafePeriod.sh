#! /bin/bash

# A script that deletes users whose safe delete period is expired.

# TODO: Get all users from DB where deleteAt !== null and timestamp is more than 7 days ago
docker exec -it kohdataan-back-marraskuu_db_1 psql -U mmuser kohdataan -c 'SELECT * FROM "Users" WHERE "deleteAt"!=null;'
# TODO: Loop through those users and call deleteUserImmediately function for those users with their id and mmid
