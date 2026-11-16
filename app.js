const $=id=>document.getElementById(id);
const localDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today=new Date(), todayKey=localDate(today);
$('today').textContent=today.toLocaleDateString('id-ID',{day:'numeric',month:'short'});
const KEY='fittrack-v1';
const monday=new Date(today); monday.setDate(today.getDate()-((today.getDay()+6)%7)); const weekKey=localDate(monday);
const defaults={foods:[],foodDay:todayKey,weights:[{date:localDate(new Date(today.getTime()-604800000)),value:90}],workouts:{},measurements:[]};
let data; try{data={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{data={...defaults}}
if(data.foodDay!==todayKey){data.foods=[];data.foodDay=todayKey}
const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
const week=[['Senin','Lower body A','Goblet squat • RDL • Reverse lunge'],['Selasa','Kardio','Jalan cepat 25–30 menit'],['Rabu','Upper body + core','Dumbbell row • Shoulder press • Plank'],['Kamis','Kardio','Jalan cepat atau sepeda statis'],['Jumat','Lower body B','Glute bridge • Sumo squat • RDL'],['Sabtu','Kardio ringan','Jalan santai hingga cepat'],['Minggu','Pemulihan','Istirahat dan mobilitas ringan']];
function renderWorkouts(){
 $('workoutList').innerHTML=week.map(([day,name,desc])=>{const k=weekKey+'-'+day;return `<label class="workout ${data.workouts[k]?'done':''}"><input type="checkbox" data-key="${k}" ${data.workouts[k]?'checked':''}><div><b>${day} — ${name}</b><small>${desc}</small></div></label>`}).join('');
 document.querySelectorAll('.workout input').forEach(x=>x.onchange=()=>{data.workouts[x.dataset.key]=x.checked;save();renderWorkouts()});
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderFoods(){
 const c=data.foods.reduce((s,x)=>s+x.cal,0),p=data.foods.reduce((s,x)=>s+x.pro,0);
 $('calorieTotal').textContent=c.toLocaleString('id-ID'); $('proteinTotal').textContent=`${p} / 150 g`;
 $('calorieRemaining').textContent=`${Math.max(0,2100-c).toLocaleString('id-ID')} kkal`;
 $('proteinBar').style.width=Math.min(100,p/150*100)+'%';
 $('calorieRing').style.background=`conic-gradient(var(--lime) ${Math.min(100,c/2100*100)*3.6}deg,#2b394d 0deg)`;
 $('foodList').innerHTML=data.foods.map((x,i)=>`<li><span>${esc(x.name)}</span><span>${x.cal} kkal • ${x.pro} g <button data-del="${i}" aria-label="Hapus">×</button></span></li>`).join('');
 document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{data.foods.splice(+b.dataset.del,1);save();renderFoods()});
}
$('foodForm').onsubmit=e=>{e.preventDefault();data.foods.push({name:$('foodName').value,cal:+$('foodCalories').value,pro:+$('foodProtein').value});save();e.target.reset();renderFoods()};
function renderWeights(){
 const a=data.weights.slice(-8),vals=a.map(x=>x.value),min=Math.min(65,...vals),max=Math.max(95,...vals);
 $('currentWeight').innerHTML=`${(data.weights.at(-1)?.value||90).toFixed(1)} <small>kg</small>`;
 $('weightChart').innerHTML=a.map(x=>`<div class="chart-col"><b style="font-size:9px">${x.value}</b><i style="height:${Math.max(5,(x.value-min)/(max-min||1)*100)}%"></i><small>${new Date(x.date+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short'})}</small></div>`).join('');
}
$('weightForm').onsubmit=e=>{e.preventDefault();data.weights.push({date:todayKey,value:+$('weightInput').value});data.weights.sort((a,b)=>a.date.localeCompare(b.date));save();e.target.reset();renderWeights()};
$('measureForm').onsubmit=e=>{e.preventDefault();const m={date:todayKey,thigh:+$('thighInput').value||null,waist:+$('waistInput').value||null};data.measurements.push(m);save();$('measureSummary').textContent=`${m.date}: Lingkar paha ${m.thigh??'—'} cm • Pinggang ${m.waist??'—'} cm`;e.target.reset()};
renderWorkouts();renderFoods();renderWeights();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
