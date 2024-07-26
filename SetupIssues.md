---
title: "[]{#_ym77chxxmw2 .anchor}Mercur.js Project-Backend Setup guide
  and problem troubleshooting:"
---

## Create a new Mercur project with the command:

### "npx mercurjs marketplace"

If the project is already setup, then after cloning "yarn install" in the
root directory, then follow these steps:

## API Configuration

### Initial Setup

1.  Navigate to the /api directory.

2.  Execute the "yarn" command to install dependencies.

### 

### Environment Configuration

1.  Create a .env file in the root of the project.

2.  Add the DATABASE_URL variable with your PostgreSQL database URL.

### Steps before seeding and running migrations to the server

#### -yarn build: admin 

#### -yarn build: vendor

### Database and Server Initialization

#### Seed the database:

-yarn seed

#### Start the Medusa development server:

-yarn dev

### Encountered Issues: 

![](/image1.jpg){width="6.5in"
height="0.5194444444444444in"}

Solution: Make sure you have executed the "initial setup" steps, make
sure you have rediss modules and rediss URL commented out

#### -After these steps run yarn build:admin and yarn build:server 

#### -then try to seed the database again

#### ![](/image2.png){width="6.5in" height="0.9861111111111112in"}

Solution: Make sure you have executed the "initial setup" steps, make
sure you have rediss modules and rediss URL commented out

#### Make sure to use pgAdmin and have Postgres installed locally

### [[Mercur.js Npm]{.underline}](https://www.npmjs.com/package/mercurjs?activeTab=code)
