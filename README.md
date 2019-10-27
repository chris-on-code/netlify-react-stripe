# Code Your Own Business

## A User's Flow/Lifecycle through Our App

- user creates account
  - user can update their profile and settings
- user creates free records
- user is prompted to upgrade
- user subscribes
  - calls stripe
  - updates app_metadata (netlify identity)
  - updates fauna database
- user upgrades account
- user deletes subscription
- user deletes account
