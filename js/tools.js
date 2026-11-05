const $=(s,r=document)=>r.querySelector(s);
const LS={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const fmt=n=>Number.isFinite(n)?(+n.toPrecision(12)).toLocaleString('en',{maximumFractionDigits:10}):'—';
const bytes=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';
const load=src=>new Promise((ok,no)=>{if(load[src])return ok();const s=document.createElement('script');s.src=src;s.onload=()=>{load[src]=1;ok()};s.onerror=()=>no(new Error('Could not load the required library. Check your connection.'));document.head.appendChild(s)});
const QR_SRC='https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js',PDF_SRC='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
function copy(t,b){if(!t)return;navigator.clipboard.writeText(t).then(()=>{const o=b.textContent;b.textContent='Copied ✓';setTimeout(()=>b.textContent=o,1200)}).catch(()=>{})}
function dl(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000)}
const num=v=>v===''?NaN:parseFloat(v);

const T={};
/* ---------- 1 Percentage ---------- */
T.percentage={name:'Percentage Calculator',icon:'％',desc:'Percent of a number, increase, decrease and difference.',
about:'<h2>How percentages work</h2><p>A percentage is a fraction of 100. To find 15% of 80, multiply 80 by 0.15 to get 12. To find what percent 12 is of 80, divide 12 by 80 and multiply by 100 to get 15%. Increases and decreases multiply the original value by (1 ± rate ÷ 100): a 20% increase on 50 gives 60, and a 20% decrease gives 40.</p>',
render(r){
const M=[['X% of Y','X (%)','Y',(a,b)=>[fmt(a/100*b),`${fmt(a)} ÷ 100 × ${fmt(b)}`]],
['X is what % of Y','X','Y',(a,b)=>{if(b===0)throw'Y cannot be zero.';return[fmt(a/b*100)+'%',`${fmt(a)} ÷ ${fmt(b)} × 100`]}],
['Increase X by Y%','X','Y (%)',(a,b)=>[fmt(a*(1+b/100)),`${fmt(a)} × (1 + ${fmt(b)} ÷ 100)`]],
['Decrease X by Y%','X','Y (%)',(a,b)=>[fmt(a*(1-b/100)),`${fmt(a)} × (1 − ${fmt(b)} ÷ 100)`]],
['Difference between X and Y','X','Y',(a,b)=>{const d=b-a,p=a===0?'undefined because X is zero':fmt(d/Math.abs(a)*100)+'%';return[`${fmt(Math.abs(d))} (change from X to Y: ${p})`,`|${fmt(b)} − ${fmt(a)}|; change = (Y − X) ÷ |X| × 100`]}]];
r.innerHTML=`<label>Calculation<select id="m">${M.map((x,i)=>`<option value="${i}">${x[0]}</option>`).join('')}</select></label>
<div class="row"><label><span id="la"></span><input id="a" type="number" step="any"></label><label><span id="lb"></span><input id="b" type="number" step="any"></label></div>
<div class="res" id="o" aria-live="polite">Enter both values</div><p class="note" id="s"></p>
<div class="row"><button class="btn" id="cp">Copy result</button><button class="btn ghost" id="rs">Reset</button></div>`;
let res='';const o=$('#o',r),s=$('#s',r);
const up=()=>{const[,la,lb,fn]=M[+$('#m',r).value];$('#la',r).textContent=la;$('#lb',r).textContent=lb;
const a=num($('#a',r).value),b=num($('#b',r).value);res='';s.textContent='';
if(isNaN(a)||isNaN(b)){o.textContent='Enter both values';return}
try{const[v,st]=fn(a,b);res=v;o.textContent=v;s.textContent='Steps: '+st}catch(e){o.textContent=e}};
r.addEventListener('input',up);up();
$('#cp',r).onclick=e=>copy(res,e.target);
$('#rs',r).onclick=()=>{$('#a',r).value=$('#b',r).value='';up()}}};

