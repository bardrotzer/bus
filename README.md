# bus
A node axpress app that functions as a bus for sending mail to sms, mail to write to filesystem and mail to mail

# Setup
In general you only need to get the deps and start the app, but there are a few maual points to conisder. 

First off You will need a mailgun account to configure mail sending
You will need a messagebird API key for sending sms

## Configuring env
just copy over the .env_default and rename it .env, then edit it and insert the folowing

```bash
  # create a copy of .env and rename it, then open it for editing
  cp .env_default .env && nano .env
```

***PORT*** The port the application runs on (default 3000)
***MAILGUN_API_KEY***  Your Api key for mailgin (mailgun.com)
***MESSAGEBIRD_API_KEY*** Your api Key for messagebird (messagebird.com)
***BASEPATH*** The path where files hould be written and stored
***DEFAULT_SMS_LIST*** (optional) The id of a messagebird contact list to use if none is specified (great if you are only sending to a single list)
**ORIGINATOR** The name that is added to your sms' when sending (can be set runtime)

