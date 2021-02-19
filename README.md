# Rocket.Chat App - Team Duty

You have missions for group of members per week, per day,... ? This is the app you need.

Usage: `/duty`

You can find the content & language file in `src/lib/content`. Feel free to ask me anything.

### Configuration

On application configuration it is possible to change following settings:

- **Bot Username** <br />
  Choose the username that this integration will post as. The user must already exist.<br />
  Default: `rocket.cat`<br />
  Required: `true`

- **Room to Announce** <br />
  The room that bot will announce the team & duty.<br />
  Default: `general`<br />
  Required: `true`

- **Schedule Pattern** <br />
  The cron pattern that will schedule the `/duty start` command.<br />
  Default: `null`<br />
  Required: `false`<br />

- **Team List** <br />
  List group of members, defined by usernames.<br />
  Default: `null`<br />
  Required: `true`<br />
  Example:
```
[
["ser", "admin"],
["rocket.cat", "pug"],
["ser", "someone"]
]
```

- **Todo List** <br />
  List duty of current team. `check` property to show **Done** button.<br />
  Default: `null`<br />
  Required: `true`<br />
  Example:
```
[
{ "key": "clean", "label": "Clean the office", "check": "true" },
{ "key": "seminar", "label": "Seminar", "check": "true" },
{ "key": "trainning", "label": "Trainning" }
]
```
