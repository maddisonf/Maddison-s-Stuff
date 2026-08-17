const STORAGE_KEY = "maddisonStuff_v3";

const defaultData = {
  settings: {
    title: "maddison's stuff",
    subtitle: "school • life • volleyball • creative things • everything",
    birthdayMonth: 10,
    birthdayDay: 11,
    quote: "“make it cute, make it useful.”",
    accent: "#d98bab"
  },
  classes: {
    "NCAPS Digital Media & Tech": {
      art: "💻", color: "#dcecf7",
      desc: "digital media, technology & creative projects",
      assignments: [
        {id: crypto.randomUUID(), title:"Website homepage", due:"Aug 18", type:"project", done:false},
        {id: crypto.randomUUID(), title:"Digital media reflection", due:"Aug 20", type:"assignment", done:false},
        {id: crypto.randomUUID(), title:"Tech vocabulary", due:"Aug 21", type:"quiz", done:true},
        {id: crypto.randomUUID(), title:"Design project", due:"Aug 25", type:"project", done:false}
      ]
    },
    "AP Language & Comp": {
      art: "📖", color: "#f8e8e5",
      desc: "reading, writing, rhetoric & analysis",
      assignments: [
        {id: crypto.randomUUID(), title:"Summer reading response", due:"Aug 19", type:"assignment", done:false},
        {id: crypto.randomUUID(), title:"Rhetorical analysis", due:"Aug 22", type:"assignment", done:false},
        {id: crypto.randomUUID(), title:"Vocabulary quiz", due:"Aug 26", type:"quiz", done:false},
        {id: crypto.randomUUID(), title:"Argument essay", due:"Aug 28", type:"project", done:true}
      ]
    },
    "AP Statistics": {
      art: "📄", color: "#e6eff7",
      desc: "data, probability, statistics & analysis",
      assignments: [
        {id: crypto.randomUUID(), title:"Chapter 1 practice", due:"Aug 18", type:"assignment", done:false},
        {id: crypto.randomUUID(), title:"Statistical investigation", due:"Aug 23", type:"project", done:false},
        {id: crypto.randomUUID(), title:"Chapter 1 quiz", due:"Aug 27", type:"quiz", done:false},
        {id: crypto.randomUUID(), title:"Data analysis worksheet", due:"Aug 29", type:"assignment", done:false}
      ]
    }
  },
  links: [
    {name:"Google Classroom", url:"https://classroom.google.com"},
    {name:"ChatGPT", url:"https://chatgpt.com"},
    {name:"Gemini", url:"https://gemini.google.com"}
  ],
  goals: [
    {id:crypto.randomUUID(), text:"stay on top of school", done:false},
    {id:crypto.randomUUID(), text:"keep building my portfolio", done:false},
    {id:crypto.randomUUID(), text:"keep improving at volleyball", done:false},
    {id:crypto.randomUUID(), text:"make time for fun", done:false}
  ],
  life: {volleyball:"", creative:"", memories:""},
  events: [],
  todos: [],
  quickNote: ""
};

let state = loadState();
let currentClass = Object.keys(state.classes)[0] || "";
let assignmentFilter = "all";

function deepClone(obj){ return JSON.parse(JSON.stringify(obj)); }

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return deepClone(defaultData);
  try{
    const saved = JSON.parse(raw);
    return {
      ...deepClone(defaultData),
      ...saved,
      settings:{...defaultData.settings,...(saved.settings||{})},
      classes:saved.classes||deepClone(defaultData.classes),
      links:saved.links||[],
      goals:saved.goals||[],
      life:{...defaultData.life,...(saved.life||{})},
      events:saved.events||[],
      todos:saved.todos||[],
      quickNote:saved.quickNote||""
    };
  }catch(e){ return deepClone(defaultData); }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  applySettings();
}

