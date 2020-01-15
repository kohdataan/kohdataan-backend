## Kehittäminen windows -ympäristössä

Projektin kehittäminen `windows` -ympäristössä on hivenen haastavampaa kuin unix -ympäristössä. Suosittelemme käyttämään `unix` -pohjaista käyttöjärjestelmää kehittämiiseen, mutta jos se ei ole mahdollista niin kehittäminen onnistuu myös windows -ympäristössä.

#### Asennus

##### Docker

Tarvitset backendin pyörittämiseen `docker for winsows`:in. Löydät asennustiedoston [täältä.](https://docs.docker.com/docker-for-windows/install/). Asennuksen jälkeen sinun tulee jakaa jokin tietokoneen levyistä dockerin käyttöön. Löydät ohjeen [täältä](https://blogs.msdn.microsoft.com/stevelasker/2016/06/14/configuring-docker-for-windows-volumes/). Jos kohtaat dockerin asennuksessa muita ongelmia kannattaa laittaa viestiä [slackissa.](https://join.slack.com/t/kohdataan-dev/shared_invite/enQtNjIwMTc4NzA4MjE0LWMzMDZmMmI1NjEwMjcyMDA2YjJiZTlhMmJiZTk5N2JiMGE2YTRjZDViNGVjNGM1NzYwNThkZjBkMzhlYzExMGU)

##### Git

Jotta saat kloonattua projektin githubista tarvitset koneellesi `git`:in. Löydät `git`:in asennustiedoston [täältä](https://git-scm.com/download/win). Windows käyttää erilaista rivinvaihto merkkiä kuin unix -järjestelmät. Jos kloonaat koodit suoraan githubista, niin docker ei toimi oikein. Tämän takia on tärkeä vaihtaa `git` tukemaan `unix`:in -tyylistä rivinvaihtoa. Tämä tapahtuu ajamalla komentorivillä komento `git config --global core.autocrlf input`.

##### Projektin pystytys

Dockerin kannalta isoin ero windowsille on external volumen käyttö postgres-databaselle. Volumea ei siis luoda ja käytetä docker-composen sisällä vaan erillisenä. Tällöin se pitää luoda erikseen komennolla asennuksen yhteydessä. Windowsille on oma docker-compose-win.yml tiedosto, jossa external volume määritellään. Projekti lähtee käyntiin ajamalla seuraavat komennot:

```bash
git clone https://github.com/kohdataan/kohdataan-backend.git
cd kohdataan-backend
docker-compose -f docker-compose-win.yml build
docker volume create --name=postgres_database
docker-compose -f docker-compose-win.yml up
```

##### Tietokanta

Sinun tulee ajaa dockerin sisään oikea tietokanta dumppi. Helpoin tapa tehdä tämä on mennä päällä olevan docker -kontin sisälle komennolla `docker exec -it kohdataan-backend_db_1 /bin/bash`. Tämän jälkeen mene kansioon `db_dumps` ja kopio sinne [kohdataan.pgsql](https://github.com/kohdataan/kohdataan-backend/blob/master/db/dumps/kohdataan.pgsql) ja [mattermost.pgsql](https://github.com/kohdataan/kohdataan-backend/blob/master/db/dumps/mattermost.pgsql). Kopionnin voit tehdä vaikka `vim`:llä. Voit kopioimisen jälkeen ajaa dumpit komennoilla.

```
createdb -U mmuser kohdataan
psql -U mmuser kohdataan < kohdataan.pgsql
psql -U mmuser mattermost < mattermost.pgsql
```

Voit myös luoda samalla testejä varten testikannan:

```
createdb -U mmuser database_test
```

##### Mattermost

Tästä lähtien voit seurata myös alkuperäisiä asennusohjeita, sillä mattermostiin liittyvät asetukset ovat samanlaisia kaikissa kehitysympäristöissä. Mattermost tarvitsee itselleen tietyt asetukset, jotta se toimii projektin kanssa. Saat nämä asetettua menemällä mattermostin kontin sisälle ja muokkaamalla `config.json` -tiedostoa. Pääset kontin sisään komennolla `docker exec -it kohdataan-backend_mattermost_1 /bin/sh`. Tämän jälkeen löydät `config.json` tiedoston `config` -kansiosta. Muokkaa tiedostosta seuraavat kohdat:

```
"ServiceSettings": {
  "SiteURL": "http://localhost:9090",
  ...
  "AllowCorsFrom": "http://localhost:3000 http://localhost:9090",
  "CorsAllowCredentials": true,
  "CorsDebug": true,
  "EnableUserAccessTokens": true,
  ...
  },
"TeamSettings": {
  "EnableTeamCreation": true,
  "EnableUserCreation": true,
  "EnableOpenServer": true,
  },
```

#### Ongelmatilanteet

Jos kohtaat dockerin asennuksessa muita ongelmia kannattaa laittaa viestiä [slackissa.](https://join.slack.com/t/kohdataan-dev/shared_invite/enQtNjIwMTc4NzA4MjE0LWMzMDZmMmI1NjEwMjcyMDA2YjJiZTlhMmJiZTk5N2JiMGE2YTRjZDViNGVjNGM1NzYwNThkZjBkMzhlYzExMGU)
