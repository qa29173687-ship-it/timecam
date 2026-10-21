const $=id=>document.getElementById(id),F=['site','case','bld','flr','note'],B=document.body;
const FF='-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang TC","Noto Sans TC",sans-serif',AC='#ffb020';
F.forEach(k=>{$(k).value=localStorage.getItem('tc_'+k)??(k=='site'?'中和安邦社宅':'');$(k).oninput=()=>{localStorage.setItem('tc_'+k,$(k).value);upd()}});
const W='日一二三四五六';
function now(){const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',weekday:'short',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
const wd={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[p.weekday];return{d:`${p.year}/${p.month}/${p.day}`,t:`${p.hour}:${p.minute}:${p.second}`,w:'星期'+W[wd],f:`${p.year}${p.month}${p.day}_${p.hour}${p.minute}${p.second}`}}
const val=k=>$(k).value.trim(),safe=s=>s.replace(/[\\/:*?"<>|\s]/g,'-');
function rr(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
function wrap(x,s,mw){const out=[];let cur='';for(const ch of s){if(x.measureText(cur+ch).width>mw&&cur){out.push(cur);cur=ch}else cur+=ch}if(cur)out.push(cur);return out.length?out:['']}
// 浮水印卡片：u=基本單位，left/bottom=卡片左下角
function card(x,n,u,left,bottom,maxW){
 const pad=u*1.1,bar=u*.32,site=val('site'),rows=[];
 if(val('case'))rows.push(['#','案號',val('case')]);
 const bf=[val('bld'),val('flr')].filter(Boolean).join(' · ');if(bf)rows.push(['樓','棟別樓層',bf]);
 if(val('note'))rows.push(['註','備註',val('note')]);
 const hm=n.t.slice(0,5),ss=n.t.slice(5),dl=`${n.d}  ${n.w}`;
 const f=(wt,s)=>x.font=`${wt} ${s*u}px ${FF}`;
 f(800,2.7);const hmW=x.measureText(hm).width;f(600,1.15);const ssW=x.measureText(ss).width;
 f(500,.95);const dW=x.measureText(dl).width;f(700,.95);const sW=site?x.measureText(site).width:0;
 f(500,.85);const lW=Math.max(0,...rows.map(r=>x.measureText(r[1]).width));const ic=u*1.35,vx=ic+u*.55+lW+u*.8;
 f(600,.95);let rW=Math.max(0,...rows.map(r=>x.measureText(r[2]).width));
 const inner=Math.min(maxW-pad*2-bar,Math.max(hmW+ssW+u*.3,dW,sW,rows.length?vx+rW:0));
 const lines=rows.map(r=>wrap(x,r[2],Math.max(u*4,inner-vx)));
 const lh=u*1.5;let H=pad*2+u*2.9+u*1.35+(site?u*1.5:0)+(rows.length?u*1.0+lines.reduce((a,l)=>a+l.length,0)*lh:0);
 const Wd=inner+pad*2+bar,X=left,Y=bottom-H;
 x.save();x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=u*1.2;rr(x,X,Y,Wd,H,u*.9);x.fillStyle='rgba(14,16,22,.66)';x.fill();x.restore();
 x.save();rr(x,X,Y,Wd,H,u*.9);x.clip();x.fillStyle=AC;x.fillRect(X,Y,bar,H);x.restore();
 x.textBaseline='alphabetic';let cx=X+bar+pad,cy=Y+pad;
 if(site){f(700,.95);x.fillStyle=AC;x.fillText(site,cx,cy+u*.95);cy+=u*1.5}
 f(800,2.7);x.fillStyle='#fff';x.fillText(hm,cx,cy+u*2.4);f(600,1.15);x.fillStyle='rgba(255,255,255,.75)';x.fillText(ss,cx+hmW+u*.15,cy+u*2.4);cy+=u*2.9;
 f(500,.95);x.fillStyle='rgba(255,255,255,.85)';x.fillText(dl,cx,cy+u*.95);cy+=u*1.35;
 if(rows.length){x.fillStyle='rgba(255,255,255,.16)';x.fillRect(cx,cy+u*.45,inner,Math.max(1,u*.06));cy+=u*1.0;
  rows.forEach((r,i)=>{const yc=cy+lh/2;rr(x,cx,yc-ic/2,ic,ic,u*.35);x.fillStyle='rgba(255,176,32,.2)';x.fill();
   x.textAlign='center';x.textBaseline='middle';f(700,.75);x.fillStyle=AC;x.fillText(r[0],cx+ic/2,yc+u*.03);x.textAlign='left';
   f(500,.85);x.fillStyle='rgba(255,255,255,.55)';x.fillText(r[1],cx+ic+u*.55,yc);
   f(600,.95);x.fillStyle='#fff';lines[i].forEach((l,j)=>x.fillText(l,cx+vx,yc+j*lh));cy+=lines[i].length*lh;x.textBaseline='alphabetic'})}
}
function stamp(x,w,h,n){const u=Math.min(w,h)*.03;card(x,n,u,w*.03,h-Math.min(w,h)*.03,w*.94)}
// 即時預覽浮水印
const ov=$('ov'),ox=ov.getContext('2d');let frozen=null;
function upd(){$('siteChip').textContent=val('site')||'時間相機';const d=devicePixelRatio||1,W=innerWidth,H=innerHeight;
 if(ov.width!=W*d||ov.height!=H*d){ov.width=W*d;ov.height=H*d}ox.setTransform(d,0,0,d,0,0);ox.clearRect(0,0,W,H);
 const top=$('ctrl').getBoundingClientRect().top;card(ox,frozen||now(),Math.min(W,H)*.03,14,top-6,W-28)}
setInterval(()=>{if(!frozen)upd()},500);addEventListener('resize',upd);upd();
function toast(t){const e=$('toast');e.textContent=t;e.classList.remove('hidden');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.add('hidden'),1800)}
// 相機
let stream=null;async function cam(){try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},audio:false});$('v').srcObject=stream}catch(e){toast('無法開啟相機，將使用系統相機')}}
cam();
// 狀態
let mode='photo',blob=null,name='',kind='';
function showResult(){$('ov').classList.add('hidden');$('ctrl').classList.add('hidden');$('top').classList.add('hidden');$('result').classList.remove('hidden');$('sheet').classList.remove('open')}
function showLive(){frozen=null;blob=null;['shot','pb'].forEach(i=>$(i).style.opacity=0);$('pb').pause();$('pb').style.pointerEvents='none';$('v').style.opacity=1;
 $('ov').classList.remove('hidden');$('ctrl').classList.remove('hidden');$('top').classList.remove('hidden');$('result').classList.add('hidden');upd()}