/* ---------- 2 Age ---------- */
T.age={name:'Age Calculator',icon:'🎂',desc:'Exact age, days lived and your next birthday.',
about:'<h2>How age is calculated</h2><p>Age is counted in full years, then leftover months and days, using the real length of each month and leap years. Total days lived is the exact number of calendar days between your birth date and today in your local date. If you were born on 29 February, your birthday is shown as 1 March in non-leap years. Your birth date is never stored or sent anywhere.</p>',
render(r){const t=new Date(),iso=new Date(t-t.getTimezoneOffset()*6e4).toISOString().slice(0,10);
r.innerHTML=`<label>Date of birth<input id="d" type="date" max="${iso}"></label><div class="res" id="o" aria-live="polite">Pick your date of birth</div><p class="note" id="s"></p><button class="btn ghost" id="rs">Reset</button>`;
const o=$('#o',r),s=$('#s',r);
const up=()=>{s.textContent='';const v=$('#d',r).value;if(!v){o.textContent='Pick your date of birth';return}
const[y,m,d]=v.split('-').map(Number),n=new Date(),ty=n.getFullYear(),tm=n.getMonth(),td=n.getDate();
if(Date.UTC(y,m-1,d)>Date.UTC(ty,tm,td)){o.textContent='Birth date cannot be in the future';return}
let Y=ty-y,M=tm-(m-1),D=td-d;if(D<0){M--;D+=new Date(ty,tm,0).getDate()}if(M<0){Y--;M+=12}
const days=Math.round((Date.UTC(ty,tm,td)-Date.UTC(y,m-1,d))/864e5);
let nb=new Date(ty,m-1,d);if(Date.UTC(nb.getFullYear(),nb.getMonth(),nb.getDate())<Date.UTC(ty,tm,td))nb=new Date(ty+1,m-1,d);
const left=Math.round((Date.UTC(nb.getFullYear(),nb.getMonth(),nb.getDate())-Date.UTC(ty,tm,td))/864e5);
o.textContent=`${Y} years, ${M} months, ${D} days`;
s.innerHTML=`Total days lived: <b>${days.toLocaleString()}</b><br>Next birthday: <b>${nb.toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</b><br>Days remaining: <b>${left===0?'Today! 🎉':left.toLocaleString()}</b>`};
$('#d',r).oninput=up;$('#rs',r).onclick=()=>{$('#d',r).value='';up()};up()}};

/* ---------- 3 BMI ---------- */
T.bmi={name:'BMI Calculator',icon:'⚖️',desc:'Body mass index with a visual range indicator.',
about:'<h2>About BMI</h2><p>Body mass index is weight in kilograms divided by height in metres squared. For adults, below 18.5 is underweight, 18.5–24.9 normal weight, 25–29.9 overweight and 30 or above obesity. BMI is a screening measure, not a diagnosis. It does not account for muscle mass, age, sex or body composition, and these adult categories do not apply to children or pregnancy. Talk to a healthcare professional about your health.</p>',
render(r){r.innerHTML=`<label>Units<select id="u"><option value="m">Metric (cm, kg)</option><option value="i">Imperial (ft/in, lb)</option></select></label>
<div class="row" id="hm"><label>Height (cm)<input id="cm" type="number" step="any" min="0"></label></div>
<div class="row" id="hi" hidden><label>Feet<input id="ft" type="number" step="any" min="0"></label><label>Inches<input id="in" type="number" step="any" min="0"></label></div>
<label><span>Weight (<span id="wu">kg</span>)</span><input id="w" type="number" step="any" min="0"></label>
<div class="res" id="o" aria-live="polite">Enter height and weight</div><div class="bar" id="bar" hidden><b id="mk"></b></div><p class="note" id="s"></p>
<p class="note">BMI is a screening measure, not a diagnosis. Adult categories are not intended for children or pregnancy.</p><button class="btn ghost" id="rs">Reset</button>`;
const o=$('#o',r),s=$('#s',r),bar=$('#bar',r);
const up=()=>{const im=$('#u',r).value==='i';$('#hm',r).hidden=im;$('#hi',r).hidden=!im;$('#wu',r).textContent=im?'lb':'kg';
let h=im?(num($('#ft',r).value||0)*12+num($('#in',r).value||0))*2.54:num($('#cm',r).value),w=num($('#w',r).value);if(im)w*=.45359237;
bar.hidden=true;s.textContent='';
if(isNaN(h)||isNaN(w)){o.textContent='Enter height and weight';return}
if(h<50||h>272){o.textContent='Height must be between 50 and 272 cm (1′8″–8′11″)';return}
if(w<2||w>650){o.textContent='Weight is outside the supported range';return}
const b=w/((h/100)**2),c=b<18.5?'Underweight':b<25?'Normal weight':b<30?'Overweight':'Obesity';
o.textContent=`BMI ${b.toFixed(1)} · ${c}`;bar.hidden=false;$('#mk',r).style.left=(Math.min(Math.max(b,10),40)-10)/30*100+'%';
s.textContent=`Your BMI of ${b.toFixed(1)} falls in the "${c}" adult range. Ranges: below 18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30+ obesity.`};
r.addEventListener('input',up);r.addEventListener('change',up);$('#rs',r).onclick=()=>{r.querySelectorAll('input').forEach(i=>i.value='');up()}}};

