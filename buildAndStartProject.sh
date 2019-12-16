#! /bin/bash

# A script that closes this project if it is on, builds it again, prunes the used volume, creates a new volume, starts the project and runs migrations and seed after a small delay

docker-compose down
docker-compose build
docker volume rm --force postgres_database
docker volume create --name=postgres_database
docker-compose up -d

cd db/dumps/

docker exec -i kohdataan-backend_db_1 createdb -U mmuser kohdataan
docker exec -i kohdataan-backend_db_1 createdb -U mmuser database_test
docker exec -i kohdataan-backend_db_1 psql -U mmuser kohdataan < kohdataan.pgsql
docker exec -i kohdataan-backend_db_1 psql -U mmuser mattermost < mattermost.pgsql
docker exec -i kohdataan-backend_node_1 sequelize db:migrate
docker exec -i kohdataan-backend_node_1 sequelize db:seed:all

cd ../../

docker-compose logs -f