$('pb').style.pointerEvents='none';
function render(src,w,h){const n=now();frozen=n;const c=$('c'),x=c.getContext('2d');c.width=w;c.height=h;x.drawImage(src,0,0,w,h);stamp(x,w,h,n);
 name=`${n.f}${val('case')?'_'+safe(val('case')):''}.jpg`;kind='image/jpeg';
 c.toBlob(b=>{blob=b;$('shot').src=URL.createObjectURL(b);$('shot').style.opacity=1;$('v').style.opacity=0;showResult()},'image/jpeg',.92)}
function flash(){const f=$('flash');f.style.transition='none';f.style.opacity=.8;requestAnimationFrame(()=>{f.style.transition='opacity .35s';f.style.opacity=0})}
$('pick').onclick=()=>{if(rec)return;$('file').removeAttribute('capture');$('file').click()};
$('file').onchange=e=>{const f=e.target.files[0];if(!f)return;const i=new Image();i.onload=()=>render(i,i.naturalWidth,i.naturalHeight);i.src=URL.createObjectURL(f);e.target.value='';$('file').setAttribute('capture','environment')};
$('fieldsBtn').onclick=()=>$('sheet').classList.toggle('open');$('done').onclick=()=>{$('sheet').classList.remove('open');document.activeElement.blur()};
function setMode(m){if(rec)return;mode=m;B.classList.toggle('video',m=='video');$('mPhoto').classList.toggle('on',m=='photo');$('mVideo').classList.toggle('on',m=='video')}
$('mPhoto').onclick=()=>setMode('photo');$('mVideo').onclick=()=>setMode('video');
// 錄影
let rec=null,chunks=[],raf=0,t0=0,tick=0,mic=null;
function pickMime(){for(const t of['video/mp4;codecs=avc1,mp4a','video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'])if(window.MediaRecorder&&MediaRecorder.isTypeSupported(t))return t;return''}
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
async function startRec(){const v=$('v');if(!v.videoWidth||!window.MediaRecorder){toast('此瀏覽器不支援錄影');return}
 const c=$('c'),x=c.getContext('2d');c.width=v.videoWidth;c.height=v.videoHeight;
 const loop=()=>{x.drawImage(v,0,0,c.width,c.height);stamp(x,c.width,c.height,now());raf=requestAnimationFrame(loop)};loop();
 const s=c.captureStream(30);try{mic=mic||await navigator.mediaDevices.getUserMedia({audio:true});mic.getAudioTracks().forEach(t=>s.addTrack(t))}catch(e){toast('未取得麥克風，將錄製無聲影片')}
 const mt=pickMime();rec=new MediaRecorder(s,mt?{mimeType:mt,videoBitsPerSecond:4e6}:{});chunks=[];
 rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);rec.onstop=finishRec;rec.start(1000);
 const n=now();name=n.f+(val('case')?'_'+safe(val('case')):'');t0=Date.now();$('rt').textContent='00:00';$('rec').classList.remove('hidden');
 tick=setInterval(()=>$('rt').textContent=fmt(Math.floor((Date.now()-t0)/1000)),500);B.classList.add('recording');$('sheet').classList.remove('open')}
function stopRec(){rec.stop();cancelAnimationFrame(raf);clearInterval(tick);$('rec').classList.add('hidden');B.classList.remove('recording')}
function finishRec(){kind=(rec.mimeType||'video/webm').split(';')[0];blob=new Blob(chunks,{type:kind});name+=kind.includes('mp4')?'.mp4':'.webm';rec=null;
 const pb=$('pb');pb.src=URL.createObjectURL(blob);pb.style.opacity=1;pb.style.pointerEvents='auto';$('v').style.opacity=0;showResult()}
$('snap').onclick=()=>{if(mode=='video')return rec?stopRec():startRec();const v=$('v');if(!v.videoWidth)return $('file').click();flash();render(v,v.videoWidth,v.videoHeight)};
$('back').onclick=showLive;
$('save').onclick=async()=>{if(!blob)return;const file=new File([blob],name,{type:kind});
 if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:name});return}catch(e){if(e.name=='AbortError')return}}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();toast('已下載 '+name)};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