/* ---------- 4 Currency ---------- */
const CUR={USD:1,EUR:.92,GBP:.79,JPY:150,CAD:1.36,AUD:1.52,CHF:.88,INR:83,CNY:7.2,MXN:17};
T.currency={name:'Currency Converter',icon:'💱',desc:'Convert using exchange rates you control.',
about:'<h2>Manual exchange rates</h2><p>This converter does not fetch live market data. It uses rates you enter yourself, stored only in your browser, so it works offline and never contacts a rates provider. The default values are rough samples for demonstration. Check a bank or trusted source and update the rates (expressed as units per 1 USD) before relying on a result.</p>',
render(r){let st=LS.get('rates',null)||{r:{...CUR},date:null};const ks=Object.keys(CUR);
const opts=sel=>ks.map(k=>`<option ${k===sel?'selected':''}>${k}</option>`).join('');
r.innerHTML=`<label>Amount<input id="am" type="number" step="any" value="100"></label>
<div class="row" style="align-items:end"><label>From<select id="f">${opts('USD')}</select></label><button class="btn ghost" id="sw" style="flex:0 0 auto" aria-label="Swap currencies">⇄</button><label>To<select id="t">${opts('EUR')}</select></label></div>
<div class="res" id="o" aria-live="polite"></div><p class="note" id="s"></p><button class="btn" id="cp">Copy result</button>
<details><summary>Edit exchange rates</summary><p class="note">Units per 1 USD.</p><div class="row" id="ed" style="margin-top:10px">${ks.map(k=>`<label>${k}<input data-k="${k}" type="number" step="any" min="0"></label>`).join('')}</div>
<div class="row" style="margin-top:12px"><button class="btn" id="sv">Save rates</button><button class="btn ghost" id="df">Restore samples</button></div></details>
<p class="note">⚠ Rates are entered manually. They are not updated automatically and may not match live market prices.</p>`;
const fill=()=>r.querySelectorAll('[data-k]').forEach(i=>i.value=st.r[i.dataset.k]);fill();
let res='';const up=()=>{const a=num($('#am',r).value),f=$('#f',r).value,t=$('#t',r).value,rt=st.r[t]/st.r[f];
if(isNaN(a)){$('#o',r).textContent='Enter an amount';res='';return}
res=`${fmt(a*rt)} ${t}`;$('#o',r).textContent=res;
$('#s',r).textContent=`1 ${f} = ${fmt(rt)} ${t} · Rates last updated: ${st.date||'never (sample values)'}`};
r.addEventListener('input',up);$('#sw',r).onclick=()=>{const f=$('#f',r),t=$('#t',r),x=f.value;f.value=t.value;t.value=x;up()};
$('#cp',r).onclick=e=>copy(res,e.target);
$('#sv',r).onclick=()=>{const n={};for(const i of r.querySelectorAll('[data-k]')){const v=num(i.value);if(!(v>0)){alert(`Rate for ${i.dataset.k} must be greater than 0.`);return}n[i.dataset.k]=v}
n.USD=1;st={r:n,date:new Date().toISOString().slice(0,10)};LS.set('rates',st);up()};
$('#df',r).onclick=()=>{st={r:{...CUR},date:null};LS.set('rates',st);fill();up()};up()}};