function esc(v){
  return String(v ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

function pct(arr){
  return arr.length ? Math.round(arr.filter(x=>x.done).length/arr.length*100) : 0;
}

function applySettings(){
  document.title = state.settings.title + " ♡";
  document.getElementById("siteTitle").innerHTML = esc(state.settings.title).replace(" ","<br>");
  document.getElementById("siteSubtitle").textContent = state.settings.subtitle;
  document.getElementById("dailyQuote").textContent = state.settings.quote;
  document.documentElement.style.setProperty("--accent", state.settings.accent);
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content = state.settings.accent;
}

function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  const titles = {
    home:"❀⋆｡°✩ <span>homepage</span> ✩°｡⋆❀",
    school:"❀⋆｡°✩ <span>school dashboard</span> ✩°｡⋆❀",
    classPage:"❀⋆｡°✩ <span>class assignments</span> ✩°｡⋆❀",
    life:"❀⋆｡°✩ <span>my life</span> ✩°｡⋆❀",
    planner:"❀⋆｡°✩ <span>planner</span> ✩°｡⋆❀"
  };
  document.getElementById("pageTitle").innerHTML = titles[id];
  window.scrollTo({top:0,behavior:"smooth"});
  if(id==="school") renderSchool();
  if(id==="life") renderLife();
  if(id==="planner") renderPlanner();
}

function renderHome(){
  renderLinks();
  renderDashboardCards();
  renderCalendar();
  renderUpcoming();
}

function renderLinks(){
  const box = document.getElementById("quickLinks");
  box.innerHTML = state.links.length ? state.links.map((l,i)=>`
    <div class="link-line">
      <a class="side-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)} ↗</a>
      <button class="icon-btn" title="delete" onclick="deleteLink(${i})">×</button>
    </div>
  `).join("") : `<div class="note">no links yet</div>`;
}

function renderDashboardCards(){
  const box = document.getElementById("dashboardCards");
  box.innerHTML = `
    <div class="class-card card school-card" onclick="showPage('school')">
      <div class="class-art">📚</div><div class="class-name">SCHOOL</div>
      <div class="note">classes, assignments, grades & progress</div>
      <button class="btn card-button">open dashboard →</button>
    </div>
    <div class="class-card card life-card" onclick="showPage('life')">
      <div class="class-art">🌷</div><div class="class-name">MY LIFE</div>
      <div class="note">volleyball, goals, creative projects & things to remember</div>
      <button class="btn card-button">open dashboard →</button>
    </div>
    <div class="class-card card creative-card" onclick="showPage('planner')">
      <div class="class-art">🎨</div><div class="class-name">PLANNER</div>
      <div class="note">tasks, notes, upcoming assignments & reminders</div>
      <button class="btn card-button">open planner →</button>
    </div>
  `;
}

function renderSchool(){
  const all = Object.values(state.classes).flatMap(c=>c.assignments);
  const p = pct(all);
  document.getElementById("overallBar").style.width = p+"%";
  document.getElementById("overallPct").textContent = p+"%";
  document.getElementById("overallText").textContent = `${all.filter(x=>x.done).length} of ${all.length} assignments complete`;
  document.getElementById("classCount").textContent = Object.keys(state.classes).length;

  const grid = document.getElementById("classGrid");
  if(!Object.keys(state.classes).length){
    grid.innerHTML = `<div class="card empty">No classes yet ♡<br><br><button class="btn" onclick="openClassModal()">+ create your first class</button></div>`;
    return;
  }
  grid.innerHTML = Object.entries(state.classes).map(([name,c])=>{
    const cp = pct(c.assignments);
    return `
      <div class="class-card card" style="cursor:pointer" onclick="openClass(${JSON.stringify(name)})">
        <div class="class-art" style="background:${esc(c.color||"#dcecf7")}">${esc(c.art||"📚")}</div>
        <div class="class-name">${esc(name)}</div>
        <div class="note">${esc(c.desc)}</div>
        <div class="mini-progress"><i style="width:${cp}%"></i></div>
        <div class="meta"><span>${c.assignments.filter(x=>x.done).length}/${c.assignments.length} complete</span><b>${cp}%</b></div>
        <button class="btn card-button">view assignments →</button>
      </div>`;
  }).join("");
}

function openClass(name){
  currentClass = name;
  document.getElementById("classTitle").textContent = name;
  document.getElementById("classDescription").textContent = state.classes[name]?.desc || "";
  assignmentFilter = "all";
  document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter==="all"));
  renderClass();
  showPage("classPage");
}

