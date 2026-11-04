(() => {
'use strict';
const host=document.getElementById('robot');
const scene=new THREE.Scene();scene.background=null;
const camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(0,3.05,9.9);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;host.appendChild(renderer.domElement);
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.target.set(0,2.05,0);controls.enableDamping=true;controls.minDistance=3.5;controls.maxDistance=17;camera.lookAt(controls.target);
scene.add(new THREE.HemisphereLight(0xe9e6ef,0x211822,1.45));const sun=new THREE.DirectionalLight(0xffffff,2.35);sun.position.set(4,8,6);scene.add(sun);const fill=new THREE.PointLight(0xf6bb84,1.05,13);fill.position.set(-4,4,4);scene.add(fill);
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
const robot=new THREE.Group();scene.add(robot);
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


// ===== LCA entrance: real photo behind transparent 3D robot =====
const stage=new THREE.Group();scene.add(stage);
const stageTheme=document.getElementById('stageTheme');
const stageLights=document.getElementById('stageLights');
const backdrop=document.querySelector('.campus-backdrop');
const ground=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.1),new THREE.MeshBasicMaterial({color:0x1e1715,transparent:true,opacity:.095,depthWrite:false}));
ground.rotation.x=-Math.PI/2;ground.position.set(0,-.235,.1);stage.add(ground);
const lights=[
 new THREE.PointLight(0xffe2bb,.75,12),
 new THREE.PointLight(0xd5e9ff,.45,12)
];
lights[0].position.set(-3,4,4);lights[1].position.set(3,4,3);
lights.forEach(l=>stage.add(l));
const themeColors={entrance:'#d6c7b7',concert:'#27101d',studio:'#283344',space:'#07152c'};
stageTheme.addEventListener('change',()=>{
 const theme=stageTheme.value;
 backdrop.style.display=theme==='entrance'?'block':'none';
 host.style.background=theme==='entrance'?'transparent':themeColors[theme];
 ground.visible=theme==='entrance';
 announce('Scene: '+stageTheme.options[stageTheme.selectedIndex].text);
});
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
