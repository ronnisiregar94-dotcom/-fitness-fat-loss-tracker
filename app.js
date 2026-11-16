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
function positionError(err){
 const messages={1:'Izin lokasi ditolak. Aktifkan izin lokasi untuk Chrome: Pengaturan HP → Aplikasi → Chrome → Izin → Lokasi. Pilih Izinkan saat aplikasi digunakan.',2:'Lokasi belum ditemukan. Aktifkan Lokasi/GPS HP, pilih akurasi tinggi, lalu coba di area terbuka.',3:'GPS belum merespons. Tunggu di area terbuka, pastikan mode hemat baterai tidak membatasi lokasi, lalu coba lagi.'};
 setGps('GPS bermasalah');$('gpsAccuracy').textContent=messages[err.code]||'Gagal membaca GPS. Periksa pengaturan lokasi HP.';
 if(run.active){run.active=false;if(run.watch!==null)navigator.geolocation.clearWatch(run.watch);run.watch=null;if(runTimer)clearInterval(runTimer);runTimer=null;$('startRun').disabled=false;$('pauseRun').disabled=true;$('startRun').textContent='Coba lagi';}
}
function onPosition(pos){
 if(!run.active)return;
 const c=pos.coords,acc=c.accuracy||999;
 $('gpsAccuracy').textContent=`Akurasi GPS ±${Math.round(acc)} meter`;
 if(acc>75){setGps('Menunggu sinyal GPS lebih baik…');return}
 setGps('GPS aktif • merekam');
 const point={lat:c.latitude,lon:c.longitude,t:pos.timestamp,acc};
 if(run.last){
  const rad=x=>x*Math.PI/180,R=6371000;
  const dLat=rad(point.lat-run.last.lat),dLon=rad(point.lon-run.last.lon);
  const a=Math.sin(dLat/2)**2+Math.cos(rad(run.last.lat))*Math.cos(rad(point.lat))*Math.sin(dLon/2)**2;
  const meters=2*R*Math.asin(Math.sqrt(a)),dt=(point.t-run.last.t)/1000,ms=dt>0?meters/dt:Infinity;
  if(meters>=2&&dt>0&&ms<=10)run.distance+=meters;
 }
 run.last=point;renderRun();
 if(run.distance/1000>=run.target){pauseRun();setGps('Target tercapai');$('gpsAccuracy').textContent='Target jarak tercapai. Tekan Selesai untuk menyimpan hasil.'}
}
function startWatch(){
 if(!navigator.geolocation){setGps('GPS tidak didukung');$('gpsAccuracy').textContent='Browser ini tidak menyediakan GPS. Gunakan Chrome terbaru di Android.';return}
 run.active=true;run.paused=false;run.last=null;run.lastTick=Date.now();
 $('startRun').disabled=true;$('pauseRun').disabled=false;$('pauseRun').textContent='Jeda';$('finishRun').disabled=false;setGps('Meminta izin & mencari GPS…');
 run.watch=navigator.geolocation.watchPosition(onPosition,positionError,{enableHighAccuracy:true,maximumAge:0,timeout:45000});
 runTimer=setInterval(()=>{if(run.active){const now=Date.now();run.seconds+=Math.max(0,Math.round((now-run.lastTick)/1000));run.lastTick=now;renderRun()}},1000);
}
function pauseRun(){
 if(!run.active)return;
 // Freeze the session first so queued GPS callbacks cannot add distance after pause.
 run.active=false;run.paused=true;
 if(run.watch!==null&&navigator.geolocation)navigator.geolocation.clearWatch(run.watch);
 run.watch=null;
 if(runTimer!==null){clearInterval(runTimer);runTimer=null;}
 run.last=null;
 $('startRun').disabled=false;$('startRun').textContent='Lanjutkan';
 $('pauseRun').disabled=true;$('pauseRun').textContent='Dijeda';
 $('finishRun').disabled=false;
 setGps('Aktivitas dijeda');$('gpsAccuracy').textContent='Timer dan perekaman GPS dihentikan sementara. Tekan Lanjutkan untuk meneruskan.';
 renderRun();
}
$('startRun').onclick=()=>{
 if(!window.isSecureContext){setGps('Butuh koneksi HTTPS');$('gpsAccuracy').textContent='Buka alamat GitHub Pages yang diawali https://.';return}
 if(!navigator.geolocation){setGps('GPS tidak didukung');$('gpsAccuracy').textContent='Gunakan Chrome terbaru di Android dan aktifkan Lokasi HP.';return}
 if(run.active)return;
 if(!run.paused){run.distance=0;run.seconds=0;run.last=null;}
 $('startRun').textContent='Mencari GPS…';
 startWatch();
};
$('pauseRun').addEventListener('click',e=>{e.preventDefault();if(run.active)pauseRun()});
$('finishRun').onclick=()=>{
 if(run.active)pauseRun();
 if(run.distance<20&&run.seconds<30){setGps('Sesi terlalu singkat');return}
 const km=run.distance/1000,cal=activeCalories(km,run.seconds,weightNow());
 data.runs.unshift({date:todayKey,distance:+km.toFixed(3),seconds:run.seconds,calories:cal,pace:km>0?Math.round(run.seconds/km):0,target:run.target});
 save();renderRunHistory();renderFoods();resetRun();setGps('Lari tersimpan');
};
function resetRun(){run.distance=0;run.seconds=0;run.last=null;run.paused=false;run.active=false;$('startRun').textContent='Mulai lari';$('startRun').disabled=false;$('pauseRun').disabled=true;$('pauseRun').textContent='Jeda';$('finishRun').disabled=true;renderRun()}
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
const stepWalk={active:false,paused:false,watch:null,last:null,distance:0,seconds:0,lastTick:0,route:[],timer:null};
function renderStepWalk(){
 const km=stepWalk.distance/1000,cal=Math.round((3.5-1)*3.5*weightNow()/200*(stepWalk.seconds/60));
 $('stepWalkDistance').textContent=km.toFixed(2)+' km';
 $('stepWalkTime').textContent=fmtTime(stepWalk.seconds);
 $('stepWalkCalories').textContent=cal+' kkal';
 $('stepWalkRoute').textContent=stepWalk.route.length+' titik GPS terekam';
}
function stepGpsError(err){
 const msg={1:'Izin lokasi ditolak. Izinkan lokasi untuk Chrome di Pengaturan Android.',2:'Lokasi belum ditemukan. Aktifkan GPS dan coba di area terbuka.',3:'GPS terlalu lama merespons. Coba lagi di area terbuka.'};
 $('stepSensorStatus').textContent='GPS bermasalah';$('stepWalkRoute').textContent=msg[err.code]||'Gagal membaca GPS.';
 stopStepWalk(false);
}
function onStepGps(pos){
 const c=pos.coords,acc=c.accuracy||999;
 $('stepWalkRoute').textContent='Akurasi GPS ±'+Math.round(acc)+' m • '+stepWalk.route.length+' titik';
 if(acc>75)return;
 const p={lat:c.latitude,lon:c.longitude,t:pos.timestamp};
 if(stepWalk.last){
  const rad=x=>x*Math.PI/180,R=6371000,dLat=rad(p.lat-stepWalk.last.lat),dLon=rad(p.lon-stepWalk.last.lon);
  const a=Math.sin(dLat/2)**2+Math.cos(rad(stepWalk.last.lat))*Math.cos(rad(p.lat))*Math.sin(dLon/2)**2;
  const m=2*R*Math.asin(Math.sqrt(a)),dt=(p.t-stepWalk.last.t)/1000,ms=dt>0?m/dt:Infinity;
  if(m>=2&&dt>0&&ms<=4.5){stepWalk.distance+=m;stepWalk.route.push([p.lat,p.lon]);}
 }else stepWalk.route.push([p.lat,p.lon]);
 stepWalk.last=p;renderStepWalk();
}
function stopStepWalk(paused=true){
 if(stepWalk.watch!==null&&navigator.geolocation)navigator.geolocation.clearWatch(stepWalk.watch);
 stepWalk.watch=null;if(stepWalk.timer)clearInterval(stepWalk.timer);stepWalk.timer=null;
 if(stepListener)window.removeEventListener('devicemotion',stepListener);
 stepListener=null;stepActive=false;stepWalk.active=false;stepWalk.paused=paused;
 $('startSteps').disabled=false;$('stopSteps').disabled=true;
 $('stepSensorStatus').textContent=paused?'Dijeda':'Berhenti';
 $('startSteps').textContent=paused?'Lanjutkan aktivitas':'Mulai aktivitas';
 renderStepWalk();
}
async function startStepSensor(){
 if(!window.isSecureContext){$('stepSensorStatus').textContent='Butuh HTTPS';$('stepWalkRoute').textContent='Buka FitTrack melalui alamat HTTPS.';return}
 if(!navigator.geolocation){$('stepSensorStatus').textContent='GPS tidak tersedia';return}
 if(!('DeviceMotionEvent'in window)){$('stepSensorStatus').textContent='Sensor gerak tidak tersedia';return}
 try{
  if(typeof DeviceMotionEvent.requestPermission==='function'){
   const permission=await DeviceMotionEvent.requestPermission();
   if(permission!=='granted')throw new Error('Izin sensor gerak ditolak.');
  }
  if(!stepWalk.paused){stepWalk.distance=0;stepWalk.seconds=0;stepWalk.route=[];stepWalk.last=null}
  lastMagnitude=0;stepArmed=true;
  stepListener=motionHandler;window.addEventListener('devicemotion',stepListener);
  stepActive=true;stepWalk.active=true;stepWalk.paused=false;stepWalk.last=null;stepWalk.lastTick=Date.now();
  $('startSteps').disabled=true;$('stopSteps').disabled=false;$('stepSensorStatus').textContent='Meminta izin GPS…';
  stepWalk.watch=navigator.geolocation.watchPosition(onStepGps,stepGpsError,{enableHighAccuracy:true,maximumAge:0,timeout:45000});
  stepWalk.timer=setInterval(()=>{if(stepWalk.active){const now=Date.now();stepWalk.seconds+=Math.max(0,Math.round((now-stepWalk.lastTick)/1000));stepWalk.lastTick=now;renderStepWalk()}},1000);
  $('stepSensorStatus').textContent='Sensor & GPS aktif';
 }catch(err){$('stepSensorStatus').textContent='Izin diperlukan';$('stepWalkRoute').textContent=err.message||'Izinkan sensor gerak.'}
}
$('startSteps').onclick=startStepSensor;$('stopSteps').onclick=()=>stopStepWalk(true);
$('manualStepsForm').onsubmit=e=>{e.preventDefault();const add=Number($('manualSteps').value);if(Number.isFinite(add)&&add>0)setSteps(stepToday()+add);e.target.reset()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&stepWalk.active)stopStepWalk(true)});
$('finishSteps').onclick=()=>{
 if(stepWalk.active)stopStepWalk(false);
 if(stepWalk.seconds<15&&stepWalk.distance<10){$('stepSensorStatus').textContent='Aktivitas terlalu singkat';return}
 const km=stepWalk.distance/1000,cal=Math.round((3.5-1)*3.5*weightNow()/200*(stepWalk.seconds/60));
 data.walks=data.walks||[];
 data.walks.unshift({date:todayKey,steps:stepToday(),distance:+km.toFixed(3),seconds:stepWalk.seconds,calories:cal,route:stepWalk.route});
 save();$('stepWalkRoute').textContent='Aktivitas tersimpan • '+stepWalk.route.length+' titik GPS';
 stepWalk.paused=false;stepWalk.distance=0;stepWalk.seconds=0;stepWalk.route=[];stepWalk.last=null;
 $('startSteps').textContent='Mulai aktivitas';$('finishSteps').disabled=true;renderStepWalk();
};
$('startSteps').addEventListener('click',()=>{$('finishSteps').disabled=false});
renderStepWalk();
renderSteps();

renderWorkouts();renderFoods();renderWeights();renderRun();renderRunHistory();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