/* ---------- 5 Units ---------- */
const U={Length:{Millimeter:.001,Centimeter:.01,Meter:1,Kilometer:1000,Inch:.0254,Foot:.3048,Yard:.9144,Mile:1609.344},
Weight:{Milligram:1e-6,Gram:.001,Kilogram:1,Ounce:.028349523125,Pound:.45359237,'Metric ton':1000},
Volume:{Milliliter:.001,Liter:1,'US gallon':3.785411784,Cup:.2365882365,'Fluid ounce':.0295735295625},
Area:{'Square meter':1,'Square kilometer':1e6,'Square foot':.09290304,Acre:4046.8564224,Hectare:1e4},
Temperature:{Celsius:1,Fahrenheit:1,Kelvin:1}};
const toC={Celsius:x=>x,Fahrenheit:x=>(x-32)*5/9,Kelvin:x=>x-273.15},fromC={Celsius:x=>x,Fahrenheit:x=>x*9/5+32,Kelvin:x=>x+273.15};
T['unit-converter']={name:'Unit Converter',icon:'📏',desc:'Length, weight, temperature, volume and area.',
about:'<h2>Conversion method</h2><p>Each value is converted to a base unit (metre, kilogram, litre or square metre) using exact international definitions, then to the target unit. Temperatures use the standard formulas: °F = °C × 9/5 + 32 and K = °C + 273.15. Volumes use US customary units.</p>',
render(r){r.innerHTML=`<label>Category<select id="c">${Object.keys(U).map(k=>`<option>${k}</option>`).join('')}</select></label>
<label>Value<input id="v" type="number" step="any" value="1"></label>
<div class="row" style="align-items:end"><label>From<select id="f"></select></label><button class="btn ghost" id="sw" style="flex:0 0 auto" aria-label="Swap units">⇄</button><label>To<select id="t"></select></label></div>
<div class="res" id="o" aria-live="polite"></div><div class="row"><button class="btn" id="cp">Copy result</button><button class="btn ghost" id="rs">Reset</button></div>`;
let res='';const f=$('#f',r),t=$('#t',r),cat=()=>{const ks=Object.keys(U[$('#c',r).value]);f.innerHTML=ks.map(k=>`<option>${k}</option>`).join('');t.innerHTML=f.innerHTML;t.selectedIndex=Math.min(1,ks.length-1);up()};
function up(){const c=$('#c',r).value,v=num($('#v',r).value);if(isNaN(v)){$('#o',r).textContent='Enter a value';res='';return}
const o=c==='Temperature'?fromC[t.value](toC[f.value](v)):v*U[c][f.value]/U[c][t.value];
res=`${fmt(v)} ${f.value} = ${fmt(o)} ${t.value}`;$('#o',r).textContent=res}
$('#c',r).onchange=cat;r.addEventListener('input',up);$('#sw',r).onclick=()=>{const x=f.value;f.value=t.value;t.value=x;up()};
$('#cp',r).onclick=e=>copy(res,e.target);$('#rs',r).onclick=()=>{$('#v',r).value=1;cat()};cat()}};

