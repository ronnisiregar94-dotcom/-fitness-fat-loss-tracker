const $=id=>document.getElementById(id);
const localDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today=new Date(), todayKey=localDate(today);
$('today').textContent=today.toLocaleDateString('id-ID',{day:'numeric',month:'short'});
const KEY='fittrack-v1';
const monday=new Date(today); monday.setDate(today.getDate()-((today.getDay()+6)%7)); const weekKey=localDate(monday);
const defaults={foods:[],foodDay:todayKey,weights:[{date:localDate(new Date(today.getTime()-604800000)),value:90}],workouts:{},measurements:[],runs:[]};
let data; try{data={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{data={...defaults}}
if(data.foodDay!==todayKey){data.foods=[];data.foodDay=todayKey}
if(!Array.isArray(data.runs))data.runs=[];
const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
const week=[['Senin','Lower body A','Goblet squat • RDL • Reverse lunge'],['Selasa','Kardio','Jalan cepat 25–30 menit'],['Rabu','Upper body + core','Dumbbell row • Shoulder press • Plank'],['Kamis','Kardio','Jalan cepat atau sepeda statis'],['Jumat','Lower body B','Glute bridge • Sumo squat • RDL'],['Sabtu','Kardio ringan','Jalan santai hingga cepat'],['Minggu','Pemulihan','Istirahat dan mobilitas ringan']];
const programPlans={
 fatloss:week,
 '5k':[['Senin','Lari mudah','Lari santai 20–25 menit'],['Selasa','Kekuatan','Latihan kaki dan core 20 menit'],['Rabu','Interval ringan','Lari 1 menit • jalan 2 menit, ulang 6 kali'],['Kamis','Pemulihan','Jalan santai dan peregangan'],['Jumat','Lari mudah','Lari santai 25–30 menit'],['Sabtu','Jalan aktif','Jalan cepat 30 menit'],['Minggu','Istirahat','Pemulihan penuh']],
 '10k':[['Senin','Lari mudah','Lari santai 25–30 menit'],['Selasa','Kekuatan','Latihan kaki dan core 25 menit'],['Rabu','Tempo ringan','Lari nyaman agak cepat 15–20 menit'],['Kamis','Pemulihan','Jalan santai dan peregangan'],['Jumat','Lari mudah','Lari santai 30–35 menit'],['Sabtu','Lari jarak panjang','Lari mudah 40–50 menit sesuai kemampuan'],['Minggu','Istirahat','Pemulihan penuh']],
 steps:[['Senin','Target langkah','Capai 8.000 langkah'],['Selasa','Jalan aktif','Capai 8.000 langkah'],['Rabu','Jalan aktif','Capai 9.000 langkah'],['Kamis','Jalan aktif','Capai 8.000 langkah'],['Jumat','Jalan aktif','Capai 9.000 langkah'],['Sabtu','Jalan panjang','Capai 10.000 langkah'],['Minggu','Pemulihan','Jalan santai sesuai kondisi']]
};
function renderWorkouts(){
 const plan=programPlans[data.program]||week;
 $('workoutList').innerHTML=plan.map(([day,name,desc])=>{const k=weekKey+'-'+day;return `<label class="workout ${data.workouts[k]?'done':''}"><input type="checkbox" data-key="${k}" ${data.workouts[k]?'checked':''}><div><b>${day} — ${name}</b><small>${desc}</small></div></label>`}).join('');
 document.querySelectorAll('.workout input').forEach(x=>x.onchange=()=>{data.workouts[x.dataset.key]=x.checked;save();renderWorkouts()});
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function weightNow(){return data.weights.at(-1)?.value||90}
function renderFoods(){
 const c=data.foods.reduce((s,x)=>s+x.cal,0),p=data.foods.reduce((s,x)=>s+x.pro,0);
 const burned=data.runs.filter(x=>x.date===todayKey).reduce((s,x)=>s+(x.calories||0),0);
 $('calorieTotal').textContent=c.toLocaleString('id-ID'); $('proteinTotal').textContent=`${p} / 150 g`;
 $('calorieRemaining').textContent=`${Math.max(0,2100-c).toLocaleString('id-ID')} kkal`;
 $('exerciseCalories').textContent=`${Math.round(burned).toLocaleString('id-ID')} kkal`;
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
const run={target:5,distance:0,seconds:0,calories:0,watch:null,last:null,active:false,paused:false,startedAt:null,lastTick:0};
let runTimer=null;
function fmtTime(s){const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;return [h,m,sec].map(n=>String(n).padStart(2,'0')).join(':')}
function activeCalories(km,seconds,kg){
 if(km<=0||seconds<=0)return 0;
 const speed=km/(seconds/3600);
 const met=speed<6?6:speed<8?8.3:speed<10?9.8:speed<12?11:11.8;
 return Math.round(Math.max(0,(met-1)*3.5*kg/200*(seconds/60)));
}
function renderRun(){
 const km=run.distance/1000,pace=km>0&&run.seconds>0?Math.round(run.seconds/km):0,speed=run.seconds>0?km/(run.seconds/3600):0;
 $('runDistance').textContent=km.toFixed(2);$('runProgress').textContent=`${Math.min(100,km/run.target*100).toFixed(0)}% dari target ${run.target} km`;
 $('runProgressBar').style.width=Math.min(100,km/run.target*100)+'%';$('runTime').textContent=fmtTime(run.seconds);
 $('runPace').textContent=pace? `${String(Math.floor(pace/60)).padStart(2,'0')}:${String(pace%60).padStart(2,'0')} /km`:'--:-- /km';
 $('runSpeed').textContent=`${speed.toFixed(1)} km/j`;$('runCalories').textContent=`${activeCalories(km,run.seconds,weightNow())} kkal`;
}
function setGps(s){$('gpsStatus').textContent=s}
function positionError(err){setGps('GPS bermasalah');$('gpsAccuracy').textContent=err.code===1?'Izin lokasi ditolak. Aktifkan izin lokasi untuk browser di pengaturan HP.':err.code===2?'Sinyal lokasi belum tersedia. Coba di area terbuka.':'GPS terlalu lama merespons. Pastikan lokasi HP aktif.'}
function onPosition(pos){
 const c=pos.coords,acc=c.accuracy||999;
 $('gpsAccuracy').textContent=`Akurasi GPS ±${Math.round(acc)} meter`;
 if(acc>35){setGps('Mencari GPS akurat…');return}
 setGps('GPS terkunci');
 const point={lat:c.latitude,lon:c.longitude,t:pos.timestamp,acc};
 if(run.last){
  const rad=x=>x*Math.PI/180,R=6371000;
  const dLat=rad(point.lat-run.last.lat),dLon=rad(point.lon-run.last.lon);
  const a=Math.sin(dLat/2)**2+Math.cos(rad(run.last.lat))*Math.cos(rad(point.lat))*Math.sin(dLon/2)**2;
  const meters=2*R*Math.asin(Math.sqrt(a)),dt=(point.t-run.last.t)/1000,ms=dt>0?meters/dt:Infinity;
  if(meters>=2&&dt>0&&ms<=7.0)run.distance+=meters;
  if(meters<2&&dt>0){} 
 }
 run.last=point;renderRun();
 if(run.distance/1000>=run.target){pauseRun();setGps('Target tercapai');$('gpsAccuracy').textContent='Target jarak tercapai. Tekan Selesai untuk menyimpan hasil.'}
}
function startWatch(){
 if(!navigator.geolocation){setGps('GPS tidak didukung');return}
 run.active=true;run.paused=false;run.last=null;run.lastTick=Date.now();
 $('startRun').disabled=true;$('pauseRun').disabled=false;$('finishRun').disabled=false;setGps('Mencari sinyal GPS…');
 run.watch=navigator.geolocation.watchPosition(onPosition,positionError,{enableHighAccuracy:true,maximumAge:0,timeout:20000});
 runTimer=setInterval(()=>{if(run.active){const now=Date.now();run.seconds+=Math.max(0,Math.round((now-run.lastTick)/1000));run.lastTick=now;renderRun()}},1000);
}
function pauseRun(){
 if(!run.active)return;
 run.active=false;run.paused=true;if(run.watch!==null)navigator.geolocation.clearWatch(run.watch);run.watch=null;
 if(runTimer)clearInterval(runTimer);runTimer=null;run.last=null;$('startRun').disabled=false;$('startRun').textContent='Lanjutkan';$('pauseRun').disabled=true;setGps('Dijeda');
}
$('startRun').onclick=()=>{
 if(!window.isSecureContext){setGps('Butuh koneksi HTTPS');$('gpsAccuracy').textContent='Buka aplikasi melalui alamat GitHub Pages HTTPS.';return}
 if(!navigator.geolocation){setGps('GPS tidak didukung');return}
 if(!run.active&&!run.paused){run.distance=0;run.seconds=0;run.last=null;$('startRun').textContent='Lanjutkan';}
 startWatch();
};
$('pauseRun').onclick=pauseRun;
$('finishRun').onclick=()=>{
 if(run.active)pauseRun();
 if(run.distance<20&&run.seconds<30){setGps('Sesi terlalu singkat');return}
 const km=run.distance/1000,cal=activeCalories(km,run.seconds,weightNow());
 data.runs.unshift({date:todayKey,distance:+km.toFixed(3),seconds:run.seconds,calories:cal,pace:km>0?Math.round(run.seconds/km):0,target:run.target});
 save();renderRunHistory();renderFoods();resetRun();setGps('Lari tersimpan');
};
function resetRun(){run.distance=0;run.seconds=0;run.last=null;run.paused=false;run.active=false;$('startRun').textContent='Mulai lari';$('startRun').disabled=false;$('pauseRun').disabled=true;$('finishRun').disabled=true;renderRun()}
function renderRunHistory(){
 $('runHistory').innerHTML=data.runs.slice(0,8).map(x=>`<li><span>${new Date(x.date+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short'})} • ${x.distance.toFixed(2)} km</span><span>${fmtTime(x.seconds)} • ${x.calories} kkal</span></li>`).join('')||'<li>Belum ada aktivitas lari.</li>';
}
document.querySelectorAll('.target-btn').forEach(b=>b.onclick=()=>{if(run.active||run.paused)return;run.target=+b.dataset.target;document.querySelectorAll('.target-btn').forEach(x=>x.classList.toggle('selected',x===b));renderRun()});

/* Program selector */
const programDescriptions={fatloss:'Program kombinasi latihan beban, kardio, nutrisi, dan pemantauan berat badan.','5k':'Program fokus membangun daya tahan untuk mencapai target lari 5 KM.','10k':'Program bertahap untuk meningkatkan daya tahan menuju target lari 10 KM.',steps:'Program meningkatkan aktivitas harian melalui target langkah dan pemantauan tren.'};
const programSelect=$('programSelect');
programSelect.value=data.program||'fatloss';
$('programDescription').textContent=programDescriptions[programSelect.value];
programSelect.onchange=()=>{data.program=programSelect.value;save();$('programDescription').textContent=programDescriptions[data.program];renderWorkouts()};
if(!data.program)data.program='fatloss';

/* Daily step counter: motion sensor while page is active + manual health-app entry */
if(!data.stepLogs||typeof data.stepLogs!=='object')data.stepLogs={};
const STEP_GOAL=8000;
let stepActive=false,lastStepAt=0,stepListener=null,lastMagnitude=0,stepArmed=true;
function stepToday(){return data.stepLogs[todayKey]||0}
function setSteps(n){data.stepLogs[todayKey]=Math.max(0,Math.round(n));save();renderSteps()}
function renderSteps(){
 const n=stepToday();$('stepsToday').textContent=n.toLocaleString('id-ID');
 $('stepsProgressBar').style.width=Math.min(100,n/STEP_GOAL*100)+'%';
 $('stepsGoalText').textContent=n>=STEP_GOAL?'Target 8.000 langkah tercapai!':`Target 8.000 langkah • kurang ${(STEP_GOAL-n).toLocaleString('id-ID')} langkah`;
 const vals=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const key=localDate(d);vals.push({key,label:d.toLocaleDateString('id-ID',{weekday:'short'}),n:data.stepLogs[key]||0})}
 const max=Math.max(STEP_GOAL,...vals.map(x=>x.n),1);
 $('stepsChart').innerHTML=vals.map(x=>`<div class="steps-col"><b>${x.n?x.n.toLocaleString('id-ID'):''}</b><i style="height:${Math.max(3,x.n/max*100)}%"></i><small>${x.label}</small></div>`).join('');
 const avg=Math.round(vals.reduce((s,x)=>s+x.n,0)/7);
 $('stepsAverage').textContent=`Rata-rata ${avg.toLocaleString('id-ID')}/hari`;
}
function countStep(){
 const now=Date.now();if(now-lastStepAt<320||!stepArmed)return;
 lastStepAt=now;stepArmed=false;setSteps(stepToday()+1);
}
function motionHandler(e){
 const a=e.accelerationIncludingGravity||e.acceleration;if(!a)return;
 const mag=Math.sqrt((a.x||0)**2+(a.y||0)**2+(a.z||0)**2);
 const delta=Math.abs(mag-lastMagnitude);lastMagnitude=mag;
 if(delta>1.15&&delta<15)countStep();
 if(delta<0.35&&Date.now()-lastStepAt>250)stepArmed=true;
 if(Date.now()-lastStepAt>500)stepArmed=true;
}
async function startStepSensor(){
 if(!('DeviceMotionEvent'in window)){$('stepSensorStatus').textContent='Sensor tidak tersedia';return}
 try{
  if(typeof DeviceMotionEvent.requestPermission==='function'){
   const permission=await DeviceMotionEvent.requestPermission();
   if(permission!=='granted')throw new Error('Izin sensor ditolak');
  }
  if(stepListener)window.removeEventListener('devicemotion',stepListener);
  stepListener=motionHandler;window.addEventListener('devicemotion',stepListener);
  stepActive=true;$('startSteps').disabled=true;$('stopSteps').disabled=false;
  $('stepSensorStatus').textContent='Sensor aktif';
 }catch(err){$('stepSensorStatus').textContent='Izin diperlukan';$('stepsGoalText').textContent=err.message||'Izinkan akses sensor gerak pada perangkat.'}
}
function stopStepSensor(){
 if(stepListener)window.removeEventListener('devicemotion',stepListener);
 stepListener=null;stepActive=false;$('startSteps').disabled=false;$('stopSteps').disabled=true;
 $('stepSensorStatus').textContent='Dijeda';
}
$('startSteps').onclick=startStepSensor;$('stopSteps').onclick=stopStepSensor;
$('manualStepsForm').onsubmit=e=>{e.preventDefault();const add=Number($('manualSteps').value);if(Number.isFinite(add)&&add>0)setSteps(stepToday()+add);e.target.reset()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&stepActive)stopStepSensor()});
renderSteps();

renderWorkouts();renderFoods();renderWeights();renderRun();renderRunHistory();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
