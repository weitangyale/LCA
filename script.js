(() => {
'use strict';
const host=document.getElementById('robot');
const scene=new THREE.Scene();scene.background=new THREE.Color(0xb9d9ef);
const camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(6.1,5.3,16.8);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xb9d9ef,1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;host.appendChild(renderer.domElement);
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.target.set(0,2.05,-2.0);controls.enableDamping=true;controls.minDistance=4;controls.maxDistance=37;controls.maxPolarAngle=Math.PI*.485;camera.lookAt(controls.target);
scene.add(new THREE.HemisphereLight(0xe9e6ef,0x211822,1.45));const sun=new THREE.DirectionalLight(0xffffff,2.35);sun.position.set(-8,16,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;sun.shadow.normalBias=.025;scene.add(sun);const fill=new THREE.PointLight(0xf6bb84,1.05,13);fill.position.set(-4,4,4);scene.add(fill);
const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.55,metalness:.12});const white=mat(0xf3f5fa),dark=mat(0x1a1723),metal=mat(0x737582),blue=new THREE.MeshStandardMaterial({color:0x42bbff,emissive:0x0a82ff,emissiveIntensity:1.6,roughness:.16}),black=mat(0x080a15);
function box(parent,w,h,d,x,y,z,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);parent.add(o);return o}
function sphere(parent,r,x,y,z,m){const o=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),m);o.position.set(x,y,z);parent.add(o);return o}
function pivot(parent,x,y,z){const o=new THREE.Group();o.position.set(x,y,z);parent.add(o);return o}
// ===== V10 robot: rounded shell, face screen, curved smiling LED eyes =====
function roundedGeometry(w,h,depth,r=.1){
 const shape=new THREE.Shape(),x=-w/2,y=-h/2;
 shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);
 shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
 shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);
 shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
 const g=new THREE.ExtrudeGeometry(shape,{depth:Math.max(.015,depth-.09),bevelEnabled:true,bevelThickness:.045,bevelSize:.045,bevelSegments:3,steps:1,curveSegments:6});
 g.translate(0,0,-(depth-.09)/2);g.computeVertexNormals();return g;
}
function roundedBox(parent,w,h,d,x,y,z,m,r=.12){
 const o=new THREE.Mesh(roundedGeometry(w,h,d,r),m);o.position.set(x,y,z);parent.add(o);return o;
}
const robot=new THREE.Group();scene.add(robot);robot.traverse(o=>{if(o.isMesh){o.castShadow=true}});
const armor=new THREE.MeshStandardMaterial({color:0xf1f1f3,metalness:.08,roughness:.32});
const screenMat=new THREE.MeshStandardMaterial({color:0x070c15,metalness:.1,roughness:.12});
const eyeMat=new THREE.MeshBasicMaterial({color:0x7ddcff});
const eyeGlow=new THREE.MeshBasicMaterial({color:0x128bff,transparent:true,opacity:.28});
roundedBox(robot,1.30,1.12,.64,0,2.78,0,armor,.17);
roundedBox(robot,1.12,.12,.55,0,3.37,0,dark,.05);
roundedBox(robot,.86,.30,.51,0,2.13,0,metal,.08);
roundedBox(robot,.19,.19,.20,0,3.49,0,metal,.05);
// Head is intentionally larger and softer, like the reference render.
const head=roundedBox(robot,.95,.72,.59,0,3.93,0,armor,.19);
const face=roundedBox(robot,.78,.49,.05,0,3.94,.315,screenMat,.16);
function smileEye(cx){
 const points=[],glowPoints=[];
 for(let i=0;i<=24;i++){
  const t=i/24;
  const x=cx+(t-.5)*.245;
  const y=3.915+.117*Math.sin(Math.PI*t);
  points.push(new THREE.Vector3(x,y,.375));
  glowPoints.push(new THREE.Vector3(x,y,.372));
 }
 const curve=new THREE.CatmullRomCurve3(points);
 const glowCurve=new THREE.CatmullRomCurve3(glowPoints);
 robot.add(new THREE.Mesh(new THREE.TubeGeometry(glowCurve,32,.033,8,false),eyeGlow));
 robot.add(new THREE.Mesh(new THREE.TubeGeometry(curve,32,.016,8,false),eyeMat));
}
smileEye(-.215);smileEye(.215);
// Four-line Las Cruces Academy Computing Club chest label.
const chestCanvas=document.createElement('canvas');chestCanvas.width=512;chestCanvas.height=600;
const chestCtx=chestCanvas.getContext('2d');
chestCtx.clearRect(0,0,512,600);
chestCtx.fillStyle='#8b1538';chestCtx.textAlign='center';chestCtx.textBaseline='middle';
chestCtx.font='bold 78px Arial, sans-serif';
['Las Cruces','Academy','Computing','Club'].forEach((line,i)=>chestCtx.fillText(line,256,116+i*115,490));
const chestTexture=new THREE.CanvasTexture(chestCanvas);chestTexture.encoding=THREE.sRGBEncoding;
const chestPanel=new THREE.Mesh(new THREE.PlaneGeometry(.98,.90),new THREE.MeshBasicMaterial({map:chestTexture,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
chestPanel.position.set(0,2.78,.372);robot.add(chestPanel);
const joints=[];
function register(name,parent,axis,min,max){joints.push({name,parent,axis,min,max});return parent}
function arm(side){const s=side==='Left'?-1:1;const shoulder=pivot(robot,s*.75,3.11,0);sphere(shoulder,.16,0,0,0,metal);
register(side+' shoulder forward',shoulder,'x',-180,90);
const roll=pivot(shoulder,0,0,0);register(side+' shoulder sideways',roll,'z',side==='Left'?-180:0,side==='Left'?0:180);
roundedBox(roll,.34,.66,.36,0,-.38,0,armor,.09);box(roll,.32,.24,.36,0,-.25,0,dark);
const elbow=pivot(roll,0,-.78,0);sphere(elbow,.13,0,0,0,metal);register(side+' elbow',elbow,'x',-125,0);
roundedBox(elbow,.30,.60,.33,0,-.36,0,armor,.09);box(elbow,.31,.14,.33,0,-.57,0,dark);box(elbow,.23,.24,.25,0,-.77,.02,metal);
}
function leg(side){const s=side==='Left'?-1:1;const hip=pivot(robot,s*.36,2.05,0);sphere(hip,.16,0,0,0,metal);register(side+' hip forward',hip,'x',-85,85);
const hipRoll=pivot(hip,0,0,0);register(side+' hip sideways',hipRoll,'z',side==='Left'?-45:0,side==='Left'?0:45);
roundedBox(hipRoll,.46,.75,.46,0,-.45,0,armor,.09);box(hipRoll,.44,.24,.45,0,-.29,0,dark);
const knee=pivot(hipRoll,0,-.90,0);sphere(knee,.15,0,0,0,metal);register(side+' knee',knee,'x',0,120);
roundedBox(knee,.40,.69,.42,0,-.42,0,armor,.09);box(knee,.40,.22,.43,0,-.30,0,dark);
const ankle=pivot(knee,0,-.87,0);sphere(ankle,.13,0,0,0,metal);register(side+' ankle forward',ankle,'x',-55,55);
const ankleRoll=pivot(ankle,0,0,0);register(side+' ankle sideways',ankleRoll,'z',-35,35);
roundedBox(ankleRoll,.49,.19,.80,0,-.11,.18,armor,.08);box(ankleRoll,.43,.07,.76,0,-.21,.18,dark);
}
arm('Left');arm('Right');leg('Left');leg('Right');
const sliders=document.getElementById('sliders');joints.forEach((j,i)=>{const div=document.createElement('div');div.className='joint';const label=document.createElement('label');const name=document.createElement('span');name.textContent=String(i+1).padStart(2,'0')+' · '+j.name;const value=document.createElement('output');value.textContent='0°';label.append(name,value);const input=document.createElement('input');input.type='range';input.min=j.min;input.max=j.max;input.value=0;input.step=1;input.addEventListener('input',()=>{j.parent.rotation[j.axis]=Number(input.value)*Math.PI/180;value.textContent=input.value+'°'});div.append(label,input);sliders.appendChild(div);j.input=input;j.value=value});
function getPose(){return joints.map(j=>Number(j.input.value))}
function setPose(pose){joints.forEach((j,i)=>{const angle=Math.max(j.min,Math.min(j.max,Number(pose[i])||0));j.parent.rotation[j.axis]=angle*Math.PI/180;j.input.value=angle;j.value.textContent=angle+'°'})}
const status=document.getElementById('status');
function announce(msg){status.textContent=msg}
let savedPoses=[],frames=[],playing=false,playToken=0,selected=-1;
function stopPlayback(){playing=false;playToken++;document.getElementById('playDance').disabled=false}
function resetPose(){stopPlayback();setPose(Array(joints.length).fill(0));announce('Reset to neutral pose.')}
document.getElementById('reset').addEventListener('click',resetPose);
document.getElementById('mirrorPose').addEventListener('click',()=>{
 stopPlayback();const old=getPose(),newPose=old.slice();
 for(let i=0;i<joints.length;i++){
  const name=joints[i].name;
  const other=name.startsWith('Left ')?'Right '+name.slice(5):name.startsWith('Right ')?'Left '+name.slice(6):null;
  if(!other)continue;
  const j=joints.findIndex(j=>j.name===other);
  if(j<0)continue;
  const sign=name.includes('sideways')?-1:1;
  newPose[i]=Math.max(joints[i].min,Math.min(joints[i].max,old[j]*sign));
 }
 setPose(newPose);announce('Mirrored left/right joint poses.');
});
function validPose(p){return Array.isArray(p)&&p.length===joints.length&&p.every(x=>typeof x==='number'&&Number.isFinite(x))}
function durationValue(){const el=document.getElementById('frameDuration');const ms=Number(el.value);return Number.isFinite(ms)?Math.max(100,Math.min(10000,Math.round(ms))):500}
function makeButton(label,action){const b=document.createElement('button');b.textContent=label;b.addEventListener('click',action);return b}
function renderPoses(){
 const list=document.getElementById('savedPoses');list.replaceChildren();
 if(!savedPoses.length){list.textContent='No saved poses yet.';return}
 savedPoses.forEach((p,i)=>{
  const item=document.createElement('div');item.className='item item-line';
  const name=document.createElement('span');name.textContent=p.name;
  const actions=document.createElement('div');actions.className='item-actions';
  actions.append(
   makeButton('Apply',()=>{stopPlayback();setPose(p.angles);announce('Applied '+p.name)}),
   makeButton('Add to Dance',()=>{
    stopPlayback();frames.push({duration:durationValue(),angles:p.angles.slice()});
    selected=frames.length-1;renderFrames();announce('Added '+p.name+' as frame '+frames.length);
   }),
   makeButton('Delete',()=>{savedPoses.splice(i,1);renderPoses()})
  );
  item.append(name,actions);list.append(item);
 });
}
function renderFrames(){const list=document.getElementById('timeline');list.replaceChildren();document.getElementById('frameCount').textContent=frames.length+' frame'+(frames.length===1?'':'s');if(!frames.length){list.textContent='No frames yet. Add Frame to build a dance.';return}frames.forEach((f,i)=>{const item=document.createElement('div');item.className='item'+(i===selected?' selected':'');const top=document.createElement('div');top.className='item-line';const name=document.createElement('strong');name.textContent='Frame '+(i+1);const d=document.createElement('input');d.type='number';d.min=100;d.max=10000;d.step=100;d.value=f.duration;d.title='Duration in milliseconds';d.addEventListener('change',()=>{const v=Number(d.value);f.duration=Number.isFinite(v)?Math.max(100,Math.min(10000,Math.round(v))):500;d.value=f.duration});const ms=document.createElement('span');ms.textContent='ms';top.append(name,d,ms);const actions=document.createElement('div');actions.className='item-actions';actions.append(makeButton('Duplicate',()=>{stopPlayback();frames.splice(i+1,0,{angles:f.angles.slice(),duration:f.duration});selected=i+1;renderFrames();announce('Duplicated frame '+(i+1)+' as frame '+(i+2))}),makeButton('View',()=>{stopPlayback();selected=i;setPose(f.angles);renderFrames();announce('Viewing frame '+(i+1))}),makeButton('Update',()=>{stopPlayback();f.angles=getPose();selected=i;renderFrames();announce('Updated frame '+(i+1))}),makeButton('↑',()=>{if(i>0){[frames[i-1],frames[i]]=[frames[i],frames[i-1]];selected=-1;renderFrames()}}),makeButton('↓',()=>{if(i<frames.length-1){[frames[i+1],frames[i]]=[frames[i],frames[i+1]];selected=-1;renderFrames()}}),makeButton('Delete',()=>{stopPlayback();frames.splice(i,1);selected=-1;renderFrames()}));item.append(top,actions);list.append(item)})}
document.getElementById('savePose').addEventListener('click',()=>{stopPlayback();savedPoses.push({name:'Pose '+(savedPoses.length+1),angles:getPose()});renderPoses();announce('Pose saved. Use Apply to recall it.')});
document.getElementById('addFrame').addEventListener('click',()=>{stopPlayback();frames.push({duration:durationValue(),angles:getPose()});selected=frames.length-1;renderFrames();announce('Added frame '+frames.length)});
function lerpPose(a,b,t){return a.map((v,i)=>v+(b[i]-v)*t)}
async function playDance(){
 if(!frames.length){announce('Add at least one frame first.');return}
 stopPlayback();
 playing=true;
 const token=playToken;
 const playButton=document.getElementById('playDance');
 const loopInput=document.getElementById('loopDance');
 const speedInput=document.getElementById('playbackSpeed');
 if(!loopInput||!speedInput){playing=false;playButton.disabled=false;announce('V8.2 error: missing playback controls. Refresh page.');return}
 playButton.disabled=true;
 let from=getPose();
 let cycle=0;
 try {
  do {
   for(let i=0;i<frames.length;i++){
    if(!playing||token!==playToken)return;
    selected=i;renderFrames();
    const to=frames[i].angles.slice();
    const speed=Number(speedInput.value)||1;
    const duration=frames[i].duration/speed;
    announce('Playing · cycle '+(cycle+1)+' · frame '+(i+1)+'/'+frames.length+' · '+speed+'×'+(loopInput.checked?' · Loop ON':' · Loop OFF'));
    const start=performance.now();
    await new Promise(resolve=>{
     function tick(now){
      if(!playing||token!==playToken){resolve();return}
      const t=Math.min(1,(now-start)/duration);
      setPose(lerpPose(from,to,t));
      if(t<1)requestAnimationFrame(tick);
      else resolve();
     }
     requestAnimationFrame(tick);
    });
    if(!playing||token!==playToken)return;
    from=to;
   }
   cycle++;
   if(playing&&token===playToken&&loopInput.checked) announce('Loop ON · completed '+cycle+' cycle(s), restarting…');
  } while(playing&&token===playToken&&loopInput.checked&&frames.length);
  if(playing&&token===playToken)announce('Dance complete! (Loop '+(loopInput.checked?'ON':'OFF')+', '+(Number(speedInput.value)||1)+'×)');
 } finally {
  if(token===playToken){playing=false;playButton.disabled=false}
 }
}
document.getElementById('playDance').addEventListener('click',playDance);
document.getElementById('stopDance').addEventListener('click',()=>{stopPlayback();announce('Playback stopped.')});
document.getElementById('downloadDance').addEventListener('click',()=>{const data={format:'RoboSoulDanceStudio',version:1,joints:joints.map(j=>({name:j.name,min:j.min,max:j.max})),poses:savedPoses,frames};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='lca-computing-club-dance.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Dance JSON downloaded.')});
document.getElementById('loadDance').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());if(data.format!=='RoboSoulDanceStudio'||data.version!==1||!Array.isArray(data.frames)||data.frames.length>2000||!data.frames.every(f=>validPose(f.angles)&&Number.isFinite(f.duration)&&f.duration>=100&&f.duration<=10000)||!Array.isArray(data.poses)||data.poses.length>2000||!data.poses.every(p=>typeof p.name==='string'&&validPose(p.angles))||!Array.isArray(data.joints)||data.joints.length!==joints.length||!data.joints.every((j,i)=>j.name===joints[i].name))throw Error('Incompatible or invalid dance JSON');stopPlayback();frames=data.frames.map(f=>({angles:f.angles.slice(),duration:f.duration}));savedPoses=data.poses.map(p=>({name:p.name.slice(0,80),angles:p.angles.slice()}));selected=-1;renderFrames();renderPoses();announce('Dance loaded: '+frames.length+' frames.')}catch(err){announce('Could not load: '+err.message)}e.target.value=''});
renderPoses();renderFrames();