/* ---------- 6 QR ---------- */
T['qr-generator']={name:'QR Code Generator',icon:'▦',desc:'Make QR codes for links, text, email, phone and Wi-Fi.',
about:'<h2>Using QR codes</h2><p>Choose what the code should contain, adjust the size and colours, then download a PNG or a scalable SVG. Keep strong contrast between foreground and background (dark on light works best) so phone cameras can read it. For Wi-Fi codes, the password is encoded inside the image, so share it only with people you trust. Everything is generated locally in your browser.</p>',
render(r){r.innerHTML=`<label>Content type<select id="ty"><option value="text">Plain text</option><option value="url">Website URL</option><option value="email">Email address</option><option value="tel">Phone number</option><option value="wifi">Wi-Fi</option></select></label>
<div id="fl" class="panel" style="padding:0;border:0;box-shadow:none"></div>
<div class="row"><label>Size: <output id="so">320</output> px<input id="sz" type="range" min="128" max="1024" step="32" value="320"></label><label>Foreground<input id="fg" type="color" value="#0b3d91"></label><label>Background<input id="bg" type="color" value="#ffffff"></label></div>
<p class="err" id="er"></p><canvas id="cv" style="max-width:100%;justify-self:center"></canvas>
<div class="row"><button class="btn" id="png" disabled>Download PNG</button><button class="btn" id="svg" disabled>Download SVG</button></div>`;
const FL={text:'<label>Text<textarea id="x" rows="3" maxlength="1000"></textarea></label>',url:'<label>Website URL<input id="x" type="url" placeholder="https://example.com"></label>',email:'<label>Email address<input id="x" type="email" placeholder="name@example.com"></label>',tel:'<label>Phone number<input id="x" type="tel" placeholder="+1 555 123 4567"></label>',
wifi:'<label>Network name (SSID)<input id="x"></label><label>Password<input id="pw"></label><label>Security<select id="sec"><option>WPA</option><option>WEP</option><option value="nopass">None</option></select></label>'};
let svgText='',cv=$('#cv',r);
const payload=()=>{const ty=$('#ty',r).value,x=($('#x',r).value||'').trim();if(!x)throw'';
if(ty==='url'){let u=/^[a-z][a-z0-9+.-]*:/i.test(x)?x:'https://'+x;try{const p=new URL(u);if(!/^https?:$/.test(p.protocol))throw 0;return u}catch{throw'Enter a valid http(s) URL.'}}
if(ty==='email'){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x))throw'Enter a valid email address.';return'mailto:'+x}
if(ty==='tel'){if(!/^\+?[0-9\s\-().]{5,20}$/.test(x))throw'Enter a valid phone number.';return'tel:'+x.replace(/[^\d+]/g,'')}
if(ty==='wifi'){const e=s=>s.replace(/([\\;,:"])/g,'\\$1'),sec=$('#sec',r).value,pw=$('#pw',r).value;if(sec!=='nopass'&&!pw)throw'Enter the Wi-Fi password.';return`WIFI:T:${sec==='nopass'?'nopass':sec};S:${e(x)};${sec==='nopass'?'':'P:'+e(pw)+';'};`}
return x};
async function gen(){const er=$('#er',r);er.textContent='';$('#png',r).disabled=$('#svg',r).disabled=true;
let p;try{p=payload()}catch(e){cv.width=cv.height=0;er.textContent=e||'';return}
try{await load(QR_SRC);const q=qrcode(0,'M');q.addData(p);q.make();const n=q.getModuleCount(),tot=n+8,sz=+$('#sz',r).value,cell=Math.max(1,Math.floor(sz/tot)),fg=$('#fg',r).value,bg=$('#bg',r).value;
cv.width=cv.height=cell*tot;const c=cv.getContext('2d');c.fillStyle=bg;c.fillRect(0,0,cv.width,cv.height);c.fillStyle=fg;let d='';
for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(q.isDark(y,x)){c.fillRect((x+4)*cell,(y+4)*cell,cell,cell);d+=`M${x+4} ${y+4}h1v1h-1z`}
svgText=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tot} ${tot}" width="${sz}" height="${sz}" shape-rendering="crispEdges"><rect width="${tot}" height="${tot}" fill="${bg}"/><path fill="${fg}" d="${d}"/></svg>`;
$('#png',r).disabled=$('#svg',r).disabled=false}catch(e){er.textContent=e.message||'Content is too long for a QR code.'}}
const fields=()=>{$('#fl',r).innerHTML=FL[$('#ty',r).value];gen()};
r.addEventListener('input',e=>{$('#so',r).textContent=$('#sz',r).value;if(e.target.id!=='ty')gen()});$('#ty',r).onchange=fields;
$('#png',r).onclick=()=>cv.toBlob(b=>dl(b,'qr-code.png'));$('#svg',r).onclick=()=>dl(new Blob([svgText],{type:'image/svg+xml'}),'qr-code.svg');fields()}};

/* ---------- 7 Image resizer ---------- */
T['image-resizer']={name:'Image Resizer',icon:'🖼️',desc:'Resize and convert JPG, PNG and WebP images privately.',
about:'<h2>Resizing images in your browser</h2><p>Drop in a JPG, PNG or WebP image, set a new width and height or a percentage, pick an output format and download the result. Lower JPEG or WebP quality makes smaller files. Your image is drawn on an HTML canvas on your device and is never uploaded. Transparent areas become white when saving as JPEG.</p>',
render(r){r.innerHTML=`<div class="drop" id="dz" tabindex="0" role="button">Drop an image here or click to choose<br><small>JPG, PNG or WebP · max 25 MB</small><input id="fi" type="file" accept="image/jpeg,image/png,image/webp" hidden></div><p class="err" id="er"></p>
<div class="panel" id="ed" hidden style="padding:0;border:0;box-shadow:none"><img id="pv" alt="Preview of your image"><p class="note" id="info"></p>
<div class="row"><label>Width (px)<input id="w" type="number" min="1" max="10000"></label><label>Height (px)<input id="h" type="number" min="1" max="10000"></label><label>Percent<input id="p" type="number" min="1" max="500" value="100"></label></div>
<label class="chk"><input type="checkbox" id="lk" checked> Keep aspect ratio</label>
<div class="row"><label>Format<select id="fm"><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label><label>Quality: <output id="qo">85</output>%<input id="q" type="range" min="10" max="100" value="85"></label></div>
<button class="btn" id="go">Resize image</button><p class="note" id="out" aria-live="polite"></p><button class="btn" id="dl" hidden>Download</button></div>`;
let url,img,nw,nh,blob,name='image';const er=$('#er',r),W=$('#w',r),H=$('#h',r),P=$('#p',r);
const pick=f=>{er.textContent='';if(!f)return;if(!/^image\/(jpeg|png|webp)$/.test(f.type)){er.textContent='Unsupported file. Use JPG, PNG or WebP.';return}
if(f.size>25*1048576){er.textContent='File is larger than 25 MB.';return}
if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(f);name=f.name.replace(/\.[^.]+$/,'');img=new Image();
img.onload=()=>{nw=img.naturalWidth;nh=img.naturalHeight;W.value=nw;H.value=nh;P.value=100;$('#pv',r).src=url;$('#ed',r).hidden=false;$('#out',r).textContent='';$('#dl',r).hidden=true;$('#info',r).textContent=`Original: ${nw} × ${nh} px · ${bytes(f.size)}`};
img.onerror=()=>{er.textContent='This image could not be read.';$('#ed',r).hidden=true};img.src=url};
const dz=$('#dz',r),fi=$('#fi',r);dz.onclick=()=>fi.click();dz.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fi.click()}};fi.onchange=()=>pick(fi.files[0]);
dz.ondragover=e=>{e.preventDefault();dz.classList.add('on')};dz.ondragleave=()=>dz.classList.remove('on');dz.ondrop=e=>{e.preventDefault();dz.classList.remove('on');pick(e.dataTransfer.files[0])};
W.oninput=()=>{if($('#lk',r).checked&&nw){H.value=Math.round(W.value*nh/nw)}P.value=nw?Math.round(W.value/nw*100):100};
H.oninput=()=>{if($('#lk',r).checked&&nh){W.value=Math.round(H.value*nw/nh)}P.value=nw?Math.round(W.value/nw*100):100};
P.oninput=()=>{W.value=Math.max(1,Math.round(nw*P.value/100));H.value=Math.max(1,Math.round(nh*P.value/100))};
$('#q',r).oninput=e=>$('#qo',r).textContent=e.target.value;
$('#go',r).onclick=()=>{const w=Math.round(W.value),h=Math.round(H.value);if(!(w>=1&&h>=1&&w<=10000&&h<=10000)){er.textContent='Width and height must be between 1 and 10000 px.';return}er.textContent='';
const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),fm=$('#fm',r).value;if(fm==='image/jpeg'){x.fillStyle='#fff';x.fillRect(0,0,w,h)}x.drawImage(img,0,0,w,h);
$('#out',r).textContent='Processing…';
c.toBlob(b=>{if(!b){er.textContent='Could not create the image. Try smaller dimensions.';$('#out',r).textContent='';return}blob=b;
const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[b.type]||'png';
$('#out',r).textContent=`Result: ${w} × ${h} px · ${bytes(b.size)}${b.type!==fm?' (your browser saved it as '+ext.toUpperCase()+')':''}`;
const d=$('#dl',r);d.hidden=false;d.textContent=`Download .${ext}`;d.onclick=()=>dl(blob,`${name}-${w}x${h}.${ext}`)},fm,$('#q',r).value/100)}}};

