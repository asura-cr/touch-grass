# [TOUCH-GRASS](https://touchgrass.dino.icu)

Touch-Grass is a small browser game made to encourage people to go outside by making it more fun through game mechanics and competition. The idea is to turn going outside into something people actually want to do, rather than something they keep putting off.

The game currently focuses on single-player missions, where players complete outdoor activities and document them through photos and journal entries. In the future, multiplayer will allow friends to compete with each other and encourage each other to spend more time outside.

> [!NOTE]
> **AI DISCLAIMER**
> - AI was used to help with choosing colors, debugging, and improving this README.



## Why This type of game

According to [Amo et al., *European Journal of Information Systems*, 2020](https://doi.org/10.1080/0960085X.2020.1808540), gamification elements such as points and leaderboards can increase user engagement and influence performance growth.

Touch-Grass uses a similar idea by adding levels, missions and competition to something people normally wouldn't think of as a game. The goal is to make going outside more fun and give people a reason to do it more often, especially when playing with friends.

## How it works

- A player can progress by one level per day.
- Levels unlock in order, so players cannot skip ahead.
- Clicking on a level pin opens a mission window showing the mission and its details.

![mission window](/assets/accept.png)

- After accepting a mission, the player can complete it using the complete button, which asks them to submit a photo and a journal entry.

![journal submission](/assets/complete-mission.png)

- The submitted journal entry is saved in the player's journal, where they can look back at their completed missions.
- In the future, journals will also be visible to friends when multiplayer is implemented.

## Built With

- ![HTML5](https://img.shields.io/badge/HTML5-orange)
- ![CSS3](https://img.shields.io/badge/CSS3-blue)
- ![JavaScript](https://img.shields.io/badge/JavaScript-yellow)

## How to Play

No installation is required since Touch-Grass runs in the browser.

1. **Play Online:** [Click Here](#)
2. **Play Locally:**
   - Clone this repo or download the ZIP file.
   - Open the project folder.
   - Open `index.html` in your browser.

## RoadMap

- [x] Initial deployment
- [ ] Change from localStorage to server-based storage
- [ ] Add multiplayer
- [ ] Add achievements
- [ ] Add missions based on location
- [ ] Allow players to share journals with friends
- [ ] Add leaderboards and other competitive features

## Adding a mission

Add an object to the `Missions` array in `script.js`.

```js
{
  id: 5,
  title: "sample",
  level: 5,
  distance: 100,
  desc: "sample desc",
  xp: [99, 999],
  thumb: "thumbnailsample.jpg",
  x: 50,
  y: 50
}
```

- `id`: Unique ID for the mission.
- `title`: Name of the mission.
- `level`: Level.
- `distance`: Distance from user to mission location.
- `desc`: Mission description.
- `xp`: XP value.
- `thumb`: Mission thumbnail image.
- `x` and `y`: Position of the mission pin on the map.

## Saved Data

Data is currently saved in the browser's `localStorage` under the key `tg`.

```js
{
  player: {
    name: "Name",
    pfp: "",
    level: 1,
    xp: 0,
    xptonext: 100
  },
  activemission: null,
  completedmissions: [],
  achievements: [],
  friends: [],
  journal: []
}
```

- `player`: Player details, level and XP.
- `activemission`: The mission currently being played.
- `completedmissions`: List of completed missions.
- `achievements`: Unlocked achievements.
- `friends`: Reserved for friend-related features.
- `journal`: Saved journal entries.

Currently, all data is stored locally in the browser. This means progress does not sync between devices, and clearing browser data can erase it. Server-based storage is planned for a future update.

### Sources

- CSS styling and design referencess
  * https://uiverse.io/