// ===== Photo-informed, fully 3D reconstruction of Las Cruces Academy entrance =====
// Scale and hidden surfaces are approximate: the references are photos, not architectural plans.
const stage=new THREE.Group();scene.add(stage);
const stageTheme=document.getElementById('stageTheme');
const stageLights=document.getElementById('stageLights');
const school=new THREE.Group();stage.add(school);
const facade=mat(0xe5dfd1),sideStucco=mat(0xd9d1c1),roofMat=mat(0xd2d0c7);
const trim=mat(0x673b45),concrete=mat(0xbcbab1),stone=mat(0xb6aa97);
const glass=new THREE.MeshPhysicalMaterial({color:0x527785,metalness:.24,roughness:.15,transparent:true,opacity:.83,clearcoat:.85});
const darkFrame=mat(0x513e43),gravel=mat(0xb08e77);
const pavement=mat(0x45474b),earth=mat(0x6e5544);
function block(parent,w,h,d,x,y,z,material,cast=true){
 const o=box(parent,w,h,d,x,y,z,material);o.castShadow=cast;o.receiveShadow=true;return o;
}
function plane(parent,w,h,x,y,z,material,rx=0){
 const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);
 o.position.set(x,y,z);o.rotation.x=rx;o.receiveShadow=true;parent.add(o);return o;
}
function cyl(parent,r1,r2,h,x,y,z,material,n=12){
 const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,n),material);
 o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;
}
// Textured stucco and desert ground use deterministic procedural texture; no external image downloads.
function noiseTexture(base,variance,size=256,scale=1){
 const c=document.createElement('canvas');c.width=c.height=size;
 const ctx=c.getContext('2d');ctx.fillStyle=base;ctx.fillRect(0,0,size,size);
 let seed=38183;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<size*size*.19;i++){
  const x=rand()*size,y=rand()*size,a=rand()*.23;
  ctx.fillStyle=rand()>.5?'rgba(255,255,255,'+a+')':'rgba(46,31,20,'+(a*.6)+')';
  ctx.fillRect(x,y,1+rand()*2*variance,1+rand()*2*variance);
 }
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(scale,scale);t.encoding=THREE.sRGBEncoding;return t;
}
facade.map=noiseTexture('#e9e4d8',1,256,5);facade.color.setHex(0xffffff);facade.needsUpdate=true;
sideStucco.map=noiseTexture('#ded7ca',1,256,4);sideStucco.color.setHex(0xffffff);sideStucco.needsUpdate=true;
gravel.map=noiseTexture('#b79c83',3,256,12);gravel.color.setHex(0xffffff);gravel.needsUpdate=true;
// Large natural desert landscape and subtle concrete front apron.
block(stage,90,.18,90,0,-.38,-3,gravel,false);
block(stage,42,.065,10.2,0,-.24,12.6,pavement,false);
// Side parking bays and white line markings.
const whiteLine=new THREE.MeshBasicMaterial({color:0xdedbd3});
for(let x of [-17,-13,-9,9,13,17]){
 block(stage,.055,.015,3.4,x,-.197,11.3,whiteLine,false);
}
block(stage,38,.014,.07,0,-.195,10.1,whiteLine,false);
// School is set back behind the robot, facing the camera.
const wallZ=-10.8;
block(school,25.2,5.65,3.8,0,2.62,wallZ-1.5,facade);
block(school,8.3,6.1,4.0,-8.9,2.85,wallZ-1.1,facade);
block(school,8.3,6.1,4.0,8.9,2.85,wallZ-1.1,facade);
block(school,7.5,6.75,3.8,-3.8,3.14,wallZ-1.8,facade);
block(school,7.5,6.75,3.8,3.8,3.14,wallZ-1.8,facade);
// Parapet roof lines.
block(school,25.7,.28,4.1,0,5.57,wallZ-1.5,sideStucco);
block(school,15.0,.22,4.05,0,6.32,wallZ-1.75,roofMat);
block(school,6.4,.25,4.2,0,6.56,wallZ-1.65,roofMat);
// Recessed central entry: two side returns, shaded portico, red columns and beam.
const doorZ=wallZ+.38;
block(school,4.1,3.45,.13,0,1.56,doorZ,sideStucco);
block(school,.23,3.3,2.15,-2.22,1.55,wallZ+1.18,sideStucco);
block(school,.23,3.3,2.15,2.22,1.55,wallZ+1.18,sideStucco);
block(school,5.3,.35,2.45,0,3.37,wallZ+1.25,trim);
block(school,5.3,.13,2.48,0,3.08,wallZ+1.26,trim);
for(const x of [-2.4,2.4]){
 block(school,.22,3.2,.24,x,1.47,wallZ+2.28,trim);
 block(school,.32,.13,.38,x,2.99,wallZ+2.28,trim);
}
const glassZ=wallZ+.49;
block(school,2.54,2.52,.07,0,1.34,glassZ,glass);
block(school,.075,2.65,.13,0,1.36,glassZ+.08,darkFrame);
for(const x of [-1.29,1.29])block(school,.09,2.64,.13,x,1.36,glassZ+.08,darkFrame);
for(const y of [.1,2.66])block(school,2.7,.08,.13,0,y,glassZ+.08,darkFrame);
block(school,2.68,.055,.11,0,2.10,glassZ+.09,darkFrame);
for(const x of [-.1,.1])block(school,.065,.17,.1,x,.98,glassZ+.17,stone);
// Reflective window panels, dark burgundy mullions; accurately placed left and right.
function windowAt(x,y,z,w=2.15,h=1.85){
 block(school,w+.19,h+.19,.15,x,y,z-.07,darkFrame);
 block(school,w,h,.09,x,y,z+.04,glass);
 block(school,.07,h,.13,x,y,z+.13,darkFrame);
 block(school,w,.065,.13,x,y,z+.13,darkFrame);
 block(school,w,.055,.13,x,y+.31,z+.14,darkFrame);
 const reflect=new THREE.MeshBasicMaterial({color:0xc0d9e2,transparent:true,opacity:.20,depthWrite:false});
 plane(school,w*.38,h*.94,x-w*.23,y,z+.105,reflect);
}
windowAt(-7.3,2.46,wallZ+.48,2.4,2.0);
windowAt(7.3,2.46,wallZ+.48,2.4,2.0);
windowAt(-11.2,2.5,wallZ+.45,1.55,1.65);
windowAt(11.2,2.5,wallZ+.45,1.55,1.65);
// Wall mounted lighting and simple exterior signage.
const lampMat=mat(0xd8d3c7);
for(const x of [-8.7,8.7]){
 block(school,.33,.18,.25,x,4.62,wallZ+.55,lampMat);
 block(school,.24,.07,.18,x,4.50,wallZ+.68,new THREE.MeshBasicMaterial({color:0xfff1d7}));
}
// Concrete path extends from the building to the front edge.
block(stage,4.75,.09,20.9,0,-.225,.42,concrete,false);
for(let z=-8.1;z<10.7;z+=2.65){
 block(stage,4.74,.007,.028,0,-.169,z,mat(0x8c8981),false);
}
block(stage,.035,.009,20.9,-2.38,-.166,.42,mat(0xd2cfc8),false);
block(stage,.035,.009,20.9,2.38,-.166,.42,mat(0xd2cfc8),false);
// Stone-lined desert tree beds; curved low retaining walls.
const rockMaterials=[mat(0xc9c1b2),mat(0xb1a899),mat(0xa69c8e),mat(0xd2c7b6)];
function makeBed(cx,cz,rx,rz){
 const soil=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.06,64),earth);
 soil.scale.set(rx,1,rz);soil.position.set(cx,-.23,cz);soil.receiveShadow=true;stage.add(soil);
 for(let i=0;i<76;i++){
  const a=i/76*Math.PI*2;
  const r=1+.027*Math.sin(i*4.2);
  const x=cx+rx*r*Math.cos(a),z=cz+rz*r*Math.sin(a);
  const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.16+(i%5)*.013,0),rockMaterials[i%4]);
  rock.position.set(x,-.14,z);rock.scale.set(1.65,.68,.75);rock.rotation.y=-a;rock.castShadow=true;stage.add(rock);
 }
}
// Main right tree island and smaller left tree bed, based on the reference views.
makeBed(7.25,-.3,3.6,3.0);
makeBed(-7.2,-.8,3.15,2.5);
// Branches, non-spherical irregular foliage clusters and leaf patches.
const bark=mat(0x655a4c),leafMaterials=[
 new THREE.MeshStandardMaterial({color:0x465c45,roughness:1,flatShading:true}),
 new THREE.MeshStandardMaterial({color:0x566a50,roughness:1,flatShading:true}),
 new THREE.MeshStandardMaterial({color:0x69765b,roughness:1,flatShading:true}),
 new THREE.MeshStandardMaterial({color:0x3c5041,roughness:1,flatShading:true})
];
function seeded(seed){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}}
function branch(parent,from,to,radius){
 const d=new THREE.Vector3().subVectors(to,from);
 const o=new THREE.Mesh(new THREE.CylinderGeometry(radius*.72,radius,d.length(),7),bark);
 o.position.copy(from).add(to).multiplyScalar(.5);
 o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());
 o.castShadow=true;parent.add(o);
}
function tree(x,z,seed,scale=1){
 const r=seeded(seed),g=new THREE.Group();g.position.set(x,-.20,z);g.scale.setScalar(scale);stage.add(g);
 const origin=new THREE.Vector3(0,0,0);
 const tips=[];
 for(let k=0;k<5;k++){
  const a=k*Math.PI*2/5+r()*.5;
  const base=new THREE.Vector3((r()-.5)*.45,0,(r()-.5)*.35);
  const mid=new THREE.Vector3(Math.cos(a)*(.48+r()*.5),1.5+r()*.7,Math.sin(a)*(.48+r()*.5));
  const tip=new THREE.Vector3(Math.cos(a)*(1.55+r()*1.1),3.15+r()*1.0,Math.sin(a)*(1.3+r()*.85));
  branch(g,base,mid,.15);branch(g,mid,tip,.09);
  tips.push(tip);
  for(let j=0;j<4;j++){
   const off=new THREE.Vector3((r()-.5)*1.5,(r()-.5)*.8,(r()-.5)*1.5);
   branch(g,mid.clone().lerp(tip,.4),tip.clone().add(off),.037);
  }
 }
 for(let i=0;i<92;i++){
  const tip=tips[i%tips.length],angle=r()*Math.PI*2,rr=Math.sqrt(r())*1.7;
  const px=tip.x+Math.cos(angle)*rr,py=tip.y+(r()-.5)*1.3,pz=tip.z+Math.sin(angle)*rr;
  const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.48+r()*.43,1),leafMaterials[i%4]);
  crown.position.set(px,py,pz);crown.scale.set(1.4+r()*.7,.42+r()*.45,1.1+r()*.65);
  crown.rotation.set(r()*.6,r()*6.28,r()*.3);crown.castShadow=true;g.add(crown);
 }
}
tree(7.3,-.3,87321,1.06);
tree(-7.2,-.8,13429,.94);
// Sparse desert shrubs along the facade.
function shrub(x,z,seed){
 const r=seeded(seed),g=new THREE.Group();g.position.set(x,-.2,z);stage.add(g);
 for(let i=0;i<10;i++){
  const a=r()*6.28,rad=r()*.35;
  const o=new THREE.Mesh(new THREE.IcosahedronGeometry(.16+r()*.18,1),leafMaterials[i%4]);
  o.position.set(Math.cos(a)*rad,.16+r()*.23,Math.sin(a)*rad);o.scale.set(1.2,.5,1.15);g.add(o);
 }
}
for(let x=-12;x<=12;x+=1.7){if(Math.abs(x)>3.5)shrub(x,-8.8,Math.floor((x+14)*100));}
// Optional scene styles: all retain full 3D geometry.
const sceneThemes={
 entrance:{sky:0xb9d9ef,ambient:1.45,exposure:1.15},
 concert:{sky:0x201b2b,ambient:.82,exposure:.92},
 studio:{sky:0xbcc8d1,ambient:1.55,exposure:1.1},
 space:{sky:0x081226,ambient:.7,exposure:.85}
};
stageTheme.addEventListener('change',()=>{
 const t=sceneThemes[stageTheme.value]||sceneThemes.entrance;
 scene.background.setHex(t.sky);renderer.toneMappingExposure=t.exposure;
 announce('3D Scene: '+stageTheme.options[stageTheme.selectedIndex].text);
});
// Soft ambient accent lighting, subdued in daylight.
const lights=[new THREE.PointLight(0xffdfbd,.28,12),new THREE.PointLight(0xd9e9ff,.22,12)];
lights[0].position.set(-3,4,3);lights[1].position.set(3,4,3);lights.forEach(l=>stage.add(l));
// Add cast shadows to all robot pieces after complete assembly.
robot.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}window.addEventListener('resize',resize);resize();
function animate(time){
 requestAnimationFrame(animate);
 controls.update();
 const moving=stageLights.checked;
 lights[0].intensity=moving?.75+.22*Math.sin(time*.002):.65;
 lights[1].intensity=moving?.45+.12*Math.sin(time*.0018+1.2):.38;
 renderer.render(scene,camera);
}
requestAnimationFrame(animate);
})();