/* ---------- 8 PDF merger ---------- */
T['pdf-merger']={name:'PDF Merger',icon:'📄',desc:'Combine several PDFs into one, privately.',
about:'<h2>Merging PDFs</h2><p>Add two or more PDF files, put them in the order you want with the arrow buttons, and merge them into a single document. Merging happens locally with the open-source PDF-Lib library, so your documents are never uploaded. Password-protected or damaged files cannot be merged; remove the protection first.</p>',
render(r){r.innerHTML=`<div class="drop" id="dz" tabindex="0" role="button">Drop PDFs here or click to choose<br><small>Multiple files · max 50 MB each</small><input id="fi" type="file" accept="application/pdf,.pdf" multiple hidden></div><p class="err" id="er"></p>
<div id="ls" class="panel" style="padding:0;border:0;box-shadow:none;gap:8px"></div><p class="note" id="st" aria-live="polite"></p>
<div class="row"><button class="btn" id="go" disabled>Merge PDFs</button><button class="btn ghost" id="rs">Clear all</button></div>`;
let F=[];const er=$('#er',r),dz=$('#dz',r),fi=$('#fi',r);
const draw=()=>{$('#ls',r).innerHTML=F.map((f,i)=>`<div class="li"><span>${i+1}. ${f.name.replace(/[<>&"]/g,'')} (${bytes(f.size)})</span><button class="btn ghost" data-a="u${i}" ${i?'':'disabled'} aria-label="Move up">↑</button><button class="btn ghost" data-a="d${i}" ${i<F.length-1?'':'disabled'} aria-label="Move down">↓</button><button class="btn ghost" data-a="x${i}" aria-label="Remove">✕</button></div>`).join('');$('#go',r).disabled=F.length<2};
const add=fs=>{er.textContent='';for(const f of fs){if(!(f.type==='application/pdf'||/\.pdf$/i.test(f.name))){er.textContent=`"${f.name}" is not a PDF and was skipped.`;continue}
if(f.size>52428800){er.textContent=`"${f.name}" is larger than 50 MB and was skipped.`;continue}F.push(f)}draw()};
dz.onclick=()=>fi.click();dz.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fi.click()}};fi.onchange=()=>{add([...fi.files]);fi.value=''};
dz.ondragover=e=>{e.preventDefault();dz.classList.add('on')};dz.ondragleave=()=>dz.classList.remove('on');dz.ondrop=e=>{e.preventDefault();dz.classList.remove('on');add([...e.dataTransfer.files])};
$('#ls',r).onclick=e=>{const a=e.target.dataset?.a;if(!a)return;const i=+a.slice(1);if(a[0]==='x')F.splice(i,1);else{const j=a[0]==='u'?i-1:i+1;[F[i],F[j]]=[F[j],F[i]]}draw()};
$('#rs',r).onclick=()=>{F=[];er.textContent=$('#st',r).textContent='';draw()};
$('#go',r).onclick=async()=>{const go=$('#go',r),st=$('#st',r);er.textContent='';go.disabled=true;
try{st.textContent='Loading PDF engine…';await load(PDF_SRC);const{PDFDocument}=PDFLib,out=await PDFDocument.create();
for(let i=0;i<F.length;i++){st.textContent=`Merging ${i+1} of ${F.length}: ${F[i].name}`;
try{const src=await PDFDocument.load(await F[i].arrayBuffer());(await out.copyPages(src,src.getPageIndices())).forEach(p=>out.addPage(p))}
catch{throw new Error(`"${F[i].name}" is damaged or password-protected and cannot be merged.`)}}
const b=await out.save();dl(new Blob([b],{type:'application/pdf'}),'merged.pdf');st.textContent=`Done: ${out.getPageCount()} pages, ${bytes(b.length)}.`}
catch(e){er.textContent=e.message;st.textContent=''}finally{go.disabled=F.length<2}}}};

