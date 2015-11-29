# contwidgetor

##What is it?

Github is great to show you all your contributions as a timeline. Bitbucket doesn't have any of this. I use mainly Github for my open-source projects but also use a bit of Bitbucket for some other projects that I consider more private. I still want to show that I am contibuting even if it is not on Github. It is in my opinion important to show that you are passionate about programming when you are looking for a new job for example.

Contwidgetor (still looking for a better name) will display a grid showing all your contributions for the past year (commits only). It merges your contributions from Github and Bitbucket.

## Installation

```npm install contwigetor```

## Setup

You need to create a .env file at the root of your project. You just need to fill some simple properties.

You can see the ```.env.example``` provided in the repo to have an idea of what to put in it.

### What if I don't have the right tokens?

For Github, go to [creating an API token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)

For Bitbucket, go to [create a consumer](https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html#OAuthonBitbucketCloud-Createaconsumer)

## API
There is only 3 methods provided by the package:

```fetchContributions```: will fetch your contributions from Bitbucket and Github and store the results in an in-memore database.

```getContributionsTimeline```: will create a JSON file (from the filename provided in the .env file) containing your contributions

```getContributionsGridWidget```: will create the grid UI component depending or not on the existence of the JSON file containing your contributions. This will return a React component that you can rendered server side (it won't contain any interaction though).

## contwidgetor-ui
[contwidgetor-ui](http://github.com/jrm2k6/contwidgetor-ui) is the package providing the React components to display the grid. It is still in development but you can check out the example of this package to know how to use it on the client side, and providing your own JSON object representing your contributions.