function renderClass(){
  if(!state.classes[currentClass]) return;
  const c = state.classes[currentClass];
  const p = pct(c.assignments);
  document.getElementById("classBar").style.width = p+"%";
  document.getElementById("classPct").textContent = p+"% complete";

  let items = c.assignments;
  if(assignmentFilter==="open") items = items.filter(x=>!x.done);
  if(assignmentFilter==="done") items = items.filter(x=>x.done);

  const list = document.getElementById("assignmentList");
  if(!items.length){
    list.innerHTML = `<div class="card empty">nothing here ♡</div>`;
    return;
  }

  list.innerHTML = items.map(a=>{
    const realIndex = c.assignments.findIndex(x=>x.id===a.id);
    return `
      <div class="assignment ${a.done?"done":""}">
        <input class="check" type="checkbox" ${a.done?"checked":""} onchange="toggleAssignment('${esc(a.id)}')">
        <div>
          <div class="assignment-title">${esc(a.title)}</div>
          <div class="due">due ${esc(a.due||"—")}</div>
        </div>
        <span class="tag ${a.done?"up":""}">${esc(a.type)}</span>
        <div class="assignment-actions">
          <button class="icon-btn" title="edit" onclick="openAssignmentModal('${esc(a.id)}')">✎</button>
          <button class="icon-btn" title="delete" onclick="deleteAssignment('${esc(a.id)}')">×</button>
        </div>
      </div>`;
  }).join("");
}

function setAssignmentFilter(filter,button){
  assignmentFilter=filter;
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  button.classList.add("active");
  renderClass();
}

function toggleAssignment(id){
  const a = state.classes[currentClass].assignments.find(x=>x.id===id);
  if(a) a.done=!a.done;
  saveState(); renderClass(); renderSchool(); renderUpcoming(); renderPlanner();
}

function deleteAssignment(id){
  if(!confirm("Delete this assignment?")) return;
  state.classes[currentClass].assignments = state.classes[currentClass].assignments.filter(x=>x.id!==id);
  saveState(); renderClass(); renderSchool(); renderUpcoming(); renderPlanner();
}

function deleteCurrentClass(){
  if(!currentClass || !state.classes[currentClass]) return;
  if(!confirm(`Delete "${currentClass}" and all its assignments?`)) return;
  delete state.classes[currentClass];
  currentClass = Object.keys(state.classes)[0] || "";
  saveState(); renderSchool();
}

function renderLife(){
  document.querySelectorAll(".life-text").forEach(el=>{
    const key=el.dataset.life;
    if(el.value !== state.life[key]) el.value=state.life[key]||"";
    el.oninput=()=>{state.life[key]=el.value;saveState();};
  });
  renderGoals();
  renderEvents();
}

function renderGoals(){
  const box=document.getElementById("goalList");
  box.innerHTML=state.goals.length ? state.goals.map(g=>`
    <div class="todo-row">
      <input type="checkbox" ${g.done?"checked":""} onchange="toggleGoal('${g.id}')">
      <span class="${g.done?"todo-done":""}">${esc(g.text)}</span>
      <button class="icon-btn" onclick="deleteGoal('${g.id}')">×</button>
    </div>
  `).join("") : `<div class="note">add your first goal ♡</div>`;
}

function toggleGoal(id){
  const g=state.goals.find(x=>x.id===id); if(g) g.done=!g.done;
  saveState(); renderGoals();
}

function deleteGoal(id){
  state.goals=state.goals.filter(x=>x.id!==id); saveState(); renderGoals();
}

function renderEvents(){
  const box=document.getElementById("eventList");
  const events=[...state.events].sort((a,b)=>a.date.localeCompare(b.date));
  box.innerHTML=events.length ? events.map((e,i)=>`
    <div class="event-row">
      <div><b>${esc(e.title)}</b><div class="note">${esc(e.date)}${e.note?" • "+esc(e.note):""}</div></div>
      <button class="icon-btn" onclick="deleteEvent('${e.id}')">×</button>
    </div>
  `).join("") : `<div class="empty">no events yet ♡</div>`;
}

function deleteEvent(id){
  state.events=state.events.filter(x=>x.id!==id); saveState(); renderEvents(); renderCalendar(); renderUpcoming();
}

function renderCalendar(){
  const now=new Date();
  const y=now.getFullYear(), m=now.getMonth();
  document.getElementById("calendarMonth").textContent=now.toLocaleString("en-US",{month:"long",year:"numeric"}).toUpperCase();
  const first=new Date(y,m,1).getDay();
  const days=new Date(y,m+1,0).getDate();
  const today=now.getDate();
  let html=["S","M","T","W","T","F","S"].map(d=>`<b>${d}</b>`).join("");
  for(let i=0;i<first;i++) html+="<span></span>";
  for(let d=1;d<=days;d++){
    const key=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const has=state.events.some(e=>e.date===key);
    html+=`<span class="${d===today?"today":""} ${has?"event-day":""}" title="${has?"has event":""}">${d}</span>`;
  }
  document.getElementById("calendar").innerHTML=html;
}

