const Missions = [
    {id: 1, title: "Mission 1", level: 1, distance: 100, desc: "This is the first mission.", xp: [20,40], thumb: "mission1.png", x: 50.1, y: 17.8},
    {id: 2, title: "Mission 2", level: 2, distance: 200, desc: "This is the second mission.", xp: [15,30], thumb: "mission2.png", x: 78.7, y: 34.1},
    {id: 3, title: "Mission 3", level: 3, distance: 300, desc: "This is the third mission.", xp: [25,50], thumb: "mission3.png", x: 78.3, y: 56.1},
    {id: 4, title: "Mission 4", level: 4, distance: 400, desc: "This is the fourth mission.", xp: [30,60], thumb: "mission4.png", x: 73.8, y: 77.3},
];

const Achievements = [];

const defaultstate = {
    player: { name: "Name", "pfp" : "", level: 1, xp: 0, xptonext: 100 },
    activemission: null,
    completedmissions: [],
    achievements: [],
    friends: [],
    journal: []
};

const today = () => new Date().toLocaleDateString("en-CA");

function doneToday() {
    return state.completedmissions.some(x => x.day === today());
}

function getStatus(m) {
    if (state.completedmissions.some(a => a.id === m.id)) return "done";
    const prev = Missions.find(b => b.id === m.id - 1);
    const prevdone = !prev || state.completedmissions.some(c => c.id === prev.id);
    if (!prevdone) return "locked";
    if (doneToday()) return "wait";
    return "open";
}


let state= structuredClone(defaultstate);

const $ = (id) => document.getElementById(id);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const esc = s => s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function resizeimage(file, max) {
    return new Promise(resolve => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = () => { img.src = reader.result; };
        img.onload = () => {
            const scale = Math.min(max / img.width, max / img.height, 1);
            const c = document.createElement("canvas");
            c.width = Math.round(img.width * scale);
            c.height = Math.round(img.height * scale);
            c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
            resolve(c.toDataURL("image/jpeg", 0.8));
        };
        reader.readAsDataURL(file);
    });
}
function saveState() { localStorage.setItem("tg", JSON.stringify(state)); }
function loadState() {
    const s = localStorage.getItem("tg");
    if (s) Object.assign (state, JSON.parse(s));
}

function openmissioncard(m) {
    $("mission-thumb").src = m.thumb;
    $("lvlbadge").textContent = "Level " + m.level
    $("title").textContent = m.title;
    $("distance").textContent = m.distance + "m away";
    $("desc").textContent = m.desc;
    $("xp").textContent = m.xp[0] + " to " + m.xp[1] + " XP";

    const status = getStatus(m);
    let label = "Accept";
    if (status === "done") label = "Completed";
    else if (status === "locked") label = "Finish mission " + (m.id - 1) + " first";
    else if (status === "wait") label = "Come Back tomorrow";
    else if (state.activemission) label = "In progress";

    const btn = $("startbtn");
    btn.disabled = label !== "Accept";
    btn.querySelector("span").textContent = label;
    btn.onclick = () => acceptMission(m.id);
    $("missioncard").classList.add("open");
}

function closemissioncard() {
    $("missioncard").classList.remove("open");
}

function acceptMission(id) {
    const m = Missions.find(a => a.id === id);
    if (state.activemission || getStatus(m) !== "open") return;
    state.activemission = id;
    saveState();
    closemissioncard();
    renderActive();
}

function completemission(photo,journal) {
    const m = Missions.find(a => a.id === state.activemission);
    if (!m) return;

    const p = state.player;
    const gainxp = rand(m.xp[0], m.xp[1]);
    p.xp += gainxp;
    while (p.xp >= p.xptonext) {
        p.xp -= p.xptonext;
        p.level++;
        p.xptonext = Math.floor(p.xptonext * 1.25);
    }

    state.completedmissions.push({id: m.id, title: m.title, date: Date.now(),day: today(), xp: gainxp});
    state.journal.push({title: m.title, desc: m.desc, journal: journal, photo: photo, date: Date.now(), xp: gainxp});
    state.activemission = null;
    checkachievements();
    saveState();
    renderall();    
}

function checkachievements() {
    Achievements.forEach(a => {
        if (!state.achievements.includes(a.id) && a.check(state)) {
            state.achievements.push(a.id);
        }
    });
}

function renderjournal() {
    if (!state.journal.length) return '<p class="gamefont">Your journal is empty.</p>';
    return [...state.journal].reverse().map(e => `
        <div class="list-item">
            <div class="list-item-content">
               <b>${e.title}</b><br>
               ${e.photo ? `<img src="${e.photo}" class="jphoto">` : ""}
               <p>${e.journal}</p>
            </div>
            <div class="list-item-footer">
               +${e.xp} XP, ${new Date(e.date).toLocaleDateString()}
            </div>
        </div>`).join("");
}

function renderfriends() {
    if (!state.friends.length) return '<p class="gamefont">You have no friends 🫵.</p>';
    return [...state.friends].reverse().map(f => `
        <div class="list-item">
        <b>${f.name}</b><br>
        </div>`).join("");
}

