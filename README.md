# Somettamalla Uutta Kohtaamista -backend

## Projektin tausta ja tavoitteet

## Projektin asennus ja kehitysympäristön pystytys

### Backend

Saadaksesi projektin kehitysympäristön pystyyn, sinun täytyy asentaa [Docker Compose](https://docs.docker.com/compose/install/).

Asennuksen jälkeen projekti lähtee käyntiin ajamalla seuraavat komennot:

```bash
git clone git@github.com:kohdataan/kohdataan-backend.git
cd kohdataan-backend
docker-compose build
docker-compose up
```

### Tunnukset testaamiseen

## Dokumentaatio ja arkkitehtuuri

## Ulkoasu

## Projektiin osallistuminen

### Backlog ja kehityksen kulku

Jos haluat osallistua projektin toteutukseen, valitse [projektin työlistalta](https://github.com/orgs/kohdataan/projects/1) kiinnostavan kuuloinen ominaisuus, assignaa se itsellesi ja siirrä se työlistalla "In progress"-sarakkeeseen. Projektin työlista koostuu hankkeen henkilökunnan ja teknisen toteutuskumppanin yhdessä suunnittelemista ominaisuuksista ja projektista löytyneistä bugeista. Kun aloitat ominaisuuden kehittämisen tai bugin korjauksen, tee kehitystyö omassa feature-branchissa, jonka nimeät muotoon `#<issuen numero>-<lyhyt kuvaus issuen/issuen otsikko>`, esimerksi `#2-LoginEndpoints`.

Hanketiimi huolehtii, että projektin työlistalla on jatkuvasti runsaasti priorisoitua ja hyvin määriteltyä tekemistä eri tasoisille ja osaamistaustaisille ohjelmistokehittäjille.

### Kommunikaatio

Projektiin liittyvä kommunikaatio tapahtuu [Kohdataan Development Slackissa](https://kohdataan-dev.slack.com/). Rekisteröidyttyäsi voit kysyä mitä tahansa projektiin liittyvää, hanketiimi vastailee kysymyksiin aktiivisesti ja auttaa mielellään alkuun projektin kanssa!

Slackin lisäksi projektiin liittyvää kommunikaatiota on myös GitHubissa Pull Requestien ja Issueiden osalta. Pidäthän näihin liittyvän keskustelun kommentteina GitHubissa.

### Tyyliohjeet

Projektissa on käytössä [ESLint](https://github.com/eslint/eslint) ja [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) pienin muutoksin. 

### Testaaminen

Projektin tavoittelema lopputulos on sosiaalisen median alusta, jolla voit tutustua uusiin ihmisiin turvallisesti ja saavutettavasti. Kattava testaus on luonnollisesti osa tämän tavoitteen saavuttamista.

Projekti noudattaa Web Content Accessibility Guidelines (WCAG) 2.1 -saavutettavuusstandardia. Kun osallistut projektin kehittämiseen, oleellinen osa on myös kattavien saavutettavuutta mittaavien automaatiotestien tekeminen. Projektissa käytetään [axe-core](https://github.com/dequelabs/axe-core)-pohjaista saavutettavuustestaukseen tarkoitettua kirjastoa *(jest-axe, cypress-axe tms, pitää valita)*.

Testaamisen lähtökohta on, että saavutettavuus testataan aina, kun joku asia näkymässä muuttuu: 

* Toiseen näkymään navigointi
* Viestit:
  * Uuden viestin lähettäminen
  * Uuden viestin vastaanottaminen
  * jne.
* 

Automaattisen saavutettavuustestauksen työkalut eivät kuitenkaan ole täydellisiä. Ennen pull requestin tekoa tarkistathan, että toteuttamasi ominaisuudet eivät ole ristiriidassa <insert sopiva saavutettavuuden checklist> kanssa.

### Pull Request -käytännöt

Kaikki kehitystyö tulee tehdä issuekohtaisissa brancheissa. Kun kehitystyösi on valmis, tee omasta branchistasi pull request `development`-branchiin. `master`-branchi sisältää viimeisimmän julkaisuversion ohjelmistosta.

Pull requestit kohdistuvat yksittäiseen issueen. Viittaa issuen numeroon ja otsikkoon pull requestin otsikossa ja leipätekstissä, jolloin issue siirtyy projektin työlistalla automaattisesti suljetuksi, kun pull request on hyväksytty ja onnistuneesti mergetty. Pull requesteille on valmis pohja, täytä pohjassa määritellyt kohdat huolellisesti. Näin kuvailet yksityiskohtaisesti mitä toteutuksesi tekee ja miten. Tämä nopeuttaa pull requesteja läpikäyvien ja hyväksyvien ihmisten työtä.

Hankkeen tekninen kumppani vastaa pull requestien läpikäynnistä ja hyväksymisestä. Voit olettaa, että pull requestisi on käyty läpi viimeistään seuraavaan arkipäivään kello 17 mennessä.

### Bugien raportointi / uusien ominaisuustoiveiden tekeminen

Jos löydät projektista bugeja tee uusi issue [projektin issueihin](https://github.com/kohdataan/kohdataan-backend/issues/new/choose). Käytä bugien raportointiin tarkoitettua "Bug"-pohjaa.

Voit myös tehdä ehdotuksia uusiksi toteutettaviksi ominaisuuksiksi projektiin käyttäen samalta sivulta löytyvää "Feature"-pohjaa. Hankkeen henkilökunta arvioi ominaisuusehdotuksen tarpeellisuuden ja tarkoituksenmukaisuuden isommassa mittakaavassa, päättää otetaanko se projektin työlistalle, priorisoi sen sopivalle tasolle ja tarkentaa ominaisuuden kuvausta tarvittaessa.

## Kehitystyötä tukevaa materiaalia