function renderUpcoming(){
  const assignments=[];
  Object.entries(state.classes).forEach(([name,c])=>c.assignments.filter(a=>!a.done).forEach(a=>assignments.push({...a,className:name})));
  const events=state.events.filter(e=>e.date).map(e=>({...e,isEvent:true}));
  const box=document.getElementById("upNext");
  const items=[...events,...assignments].sort((a,b)=>String(a.date||a.due).localeCompare(String(b.date||b.due))).slice(0,6);
  box.innerHTML=items.length ? items.map(x=>x.isEvent
    ? `<div class="assignment-summary"><span>📅 <b>${esc(x.title)}</b><div class="note">${esc(x.date)}</div></span><span>event</span></div>`
    : `<div class="assignment-summary"><span>📝 <b>${esc(x.title)}</b><div class="note">${esc(x.className)} • ${esc(x.due)}</div></span><span>${esc(x.type)}</span></div>`
  ).join("") : `<div class="empty">you're all caught up ♡</div>`;
}

function renderPlanner(){
  document.getElementById("quickNote").value=state.quickNote||"";
  const todoBox=document.getElementById("plannerTodos");
  todoBox.innerHTML=state.todos.length ? state.todos.map(t=>`
    <div class="planner-item">
      <input type="checkbox" ${t.done?"checked":""} onchange="toggleTodo('${t.id}')">
      <span class="${t.done?"todo-done":""}">${esc(t.text)}</span>
      <button class="icon-btn" onclick="deleteTodo('${t.id}')">×</button>
    </div>
  `).join("") : `<div class="empty">no tasks yet ♡</div>`;

  const assignments=[];
  Object.entries(state.classes).forEach(([name,c])=>c.assignments.filter(a=>!a.done).forEach(a=>assignments.push({...a,className:name})));
  document.getElementById("plannerAssignments").innerHTML=assignments.length
    ? assignments.sort((a,b)=>a.due.localeCompare(b.due)).map(a=>`<div class="assignment-summary"><span><b>${esc(a.title)}</b><div class="note">${esc(a.className)} • due ${esc(a.due)}</div></span><span>${esc(a.type)}</span></div>`).join("")
    : `<div class="empty">all assignments are complete ♡</div>`;
}

function saveQuickNote(){
  state.quickNote=document.getElementById("quickNote").value;
  saveState();
}

function toggleTodo(id){
  const t=state.todos.find(x=>x.id===id); if(t)t.done=!t.done;
  saveState();renderPlanner();
}
function deleteTodo(id){state.todos=state.todos.filter(x=>x.id!==id);saveState();renderPlanner();}

function updateClock(){
  const now=new Date();
  document.getElementById("clock").textContent=now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
  document.getElementById("dateText").textContent=now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}).toLowerCase();
}
function updateBirthday(){
  const now=new Date();
  let b=new Date(now.getFullYear(),Number(state.settings.birthdayMonth),Number(state.settings.birthdayDay));
  if(b<now)b=new Date(now.getFullYear()+1,Number(state.settings.birthdayMonth),Number(state.settings.birthdayDay));
  const days=Math.ceil((b-now)/(86400000));
  document.getElementById("birthdayDays").textContent=days;
  document.getElementById("birthdayText").textContent=`${b.toLocaleString("en-US",{month:"long"})} ${b.getDate()} • birthday countdown`;
}

function openModal(html){
  document.getElementById("modalContent").innerHTML=html;
  document.getElementById("modalBackdrop").classList.remove("hidden");
}
function closeModal(e){
  if(e && e.target!==document.getElementById("modalBackdrop")) return;
  document.getElementById("modalBackdrop").classList.add("hidden");
}
function closeModalNow(){document.getElementById("modalBackdrop").classList.add("hidden");}