function renderachievements() {
    const unlocked = Achievements.filter(a => state.achievements.includes(a.id));
    if (!unlocked.length) return '<p class="gamefont">You have no achievements .</p>';
    return unlocked.map(a => `<div class="list-item"> <b>${a.name}</b><br> ${a.desc} </div>`).join("");
}

function rendercomplete() {
    const m = Missions.find(a => a.id === state.activemission);
    return `
    <b>${m ? m.title: "" }</b>
    <input type="file" id="jphoto" accept="image/*">
    <img id="preview" class="preview">
    <textarea id="jtext" rows="4" placeholder="Write your journal entry here..."></textarea>
    <p class="error" id="jerror"></p>
    <button id="submit" class="start-btn gamefont">Submit</button>`;
}

function afterComplete() {
    let photo = null;
    $("jphoto").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        photo = await resizeimage(file, 300);
        $("preview").src = photo;
        $("preview").style.display = "block";
    });
    $("submit").addEventListener("click", () => {
        const journal = $("jtext").value.trim();
        if (!photo || !journal) {
            $("jerror").textContent = "Please provide both a photo and a journal entry.";
            return;
        }
        completemission(photo, journal);
        closeModal();
    });
}

function rendersettings() {
    return `
        <img id="pfp" src="${state.player.pfp || 'profile.jpg'}" alt="Profile Picture" class="pfp">
        <input type="file" id="simg" accept="image/*">
        <input type="text" id="sname" value="${esc(state.player.name)}" placeholder="Enter your name">
        <button id="save-profile" class="start-btn gamefont">Save</button>`;
}

function afterSettings() {
    const p = state.player;
    let pfp = p.pfp
    $("sname").value = p.name;
    $("simg").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        pfp = await resizeimage(file, 200);
        $("pfp").src = pfp;
    });
    $("save-profile").addEventListener("click", () => {
        const name = $("sname").value.trim();
        if (!name) {
            alert("Please enter a name.");
            return;
        }
        p.name = name;
        p.pfp = pfp;
        saveState();
        renderprofile();
        closeModal();
    });
}

const views = {
    journal: { title: "Journal", render: renderjournal },
    friends: { title: "Friends", render: renderfriends },
    achievements: { title: "Achievements", render: renderachievements },
    settings: { title: "Settings", render: rendersettings, after: afterSettings },
    complete: { title: "Complete Mission", render: rendercomplete, after: afterComplete }
};

function setactiveview(view) {
    document.querySelectorAll(".nav-b").forEach(b => b.classList.toggle("active",b.dataset.view === view));
}

function openmodal(view) {
    $("modal-title").textContent = views[view].title;
    $("modal-body").innerHTML = views[view].render();
    $("modal").classList.add("open");
    if (views[view].after) views[view].after();
    closemissioncard();
}

function closeModal() {
    $("modal").classList.remove("open");
    setactiveview("map");
}

function renderprofile() {
    const p= state.player;
    $("pname").textContent = p.name;
    $("plevel").textContent = "Level " + p.level;
    $("pxp").textContent = `${p.xp} / ${p.xptonext} XP`;
    $("pbar").style.width = (p.xp / p.xptonext * 100) + "%";
    $("ppic").src = p.pfp || "profile.jpg";
}

function renderActive() {
    const m = Missions.find(a => a.id === state.activemission);
    $("active").classList.toggle("show", !!m);
    if (m) { $("active-text").textContent = m.title; 

    }
}

function renderpins() {
    const box = $("pins");
    box.innerHTML = "";
    Missions.forEach(m => {
        const status = getStatus(m);
        const pin = document.createElement("div");
        pin.className = "lvl-pin " + status;
        pin.style.left = m.x + "%";
        pin.style.top = m.y + "%";
        pin.innerHTML = `
            <div class="wooden-sign">
                <span class="nail tl"></span>
                <span class="nail tr"></span>
                <span class="nail bl"></span>
                <span class="nail br"></span>
                <span class="gamefont">${m.title}</span>
            </div>

            <button class="node">
                <div class="rim">   
                    <div class="face">
                        <span class="gamefont node-no">${status === "done" ? "✔" : m.level}</span>
                    </div>
                </div>
            </button>`;
        pin.addEventListener("click", e => {
            e.stopPropagation();
            openmissioncard(m);
        });
        box.appendChild(pin);
    });
}

function renderall() {
    renderprofile();
    renderActive();
    renderpins();
}

document.querySelectorAll(".nav-b").forEach(b => {
    b.addEventListener("click", () => {
        const view = b.dataset.view;
        if (view === "map") return closeModal();
        setactiveview(view);
        openmodal(view);
    });
});

$("completebtn").addEventListener("click", () => openmodal("complete"));
$("settingsbtn").addEventListener("click", () => openmodal("settings"));
$("modal-close").addEventListener("click", closeModal);
$("modal").addEventListener("click", e => { if (e.target === $("modal")) closeModal(); });
document.addEventListener("click", e => {
    if (!e.target.closest(".mission-card")) closemissioncard();
});



loadState();
saveState();
renderall();
