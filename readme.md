# **TOUCH-GRASS**

Touch-grass is a small browser game that is made to help go outside by providing more fun to the element by adding competitiiveness , since it is a multiplayer (not the current version) it encourages those involved to go real life more often

> [!NOTE]
> **AI DISCLAIMER**
> - AI was used to help with choosing colors and debugging


## Why This type of game
According to [Amo et al., European Journal of Information Systems, 2020]\([https://www.tandfonline.com/doi/full/10.1080/0960085X.2020.1808540](https://www.tandfonline.com/doi/full/10.1080/0960085X.2020.1808540)) ,  gamificiation elements such as points and leaderboards increase engagement and influence performance growth . This supports the use of a game based approach to motivate people to spend more time outdoors . By turning everyday outdoor activities into a competetive experience , the game aims to make exploring the real world more engaging and make them participate more constantly

### How it works

\- A player can progress one game level per day and no more than that
\- A new level is unlocked in order each day
\- Clicking on a level pin opens up a mission window that shows the mission and its details
![alt text]\(accept.png)



\-  After accepting the mission you  can complete a mission by using the complete button which then asks you for a photo and a journal entry
![alt text]\(complete-mission.png)

\- submitting the journal stores it in your journal where it is visible to you (and your friends in the future)

### Built With

\* ![HTML5]\([https://shields.io](https://shields.io))
\* ![CSS3]\([https://shields.io](https://shields.io))
\* ![JavaScript]\([https://shields.io](https://shields.io))

### How to Play

\- No installation is required to play as it is a browser game

1\. **\*\*Play Online\*\*** : [Click Here](https://asura-cr.github.io/touch-grass)
2\. **\*\*Play Locally\*\*** :&#x20;
  \* Clone this repo or download the zip
  \* Open the project folder
  \* Open \`index.html\`to launch the game
### RoadMap

\- [x] Initial Deployment
\- [ ] Change from local storage to server based approach
\- [ ] Add Multiplayer
\- [ ] Achievements
\- [ ] Real missions based on location

### Adding a mission

Add an object to the \`Missions\` array in \`script.js\`

\`\`\`js&#x20;
{id: 5, title: "sample", level: 100, distance: 9999, desc: "sample desc", xp:[99,999], thumb:"thumbnailsample.jpg", x:50 , y:50}
\`\`\`

## Saved Data

\- Data is currently saved in browser localStorage under the key \`tg\`:

\`\`\`js&#x20;
{
    player: { name: "Name", "pfp" : "", level: 1, xp: 0, xptonext: 100 },
    activemission: null,
    completedmissions: [],
    achievements: [],
    friends: [],
    journal: []
}
\`\`\`