function openSettings(){
  const s=state.settings;
  openModal(`
    <h2>Customize your website ♡</h2>
    <div class="settings-section">
      <div class="form-grid">
        <div class="form-field"><label>SITE NAME</label><input id="setTitle" value="${esc(s.title)}"></div>
        <div class="form-field"><label>SUBTITLE</label><input id="setSubtitle" value="${esc(s.subtitle)}"></div>
        <div class="form-field"><label>BIRTHDAY MONTH</label><select id="setMonth">${Array.from({length:12},(_,i)=>`<option value="${i}" ${i==s.birthdayMonth?"selected":""}>${new Date(2020,i,1).toLocaleString("en-US",{month:"long"})}</option>`).join("")}</select></div>
        <div class="form-field"><label>BIRTHDAY DAY</label><input id="setDay" type="number" min="1" max="31" value="${s.birthdayDay}"></div>
        <div class="form-field full"><label>HOME QUOTE</label><input id="setQuote" value="${esc(s.quote)}"></div>
      </div>
    </div>
    <div class="settings-section">
      <label class="note">ACCENT COLOR</label>
      <div class="color-row" style="margin-top:8px">
        ${["#d98bab","#e58aab","#b98acb","#86b6d8","#8dbd83","#d5a35c","#a57a66"].map(c=>`<button class="swatch ${s.accent===c?"selected":""}" style="background:${c}" onclick="chooseAccent('${c}',this)"></button>`).join("")}
      </div>
      <input id="customAccent" type="color" value="${esc(s.accent)}" style="margin-top:10px">
    </div>
    <div class="modal-actions"><button class="btn" onclick="closeModalNow()">cancel</button><button class="btn" onclick="saveSettings()">save changes ♡</button></div>
  `);
}

function chooseAccent(c,el){
  state.settings.accent=c;
  document.querySelectorAll(".swatch").forEach(x=>x.classList.remove("selected"));
  el.classList.add("selected");
  document.documentElement.style.setProperty("--accent",c);
  document.getElementById("customAccent").value=c;
}
function saveSettings(){
  state.settings.title=document.getElementById("setTitle").value.trim()||"maddison's stuff";
  state.settings.subtitle=document.getElementById("setSubtitle").value.trim();
  state.settings.birthdayMonth=Number(document.getElementById("setMonth").value);
  state.settings.birthdayDay=Math.max(1,Math.min(31,Number(document.getElementById("setDay").value)||11));
  state.settings.quote=document.getElementById("setQuote").value.trim()||"make it cute, make it useful.";
  state.settings.accent=document.getElementById("customAccent").value;
  saveState(); updateBirthday(); renderHome(); closeModalNow();
}

function openClassModal(name=currentClass){
  const editing=!!(name && state.classes[name]);
  const c=editing?state.classes[name]:{art:"📚",color:"#dcecf7",desc:""};
  openModal(`
    <h2>${editing?"Edit class":"Create a class"} ♡</h2>
    <div class="form-grid">
      <div class="form-field full"><label>CLASS NAME</label><input id="classNameInput" value="${esc(name||"")}"></div>
      <div class="form-field"><label>ICON / EMOJI</label><input id="classArtInput" value="${esc(c.art)}"></div>
      <div class="form-field"><label>CARD COLOR</label><input id="classColorInput" type="color" value="${esc(c.color||"#dcecf7")}"></div>
      <div class="form-field full"><label>DESCRIPTION</label><input id="classDescInput" value="${esc(c.desc)}"></div>
    </div>
    <div class="modal-actions"><button class="btn" onclick="closeModalNow()">cancel</button><button class="btn" onclick="saveClass(${JSON.stringify(name||"")})">save class ♡</button></div>
  `);
}
function saveClass(oldName){
  const name=document.getElementById("classNameInput").value.trim();
  if(!name){alert("Give the class a name ♡");return;}
  const art=document.getElementById("classArtInput").value.trim()||"📚";
  const color=document.getElementById("classColorInput").value;
  const desc=document.getElementById("classDescInput").value.trim();
  if(oldName && oldName!==name && state.classes[oldName]){
    state.classes[name]={...state.classes[oldName],art,color,desc};
    delete state.classes[oldName];
    if(currentClass===oldName)currentClass=name;
  }else if(state.classes[name]){
    state.classes[name]={...state.classes[name],art,color,desc};
  }else{
    state.classes[name]={art,color,desc,assignments:[]};
    currentClass=name;
  }
  saveState();renderSchool();closeModalNow();
}