/* ---------- App shell ---------- */
const IDS=Object.keys(T),POP=['percentage','bmi','qr-generator','image-resizer'],B=document.body.dataset.base||'',tid=document.body.dataset.tool;
const card=id=>`<a class="card" href="${B}tools/${id}.html"><span class="ic">${T[id].icon}</span><h3>${T[id].name}</h3><p>${T[id].desc}</p></a>`;
const rec=()=>LS.get('recent',[]).filter(i=>T[i]);
if(tid&&T[tid]){
LS.set('recent',[tid,...rec().filter(i=>i!==tid)].slice(0,4));T[tid].render($('#panel'));
const u=encodeURIComponent(location.href.split('#')[0]),tx=encodeURIComponent(T[tid].name+' – EverydayTools');
$('#wa').href=`https://wa.me/?text=${tx}%20${u}`;$('#tg').href=`https://t.me/share/url?url=${u}&text=${tx}`;$('#xx').href=`https://twitter.com/intent/tweet?url=${u}&text=${tx}`;
$('#cu').onclick=e=>copy(location.href,e.target);
}else{
$('#search').oninput=e=>{const s=e.target.value.toLowerCase().trim(),m=IDS.filter(i=>!s||(T[i].name+T[i].desc).toLowerCase().includes(s));$('#all').innerHTML=m.length?m.map(card).join(''):'<p class="note">No tools match. Try “convert” or “PDF”.</p>'};
const r=rec();$('#recentS').hidden=!r.length;$('#rec').innerHTML=r.map(card).join('');}
document.documentElement.dataset.theme=LS.get('theme',matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
$('#theme').onclick=()=>{const n=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;LS.set('theme',n)};
