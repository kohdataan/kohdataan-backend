# Somettamalla uutta kohtaamista -backend

## Project background and goals

In the project we develop and implement a new accessible social media service, where it is easy to meet new people.

The aim is to create a service, which has a safe and positive atmosphere, where nobody is bullied, and where nobody is left alone. The service supports meeting new people and creating more interaction, so that everyone has a chance to get to know likeminded people, and maintain their existing friendships.

The service is open to all people over 15 years of age. The implementation of the service takes into account different accessibility restrictions and is easy to use, and you can also communicate in multiple different ways. The service will be implemented as a web application that is developed with a mobile first mindset, but it can be used on other devices, too.

The service and it's technical implementation is related to the "Somettamalla uutta kohtaamista" also known as the ["Kohdataan"-project]((https://kohdataan.fi/), that aims ot reduce lonelines through the use of social media.

Designin the service began in spring 2018 with the "Kohdataan"-hackathon, that challenged experts from different fields to innovate a new kind of social media. The ideas were refined together with potential users and partners into a concept, that has continued evolving and is being developed during spring 2019. The service will be released in fall 2019.

The implementation of the service is user centric by nature. The project also includes a co-creation model, where the service is developed in collaboration not only with the users, but also software engineers and other subject experts that are willing to participate in the project. Opennes, doing together and figuring out new ways of working is in the core of the project. The aim of the co-creation model is also to find some important additional resources for the implementation of the project.

The "Kohdataan"-project is a joint venture of [Kehitysvammaliitto](https://www.kehitysvammaliitto.fi/) and [Mielenterveysseura](https://www.mielenterveysseura.fi/). 

The project is funded by [Funding centre for social welfare and health organisations, STEA](https://www.stea.fi/).

The technical partner and co-creation model coordinator of the project is [Perfektio](https://www.perfektio.fi/).

## Project development environment setup

### Backend

To get the project backend running, you need to have [Docker Compose](https://docs.docker.com/compose/install/) installed.

After installing Docker Compose you can get the project up by running the following commands:

```bash
git clone git@github.com:kohdataan/kohdataan-backend.git
cd kohdataan-backend
docker-compose build
docker-compose up
```

If you add new npm-packages to the project:
* Add the package to the `node/package.json` file
* Run `docker-compose build && docker-compose up` to install the new npm-packages.
* With the service up, run `docker-compose run node license-checker > npm-license-list.txt`
  * This will update the used packages and licenses list

### Test credentials

TBA 

## Documentation and architecture

![Kohdataan architecture](documentation/kohdataan-architecture.png?raw=true "Kohdataan architecture")

## Visual design

The project visual design can be found at https://app.zeplin.io/project/5cb591097f5deba21424eb89/

You need to register as a Zeplin user to view the design. After registering you have access to up to date per view design of the service. There will be direct links to the design of single views, so you can focus on the actual software development.

## Co-creation model

### Backlog and development flow

If you want to participate in the implementation of the project, pick an issue (that is not already assigned to someone) from the [project board](https://github.com/orgs/kohdataan/projects/1) that sounds good to you and assign it to yourself and move it to the "In progress"-column on the board. The project board consists of technical features designed and validated by the project staff and technology partner and of bugs found in the project. When you start developing a feature or fixing a bug, work on your own feature-branch, that is named in the following format: `/<backend/frontend>/<issuen numero>/<lyhyt kuvaus issuen/issuen otsikko>` or for example `/backend/2/LoginEndpoints`.

The project team will make sure that there's plenty of prioritised and well defiend issues for different software developers of different levels and skillsets/backgrounds.

### Communication

Communication related to the project happens on [Kohdataan Development Slack](https://kohdataan-dev.slack.com/). After registering you can ask anything related to the project, the project staff will answer your questions actively and help you to get started wit the project.

In addition to slack, there is of course the discussion on pull requests and issues. Please keep discussion related to these in the discussion threads instead of slack. The language used in pull requests and issues is English.

### Source code style guidelines

The project uses [ESLint](https://github.com/eslint/eslint) and [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with small changes.

#### Backend

#### Frontend

For container-component hiearchy, follow [the guidelines in this article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).

The project uses SASS for styling, there's a .scss-file for each component in the components folder.

### Testing

The project goal is to create a social media platform, on which you can safely and accessibly meet new people. Testing is obviously a big part of achieving this goal.

The project adheres to Web Content Accessibility Guidelines (WCAG) 2.1 accessibility standard. When participating in project development, a crucial part of the work is also comprehensive automated accessibility testing. The project uses [axe-core](https://github.com/dequelabs/axe-core) based accessibilty testing library (jest-axe, cypress-axe or other, choice still pending) for this.

The basis of the accessibility testing is to check accessibility every time something changes in the view:

* Navigating to another view
* Messages:
  * New message is sent
  * New message is received
  * etc.
* 

Automated accessibility testing tools are not perfect. Before submitting a pull request, please check that your work is not in conflict with the following accessibility checklist: <checklist TBA>

### Pull Request policies

All development work should be made in individual feature branches. When you are done with your selected issue, submit a pull request from your branch to the `development`-branch. The `master` branch is reserved for the latest release of the software.

A single pull request is related to a single issue. Refer to the issue number and title in the pull request title and body, this moves the issue to the next column automatically when the pull request has been closed and merged. There is a template for submitting pull requests, fill the defined sections in carefully. When filled properly, you clearly descbribe what your implementation does and how. This speeds up the pull request review process and makes it easier for the project staff.

The technical partner of the project will review and accept pull requests. You can assume that your pull request will be reviewed by the end of next weekday by 17:00.

### Reporting bugs / new feature requests

If you find bugs in the project, [make a new issue](https://github.com/kohdataan/kohdataan-backend/issues/new/choose). Use the "Bug"-template for this.

You can also suggest new features to be implemented in the project using the "Feature"-template found on the same page. The project staff evaluates whether the suggested feature is needed and appropriate for the project in the bigger picture. They decide whether the request is taken into the backlog of the project and prioritise it to a fitting level and further defines the issue if needed.

## Supporting material for development
[Mattermost API documentation](https://api.mattermost.com/)

