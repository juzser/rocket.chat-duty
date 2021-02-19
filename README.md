# Rocket.Chat App - Team Duty

You have missions for group of members per week? This is the app you need.
*Currently the app only detect the duties by Monday.*

Usage: `/duty`

`/duty start`: Announce the duty for next team (start from team #1).
`/duty start 3`: Announce the duty for the team #4.
`/duty list`: Check the team list.
`/duty prev`: Check the team & what they have done last week.
`/duty next`: Check the team next week.
`/duty show`: Check the current team & what they have done this week.


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
  Example: `40 9 * * 1` (Run at Monday 9:40AM every week)

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

## TODO:

- Dynamic date, not only check by Monday.
