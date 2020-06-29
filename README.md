# Somettamalla uutta kohtaamista -backend

[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)

## Somettamalla uutta kohtaamista eli Kohdataan-hanke

### Tausta ja tavoitteet

Jokaisella on tarve tulla kuulluksi ja hyväksytyksi, tarve kuulua johonkin. Meillä on tarve jakaa ajatuksiamme ja elämäämme, tarve tuntea olevamme jollekin tärkeä. Se miten hyvin tarpeet toteutuvat, vaikuttaa itsetuntoomme, mielenterveyteemme ja hyvinvointiimme. Ystävät ja sosiaalinen kanssakäyminen vastaavat näihin tarpeisiin. Joka viides suomalainen kokee yksinäisyyttä jossain vaiheessa elämää, ja joka kymmenes on jatkuvasti yksinäinen. Erityistä tukea tarvitsevat suomalaiset kokevat yksinäisyyttä vielä useammin. Siksi on tärkeää luoda uusia mahdollisuuksia vuorovaikutukseen ja sosiaaliseen kanssakäymiseen.

Palvelun kehittäminen käynnistettiin keväällä 2018 [Kohdataan-hackathonissa](https://kohdataan.fi/hackathon/), jossa haastettiin eri alojen osaajia innovoimaan ja ideoimaan tulevaisuuden somepalvelua. Ideoista kehitettiin ja työstettiin yhdessä käyttäjien ja kumppaneiden kanssa konsepti, jonka tekninen toteuttaminen aloitettiin keväällä 2019. **[Kohdataan-some](https://kohdataan.fi/) julkaistiin toukokuussa 2020** ja se on aktiivisessa käytössä.

Palvelussa on otettu huomioon erilaiset tarpeet ja toiveet saavutettavuuden ja helppokäyttöisyyden osalta. Palvelussa voi esimerkiksi viestiä erilaisin keinoin. Tavoitteena on luoda palvelu, jossa on turvallinen ja myönteinen ilmapiiri, jossa ketään ei kiusata, ja jossa ketään ei jätetä yksin. Palvelussa tuetaan kohtaamista ja vuorovaikutusta, jotta kaikilla olisi mahdollisuus tutustua omanhenkisiin ihmisiin, ja myös ylläpitää kaverisuhteitaan. Palvelu on avoin kaikille yli 15-vuotiaille nuorille ja aikuisille.

Kohdataan-palvelu on kehitetty [Kehitysvammaliiton](https://www.kehitysvammaliitto.fi/) ja [Mieli ry:n](https://www.mieli.fi/) yhteishankkeessa, jossa tavoitteena on yksinäisyyden vähentäminen somen keinoin. Hanketta rahoittaa Sosiaali- ja terveysjärjestöjen avustuskeskus [STEA](https://www.stea.fi/).

### Yhteiskehittäminen ja koordinointi

Kohdataan-palvelu on kehitetty yhdessä käyttäjien kanssa ja toteutuksessa kaikilla tasoilla keskeistä on käyttäjälähtöisyys. Myös tekniseen toteutukseen on luotu [yhteiskehittämisen malli](http://kohdataan.fi/yhteiskehittaminen/), jossa palvelua kehitetään yhteistyössä paitsi käyttäjien, myös kaikkien palvelusta kiinnostuneiden ohjelmistokehittäjien ja muiden osaajien kanssa. Avoimuus ja yhdessä tekeminen, samoin uusien toimintatapojen kokeileminen on koko hankkeen ytimessä. Yhteiskehittämisestä saadaan myös tärkeää lisäresurssia palvelun toteutukseen.

Palvelun kehittämiseen voit osallistua olit sitten ohjelmistoalan opiskelija tai rautainen ammattilainen. Osallistumalla voit saada kokemusta ja kehittää omaa osaamistasi, tai antaa osaamisesi ja panoksesi tärkeän palvelun rakentamiseen. Voit osallistua yksin, tai haastaa mukaan kaverisi tai kollegasi ja osallistua porukalla. Jokaisen panos on tärkeä!

Palvelun kehittäminen tapahtuu GitHubissa. Kaikki palveluun liittyvä koodi ja graafinen aineisto on ja tulee olemaan vapaasti saatavilla ([MIT-lisenssi](https://github.com/kohdataan/kohdataan-backend/blob/master/LICENSE)). Käyttöliittymäsuunnitelma löytyy [Zeplinistä](https://app.zeplin.io/project/5cb591097f5deba21424eb89/).

Palvelun teknisestä koordinoinnista 2019-2020 on vastannut [Perfektio](https://www.perfektio.fi/) ja muusta hallinnoinnista [Kehitysvammaliitto](https://www.kehitysvammaliitto.fi/). Jos haluat tietää lisää palvelusta, voit lähettää meille sähköpostia osoitteeseen [kohdataan@kohdataan.fi](mailto:kohdataan@kohdataan.fi).

## Osallistuminen ja GitHub-projekti

Palvelun kehittäminen tapahtuu kahdessa git-repossa:
- [Taustapalvelut (kohdataan-backend):](https://github.com/kohdataan/kohdataan-backend) PostgreSQL-tietokanta, Mattermost-viestipalvelu, Node-taustasovellus ja Nginx-välipalvelin
- [Käyttöliittymä (kohdataan-frontend):](https://github.com/kohdataan/kohdataan-frontend) Mattermost Redux ja React Web-sovellus

![Kohdataan arkkitehtuuri](https://github.com/kohdataan/kohdataan-backend/blob/master/documentation/kohdataan-architecture.png?raw=true "Kohdataan arkkitehtuuri")

### Projektin asennus ja kehitysympäristön pystytys (kohdataan-backend)

#### Vaatimukset ja huomiot eri kehitysympäristölle

Testi- ja tuotantoympäristönä toimii [Ubuntu Linux 18.04.(LTS)](https://releases.ubuntu.com/18.04/). Tästä syystä on suositeltavaa, että kehitystyö tehdään samankaltaisessa unix-ympäristössä. Suosittelemme käyttämään unix -pohjaista (esim. Linux tai macOS) käyttöjärjestelmää kehittämiseen.

Kehitys-, testi ja tuotantoympäristö asentuu [Docker-kontteihin](https://www.docker.com/), jota varten sinun tulee asentaa [Docker Engine ja Docker Compose](https://docs.docker.com/compose/install/).

**HUOMIO macOS-käyttäjät!** *Kun luot uusia tiedostoja ja hakemistoja projektiin, kiinnitä erityistä huomiota nimeämiseen. Linuxissa käytetään oletuksena isot ja pienet kirjaimet erotteleva tiedostojärjestelmää (ext4), kun taas macOS ei oletusarvoisesti erottele isoja ja pieniä kirjaimia tiedostojärjestelmässä (HFS+).* Esimerkiksi jos meillä on hakemisto nimeltään */node/controllers/email**v**erification/* ja haemme koodissa sen näin `import * as emailVerification from '../../controllers/emailVerification'`. Tämä toimii hyvin macOS-ympäristössä, mutta Linux-ympäristössä tämä aiheuttaa virheilmoituksen. Hakemiston nimen tulee olla oikeaoppisesti */node/controllers/email**V**erification/*.

**HUOMIO Windows-käyttäjät!** Projektin kehittäminen Windows -ympäristössä on hivenen haastavampaa kuin unix -ympäristössä, mutta kehittäminen onnistuu myös Windows -ympäristössä.
- [Ohjeet Windows -ympäristössä asentamiseen](./windows.md)
- Toinen tapa on luoda erillinen virtuaalinen Linux-kehitysympäristö esim. hyödyntäen Oraclen [VirtualBoxia](https://www.virtualbox.org/), jolloin kehittäminen tapahtuu aidosti unix-ympäristössä.

#### Lataaminen GitHubista ja ensikäymnnistys

Luo ensin hakemisto, jossa haluat kehitystyötä tehdä. Esim. */opt/sites/kohdataan/*. Asennuksen jälkeen projekti lähtee käyntiin antamalla seuraavat komennot edellä luodussa hakemistossa:

```bash
git clone https://github.com/kohdataan/kohdataan-backend.git
cd kohdataan-backend
docker-compose build
docker-compose up
```

Käynnistyksen yhteysessä tulee virheilmoituksia esim. käyttöoikeuksiin ja puuttuviin konfigurattiotiedostoihin liittyen. 

#### Mattermost config

Mattermostin config-tiedostoon täytyy käydä tekemässä myös muutama muutos, jotta frontti ja mattermost-backend saadaan keskustelemaan keskenään. Nämä muutokset liittyvät lähinnä Mattermostin CORS-asetuksiin. Tarvittavat asetukset voi käydä muuttamassa joko mattermostin omasta käyttöliittymästä, tai suoraan config.json -tiedostosta. Kun projekti on kertaalleen saatu pystyyn, tiedosto pitäisi löytyä volumesin alta seuraavasti: volumes/mattermost/config/config.json. Käyttöliittymästä ne löytyvät puolestaan system consolen alta.

Muutettavat kentät:

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

#### Tietokanta

Tietokantadumpit löytyvät kansiosta db/dumps. Kantoja on kaksi, "kohdataan" ja "mattermost", joista ensimmäinen palvelee itse backendiä ja toinen Mattermostin sisäisiä toimintoja.

Kun palvelu on pystyssä, kantojen tuonti tapahtuu ajamalla db/dumps kansiossa seuraavat komennot:

```bash
docker exec -i kohdataan-backend_db_1 createdb -U mmuser kohdataan
docker exec -i kohdataan-backend_db_1 createdb -U mmuser database_test
docker exec -i kohdataan-backend_db_1 psql -U mmuser kohdataan < kohdataan.pgsql
docker exec -i kohdataan-backend_db_1 psql -U mmuser mattermost < mattermost.pgsql
```

Tämän lisäksi kannattaa ajaa tarvittavat migraation sekä seedit. Komennot voi ajaa suoraan node-kontissa:

```bash
sequelize db:migrate
sequelize db:seed:all
```

Tai suoraan konsolista

```bash
docker exec -i kohdataan-backend_node_1 sequelize db:migrate
docker exec -i kohdataan-backend_node_1 sequelize db:seed:all
```

Käyttäjätiedot:

```bash
email: dev@kohdataan.fi
username: dev
password: devtest
```

#### Node .env

Jotta saada muodostettua yhteys taustapalvelun ja käyttöliittymän välille, tulee taustapalvelu konfiguroida. Tätä varten ympäristömuuttujille on tiedosto .env hakemistossa *[kohdataan-backend/node/](https://github.com/kohdataan/kohdataan-backend/tree/master/node)*.

```bash
NODE_ENV=development
PORT=8080
MASTER_TOKEN=<MATTERMOST_MASTER_TOKEN>
TEAM_ID=<MATTERMOST_TEAM_ID>
MATTERMOST_URL=http://mattermost:8000/api/v4
FRONTEND_URL=http://localhost:3000
JWT_SECRET=<JSON_Web_Token>
PASSWORD_RESET_TIME=10800000
EMAIL_USER=
EMAIL_PASS=
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

Muuttujat MASTER_TOKEN ja TEAM_ID löytyvät tietokantadumpeista tai [Mattermostin Web-käyttöliittymästä](http://localhost:9090). [JWT_SECRET](https://jwt.io/) täytyy generoida itse. Mikä luot tyhjän Mattermost-asennuksen, MASTER_TOKEN täytyy genroida erikseen pääkäyttäjälle. TEAM_ID on sen tiimin ID, jota haluat käyttää palvelun kanavien ja käyttäjien luomiseen.

Sähköpostia varten käytetään erillistä SMTP-palvelinta. Testikäytössä voit antaa vaikka omat GMAIL-tunnuksesi. 

#### Ongelmatilanteet

Mikäli esim. node-kontti ei käynnisty ja tiedosto package.json on muuttunut, tai backendiin on lisätty uusia moduleja, kontissa voi ilmetä cachesta johtuvia ongelmia. Tällöin on hyvä tyhjentää järjestelmä rakentaa kontit uudelleen.

Seuraava komento poistaa KAIKKI kontit:
```bash
docker system prune
docker-compose build --no-cache
```

Yksittäisiä kontteja voi poistaa komennolla:
```bash
docker-compose rm <KONTIN_NIMI>
```
Konttien nimet:
- db
- mattermost
- nginx
- node

HUOM! Komento ei poista levyjä hakemistosta */kohdataan-backend/volumes*, jonka takia voidaan suorittaa suoraan komento `sudo docker-compose build && sudo docker-compose up -d`

### Backlog ja kehityksen kulku

Jos haluat osallistua projektin toteutukseen, valitse [projektin työlistalta](https://github.com/orgs/kohdataan/projects/1) backlog-sarakkeesta kiinnostavan kuuloinen ominaisuus (jota ei ole assignattu jollekin muulle), assignaa se itsellesi ja siirrä se työlistalla "In progress"-sarakkeeseen. Projektin työlista koostuu hankkeen henkilökunnan ja teknisen toteutuskumppanin yhdessä suunnittelemista ominaisuuksista ja projektista löytyneistä bugeista. Kun aloitat ominaisuuden kehittämisen tai bugin korjauksen, tee kehitystyö omassa feature-branchissa, jonka nimeät muotoon `/<backend/frontend>/<issuen numero>/<lyhyt kuvaus issuen/issuen otsikko>`, esimerksi `/backend/2/LoginEndpoints`.

Hanketiimi huolehtii, että projektin työlistalla on jatkuvasti runsaasti priorisoitua ja hyvin määriteltyä tekemistä eri tasoisille ja osaamistaustaisille ohjelmistokehittäjille.

### Kommunikaatio

Projektiin liittyvä kommunikaatio tapahtuu [Kohdataan Development Slackissa](https://join.slack.com/t/kohdataan-dev/shared_invite/enQtNjIwMTc4NzA4MjE0LWMzMDZmMmI1NjEwMjcyMDA2YjJiZTlhMmJiZTk5N2JiMGE2YTRjZDViNGVjNGM1NzYwNThkZjBkMzhlYzExMGU). Rekisteröidyttyäsi voit kysyä mitä tahansa projektiin liittyvää, hanketiimi vastailee kysymyksiin aktiivisesti ja auttaa mielellään alkuun projektin kanssa!

Slackin lisäksi projektiin liittyvää kommunikaatiota on myös GitHubissa Pull Requestien ja Issueiden osalta. Pidäthän näihin liittyvän keskustelun kommentteina GitHubissa.

### Lähdekoodin tyyliohjeet

Projektissa on käytössä [ESLint](https://github.com/eslint/eslint) ja [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) pienin muutoksin.

Jos halaut ajaa lintterin docker-kontin sisällä, aja seuraava komento:

```bash
docker-compose run --rm node npm run lint
```

Jos haluat, että eslint toimii omassa editorissasi, niin tällöin npm-pakettien pitää olla asennettuna koneellesi. Koneellesi pitää myös olla asennettuna `npm` ja `node.js`. Tämän jälkeen voit asentaa paketit seuraavalla komennolla. Muista myös asentaa prettier- ja eslint- plugin editoriisi.

```bash
npm ci
```

#### Pakettien lisäys

Jos lisäät projektiin uusia npm-paketteja:

- Lisää paketti `node/package.json`-tiedostoon
- Aja `docker-compose build && docker-compose up` asentaaksesi uudet npm-paketit
- Kun palvelu on pystyssä, aja `docker-compose run node license-checker > npm-license-list.txt`
  - Tämä päivittää käytettyjen npm-pakettien ja niiden lisenssien listan

### Testaaminen

Testit voi runnata komennolla "npm test" node -kansiossa, tarkista että containerit ovat pystyssä ennen.

Jos volumeen ei olla luotu testaustietokantaa build -vaiheessa, voit lisätä sen komennolla: "docker exec -i kohdataan-backend_db_1 createdb -U mmuser database_test"

Ekaa kertaa testejä runnatessa tulee ongelma "relation user does not exist", tämän pystyy ratkaisemaan runnaamalla testit uudelleen. (ekalla kerralla luodaan uudet tablet ja relationit eikä se ole enää sen jälkeen ongelma)

### Pull Request -käytännöt

Kaikki kehitystyö tulee tehdä issuekohtaisissa brancheissa. Kun kehitystyösi on valmis, tee omasta branchistasi pull request `development`-branchiin. `master`-branchi sisältää viimeisimmän julkaisuversion ohjelmistosta.

Pull requestit kohdistuvat yksittäiseen issueen. Viittaa issuen numeroon ja otsikkoon pull requestin otsikossa ja leipätekstissä, jolloin issue siirtyy projektin työlistalla automaattisesti suljetuksi, kun pull request on hyväksytty ja onnistuneesti mergetty. Pull requesteille on valmis pohja, täytä pohjassa määritellyt kohdat huolellisesti. Näin kuvailet yksityiskohtaisesti mitä toteutuksesi tekee ja miten. Tämä nopeuttaa pull requesteja läpikäyvien ja hyväksyvien ihmisten työtä.

Hankkeen tekninen kumppani vastaa pull requestien läpikäynnistä ja hyväksymisestä. Voit olettaa, että pull requestisi on käyty läpi viimeistään seuraavaan arkipäivään kello 17 mennessä.

### Bugien raportointi / uusien ominaisuustoiveiden tekeminen

Jos löydät projektista bugeja tee uusi issue [projektin issueihin](https://github.com/kohdataan/kohdataan-backend/issues/new/choose). Käytä bugien raportointiin tarkoitettua "Bug"-pohjaa.

Voit myös tehdä ehdotuksia uusiksi toteutettaviksi ominaisuuksiksi projektiin käyttäen samalta sivulta löytyvää "Feature"-pohjaa. Hankkeen henkilökunta arvioi ominaisuusehdotuksen tarpeellisuuden ja tarkoituksenmukaisuuden isommassa mittakaavassa, päättää otetaanko se projektin työlistalle, priorisoi sen sopivalle tasolle ja tarkentaa ominaisuuden kuvausta tarvittaessa.

## Kehitystyötä tukevaa materiaalia

[Mattermost API documentation](https://api.mattermost.com/)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/synyker"><img src="https://avatars2.githubusercontent.com/u/1566005?v=4" width="100px;" alt=""/><br /><sub><b>Jonne Airaksinen</b></sub></a><br /><a href="#infra-synyker" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-synyker" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/kohdataan/kohdataan-backend/commits?author=synyker" title="Code">💻</a> <a href="https://github.com/kohdataan/kohdataan-backend/commits?author=synyker" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/petrutsi"><img src="https://avatars1.githubusercontent.com/u/671675?v=4" width="100px;" alt=""/><br /><sub><b>petrutsi</b></sub></a><br /><a href="#infra-petrutsi" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kohdataan/kohdataan-backend/commits?author=petrutsi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Miapurho"><img src="https://avatars3.githubusercontent.com/u/49512615?v=4" width="100px;" alt=""/><br /><sub><b>Mia Purho</b></sub></a><br /><a href="#ideas-Miapurho" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/kohdataan/kohdataan-backend/commits?author=Miapurho" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/tanjarasanen"><img src="https://avatars2.githubusercontent.com/u/49152094?v=4" width="100px;" alt=""/><br /><sub><b>tanjarasanen</b></sub></a><br /><a href="#ideas-tanjarasanen" title="Ideas, Planning, & Feedback">🤔</a> <a href="#projectManagement-tanjarasanen" title="Project Management">📆</a></td>
    <td align="center"><a href="https://github.com/TerriFin"><img src="https://avatars0.githubusercontent.com/u/32302869?v=4" width="100px;" alt=""/><br /><sub><b>TerriFin</b></sub></a><br /><a href="https://github.com/kohdataan/kohdataan-backend/commits?author=TerriFin" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Pninja"><img src="https://avatars0.githubusercontent.com/u/23714794?v=4" width="100px;" alt=""/><br /><sub><b>Pinja Kuosmanen</b></sub></a><br /><a href="https://github.com/kohdataan/kohdataan-backend/commits?author=Pninja" title="Code">💻</a> <a href="https://github.com/kohdataan/kohdataan-backend/pulls?q=is%3Apr+reviewed-by%3APninja" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/larenala"><img src="https://avatars2.githubusercontent.com/u/33627243?v=4" width="100px;" alt=""/><br /><sub><b>larenala</b></sub></a><br /><a href="https://github.com/kohdataan/kohdataan-backend/commits?author=larenala" title="Code">💻</a> <a href="https://github.com/kohdataan/kohdataan-backend/pulls?q=is%3Apr+reviewed-by%3Alarenala" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/rovaniemi"><img src="https://avatars2.githubusercontent.com/u/21308995?v=4" width="100px;" alt=""/><br /><sub><b>Mauri Karlin</b></sub></a><br /><a href="https://github.com/kohdataan/kohdataan-backend/commits?author=rovaniemi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jannetimonen"><img src="https://avatars2.githubusercontent.com/u/48553524?v=4" width="100px;" alt=""/><br /><sub><b>jannetimonen</b></sub></a><br /><a href="https://github.com/kohdataan/kohdataan-backend/commits?author=jannetimonen" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/KaroliinaM"><img src="https://avatars1.githubusercontent.com/u/22050953?v=4" width="100px;" alt=""/><br /><sub><b>KaroliinaM</b></sub></a><br /><a href="https://github.com/kohdataan/kohdataan-backend/commits?author=KaroliinaM" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jheiska"><img src="https://avatars1.githubusercontent.com/u/22741213?v=4" width="100px;" alt=""/><br /><sub><b>jheiska</b></sub></a><br /><a href="https://github.com/kohdataan/kohdataan-backend/commits?author=jheiska" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/osavisaari"><img src="https://avatars0.githubusercontent.com/u/21077799?v=4" width="100px;" alt=""/><br /><sub><b>osavisaari</b></sub></a><br /><a href="#projectManagement-osavisaari" title="Project Management">📆</a></td>
    <td align="center"><a href="https://kuvatarina.fi"><img src="https://avatars3.githubusercontent.com/u/1239475?v=4" width="100px;" alt=""/><br /><sub><b>Tero Avellan</b></sub></a><br /><a href="https://github.com/kohdataan/kohdataan-backend/issues?q=author%3Atavellan" title="Bug reports">🐛</a> <a href="https://github.com/kohdataan/kohdataan-backend/commits?author=tavellan" title="Documentation">📖</a> <a href="#infra-tavellan" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