function openAssignmentModal(id=null){
  const existing=id?state.classes[currentClass].assignments.find(a=>a.id===id):null;
  openModal(`
    <h2>${existing?"Edit assignment":"Add assignment"} ♡</h2>
    <div class="form-grid">
      <div class="form-field full"><label>NAME</label><input id="assignmentTitleInput" value="${esc(existing?.title||"")}"></div>
      <div class="form-field"><label>DUE</label><input id="assignmentDueInput" value="${esc(existing?.due||"")}"></div>
      <div class="form-field"><label>TYPE</label><select id="assignmentTypeInput">${["assignment","test","project","quiz"].map(t=>`<option ${existing?.type===t?"selected":""}>${t}</option>`).join("")}</select></div>
    </div>
    <div class="modal-actions"><button class="btn" onclick="closeModalNow()">cancel</button><button class="btn" onclick="saveAssignment(${JSON.stringify(id)})">save ♡</button></div>
  `);
}
function saveAssignment(id){
  const title=document.getElementById("assignmentTitleInput").value.trim();
  if(!title){alert("Give the assignment a name ♡");return;}
  const due=document.getElementById("assignmentDueInput").value.trim()||"TBD";
  const type=document.getElementById("assignmentTypeInput").value;
  if(id){
    const a=state.classes[currentClass].assignments.find(x=>x.id===id);
    Object.assign(a,{title,due,type});
  }else{
    state.classes[currentClass].assignments.push({id:crypto.randomUUID(),title,due,type,done:false});
  }
  saveState();renderClass();renderSchool();renderUpcoming();renderPlanner();closeModalNow();
}

function openGoalModal(){
  openModal(`<h2>Add a goal ♡</h2><div class="form-field"><label>GOAL</label><input id="goalInput" placeholder="something you want to accomplish..."></div><div class="modal-actions"><button class="btn" onclick="closeModalNow()">cancel</button><button class="btn" onclick="saveGoal()">add goal</button></div>`);
}
function saveGoal(){
  const text=document.getElementById("goalInput").value.trim();if(!text)return;
  state.goals.push({id:crypto.randomUUID(),text,done:false});saveState();renderGoals();closeModalNow();
}

function openLinkModal(){
  openModal(`<h2>Add a quick link ♡</h2><div class="form-grid"><div class="form-field"><label>NAME</label><input id="linkName"></div><div class="form-field"><label>URL</label><input id="linkUrl" placeholder="https://..."></div></div><div class="modal-actions"><button class="btn" onclick="closeModalNow()">cancel</button><button class="btn" onclick="saveLink()">add link</button></div>`);
}
function saveLink(){
  const name=document.getElementById("linkName").value.trim(),url=document.getElementById("linkUrl").value.trim();
  if(!name||!url)return;
  state.links.push({name,url});saveState();renderLinks();closeModalNow();
}
function deleteLink(i){state.links.splice(i,1);saveState();renderLinks();}

function openEventModal(){
  openModal(`<h2>Add an event ♡</h2><div class="form-grid"><div class="form-field"><label>EVENT</label><input id="eventTitle"></div><div class="form-field"><label>DATE</label><input id="eventDate" type="date"></div><div class="form-field full"><label>NOTE</label><input id="eventNote"></div></div><div class="modal-actions"><button class="btn" onclick="closeModalNow()">cancel</button><button class="btn" onclick="saveEvent()">add event</button></div>`);
}
function saveEvent(){
  const title=document.getElementById("eventTitle").value.trim(),date=document.getElementById("eventDate").value,note=document.getElementById("eventNote").value.trim();
  if(!title||!date)return;
  state.events.push({id:crypto.randomUUID(),title,date,note});saveState();renderEvents();renderCalendar();renderUpcoming();closeModalNow();
}

function openTodoModal(){
  openModal(`<h2>Add a planner task ♡</h2><div class="form-field"><label>TASK</label><input id="todoInput"></div><div class="modal-actions"><button class="btn" onclick="closeModalNow()">cancel</button><button class="btn" onclick="saveTodo()">add task</button></div>`);
}
function saveTodo(){
  const text=document.getElementById("todoInput").value.trim();if(!text)return;
  state.todos.push({id:crypto.randomUUID(),text,done:false});saveState();renderPlanner();closeModalNow();
}

function exportData(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="maddisons-stuff-backup.json";a.click();
  URL.revokeObjectURL(url);
}
document.getElementById("importFile").addEventListener("change",e=>{
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      state=JSON.parse(reader.result);
      saveState();currentClass=Object.keys(state.classes)[0]||"";
      renderAll();alert("Backup imported ♡");
    }catch(err){alert("That backup file could not be read.");}
  };
  reader.readAsText(file);
});

function renderAll(){
  applySettings();renderHome();renderSchool();renderLife();renderPlanner();updateClock();updateBirthday();
}

renderAll();
setInterval(updateClock,30000);
setInterval(updateBirthday,3600000);
