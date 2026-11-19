'use strict';
(()=>{
const battleStyles=".relay-duel{--chalk:#fff9e9;--muted:#bcc9d7;--aqua:#9fe6dd;--gold:#ffda86;--shade:#171627;position:fixed;inset:0;overflow:hidden;isolation:isolate;background:#759cc3;font:20px/1.1 'Roost Menu',monospace;color:var(--chalk);cursor:default;touch-action:none}\n.relay-duel *{box-sizing:border-box}.relay-duel canvas{position:absolute;inset:0;width:100%;height:100%;cursor:grab}.relay-duel canvas:active{cursor:grabbing}\n.relay-duel button{appearance:none;border:0;border-radius:0;background:none;color:inherit;font:inherit;cursor:pointer;text-shadow:inherit}\n.duel-top,.duel-dock,.duel-result,.duel-float{text-shadow:1px 1px var(--shade),2px 2px var(--shade)}\n.duel-top{position:absolute;inset:max(14px,env(safe-area-inset-top)) clamp(16px,3vw,40px) auto;display:flex;align-items:flex-start;justify-content:space-between;pointer-events:none}\n.duel-foe{padding:7px 19px 8px 8px;background:linear-gradient(90deg,#111a2ba6 50%,transparent);min-width:150px}\n.duel-name,.duel-health,.duel-signal,.duel-outcomes{display:flex;align-items:baseline;gap:9px}\n.duel-name{font-size:20px}.duel-name small,.duel-health small{font:inherit;white-space:nowrap}\n.duel-name small{font-size:14px;color:#f2e3cf}.duel-bar{display:block;height:4px;box-shadow:0 1px #090e18;background:#273147}.duel-bar i{display:block;height:100%;background:#f3a176;transition:width .25s}\n.duel-foe .duel-bar{max-width:132px;margin:5px 0 7px}.duel-intent{font-size:15px;max-width:240px;color:#f7e9cd}.duel-intent strong{font-weight:400;color:var(--gold)}.duel-intent span:not(:empty)::before{content:' · '}\n.duel-exit{pointer-events:auto;font-size:16px!important;min-height:38px;padding:2px 5px;color:#fff8e6!important;text-shadow:-1px -1px #1a2630,1px -1px #1a2630,-1px 1px #1a2630,2px 2px #1a2630!important}\n.duel-exit:focus-visible,.duel-exit:hover{color:var(--gold)!important;text-decoration:underline}\n.duel-dock{position:absolute;bottom:max(17px,env(safe-area-inset-bottom));left:clamp(16px,3vw,40px);pointer-events:none}\n.duel-menu,.duel-result{border:2px solid #c3cad9;border-radius:2px;background:linear-gradient(115deg,#25395cf5,#1b2949f7 45%,#162039f7);box-shadow:inset 1px 1px #596884,inset -2px -2px #0b1127,1px 1px 0 1px #263044,2px 3px 0 1px #0e1723aa}\n.duel-menu{display:flex;align-items:stretch;padding:5px 3px;pointer-events:auto}\n.duel-commands{display:flex;flex-direction:column;justify-content:center;min-width:120px;padding:0 8px 0 3px}\n.duel-command,.duel-outcomes button{position:relative;text-align:left;font:inherit;color:var(--chalk);padding:3px 6px 3px 28px;line-height:1.12}\n.duel-command[aria-disabled=true]{color:#8995ab}.duel-command:focus,.duel-outcomes button:focus{outline:0}\n.duel-command::before,.duel-outcomes button::before{content:'';position:absolute;left:3px;top:50%;width:18px;height:12px;transform:translateY(-50%);background:linear-gradient(0deg,#a3b4c6 0 24%,#fff8dc 25% 67%,#fffef0 68%);clip-path:polygon(0 25%,22% 25%,22% 8%,50% 8%,50% 0,61% 0,61% 18%,96% 18%,96% 27%,100% 27%,100% 38%,61% 38%,61% 52%,73% 52%,73% 65%,63% 65%,63% 80%,50% 80%,50% 97%,19% 97%,19% 78%,0 78%);visibility:hidden}\n.duel-command.selected::before,.duel-outcomes button:focus-visible::before{visibility:visible}\n@media(hover:hover){.duel-commands:has(:hover) .duel-command::before{visibility:hidden}.duel-commands .duel-command:hover::before,.duel-outcomes button:hover::before{visibility:visible}}\n.duel-status{padding:4px 12px 4px 13px;border-left:1px solid #8490aa88;align-self:stretch;display:flex;flex-direction:column;justify-content:center;gap:5px}\n.duel-status .duel-name{line-height:1;margin-bottom:4px}.duel-health,.duel-signal{align-items:center;justify-content:space-between;font-size:16px;gap:13px}\n.duel-health b,.duel-signal b{font-weight:400;color:var(--aqua)}.duel-health .duel-bar{width:55px;height:3px}.duel-health i{background:#92d7b6}\n.duel-signal span{color:var(--gold);letter-spacing:2px}.duel-float{position:absolute;transform:translate(-50%,-50%);font-size:32px;color:#fff5bc;pointer-events:none}\n.duel-result{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);padding:14px 23px;text-align:center}.duel-result h2{font:inherit;font-size:27px;color:var(--gold);margin:0 0 13px}.duel-outcomes{justify-content:center;gap:8px}.duel-outcomes button{white-space:nowrap;font-size:18px}\n.relay-duel [hidden]{display:none!important}\n@media(max-width:640px){.duel-dock{left:12px;bottom:max(13px,env(safe-area-inset-bottom))}.duel-top{left:8px;right:10px}.duel-intent{font-size:13px}.duel-menu{padding-block:3px}.duel-status{padding-inline:9px}.duel-health .duel-bar{width:34px}}\n@media(pointer:coarse){.duel-command,.duel-outcomes button{min-height:42px}.duel-exit{min-height:44px}.duel-command::before{width:15px}}\n@media(max-height:480px){.duel-dock{left:12px;bottom:8px}.duel-top{top:6px}.duel-command{min-height:25px;font-size:17px;padding-block:2px}.duel-name{font-size:17px}.duel-foe{padding-top:2px}.duel-status .duel-name{margin:0}}\n@media(prefers-reduced-motion:reduce){.duel-bar i{transition:none}}\n";
// All geometry in the clearing uses metres. Leaf vertices carry individual wind weights.
const TAU=Math.PI*2, clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),mix=(a,b,t)=>a+(b-a)*t;
const add=(a,b,k=1)=>a.map((n,i)=>n+k*b[i]),sub=(a,b)=>add(a,b,-1),mul=(a,k)=>a.map(n=>n*k);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],norm=a=>mul(a,1/(Math.hypot(...a)||1));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const lerp=(a,b,t)=>a.map((n,i)=>mix(n,b[i],t));
const tint=(c,t)=>c.map(n=>clamp(n*t,0,255));
function rng(seed){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296}}
class Geometry{
  constructor(){this.data=[];this.kind=0;this.phase=0;}
  vertex(p,n,c,w){this.data.push(...p,...n,c[0]/255,c[1]/255,c[2]/255,w,this.phase,this.kind)}
  tri(a,b,c,color,weights=[0,0,0],normal=null){
    const n=normal||norm(cross(sub(b,a),sub(c,a)));
    this.vertex(a,n,color,weights[0]);this.vertex(b,n,color,weights[1]);this.vertex(c,n,color,weights[2]);
  }
  quad(a,b,c,d,color,w=[0,0,0,0]){
    this.tri(a,b,c,color,[w[0],w[1],w[2]]);this.tri(a,c,d,color,[w[0],w[2],w[3]]);
  }
  tube(a,b,r,R,c,sides=7){
    const axis=norm(sub(b,a)),u=norm(cross(axis,Math.abs(axis[1])>.9?[1,0,0]:[0,1,0])),v=cross(axis,u);
    const ring=i=>add(mul(u,Math.cos(TAU*i/sides)),v,Math.sin(TAU*i/sides));
    for(let j=0;j<sides;j++){
      const m=ring(j),n=ring(j+1),p=add(a,m,r),q=add(a,n,r),s=add(b,m,R),t=add(b,n,R);
      this.quad(p,q,t,s,c);this.tri(a,q,p,c);this.tri(b,s,t,c);
    }
  }
  ball(p,r,c,sides=12,rows=7){
    const u=(a,b)=>[Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)];
    for(let j=0;j<rows;j++)for(let i=0;i<sides;i++){
      const base=TAU*i/sides,next=TAU*(i+1)/sides,top=Math.PI*j/rows,bot=Math.PI*(j+1)/rows;
      const ns=[u(base,top),u(base,bot),u(next,bot),u(next,top)];
      for(const k of [0,1,2,0,2,3]){const n=ns[k];this.vertex(add(p,n.map((v,k)=>v*r[k])),norm(n.map((v,k)=>v/r[k])),c,0)}
    }
  }
  finish(){this.data=new Float32Array(this.data);return this;}
}
function importedMesh(world,start,end,origin){
  const geom=new Geometry(),src=world.painted,vs=src.vertices,ix=src.indices,a=src.atlas;
  for(const b of src.batches){
    if(b.base>=end)break;
    for(let i=b.offset;i<b.offset+b.count;i+=3){
      const indices=[ix[i]+b.base,ix[i+1]+b.base,ix[i+2]+b.base];if(indices[0]<start||indices[0]>=end)continue;
      const q=indices.map(k=>[vs[k*6]-origin[0],vs[k*6+1]-origin[1],vs[k*6+2]-origin[2]]);
      const n=norm(cross(sub(q[1],q[0]),sub(q[2],q[0])));
      for(let j=0;j<3;j++){const k=indices[j]*6,uv=4*(Math.min(src.height-1,Math.floor(vs[k+4]*src.height))*src.width+Math.min(src.width-1,Math.floor(vs[k+3]*src.width)));
        geom.vertex(q[j],n,tint([a[uv],a[uv+1],a[uv+2]],1.14),0);}
    }
  }
  return geom.finish();
}
function floorY(x,z){
  const margin=clamp((Math.hypot(x,z)-2.7)/6);
  return margin*(.10*Math.sin(x*1.02+z*.48)+.15*Math.sin(z*.79)-.045*Math.min(25,Math.abs(z)));
}
const relayTower={site:[2.75,-1.85,-28],dishScale:2.36};
function besideTower(x,z,height){
  const [tx,,tz]=relayTower.site;
  // Widen the opening beyond the concrete as the viewing rays diverge behind it.
  // The last term covers lateral parallax at the extremes of the battle camera.
  const ratio=(4.65-z)/(4.65-tz),center=tx*ratio;
  const halfWidth=1.45*relayTower.dishScale*ratio+.34*height+.17*Math.abs(z-tz);
  if(Math.abs(x-center)>=halfWidth)return x;
  const side=x<center?-1:1,offset=.6+2.1*Math.abs(Math.sin(4.3*x+.81*z));
  return center+side*(halfWidth+offset);
}
function makeClearing(world,low){
  const rand=rng(47119),between=(a,b)=>mix(a,b,rand()),pick=a=>a[Math.floor(rand()*a.length)];
  const land=new Geometry(),plants=new Geometry(),horizon=new Geometry(),clouds=new Geometry();
  const foliage=[[63,94,53],[100,126,57],[149,160,66],[168,173,73],[89,121,56],[180,174,83]];
  const stem=[79,90,51],bark=[120,95,69];
  // The floor has real relief and a worn diagonal strip passing under both fighters.
  const cols=low?32:78,rows=low?34:77;
  const terrainPoint=(i,j)=>{const x=-34+i/cols*68,z=9-j/rows*60;return [x,floorY(x,z),z]};
  land.kind=1;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const p=terrainPoint(i,j);
    const corners=[p,terrainPoint(i+1,j),terrainPoint(i+1,j+1),terrainPoint(i,j+1)];
    for(const k of [0,1,2,0,2,3]){
      const q=corners[k],value=.50+.25*Math.sin(q[0]*.63+q[2]*.4)+.16*Math.sin(q[2]*1.71);
      land.vertex(q,[0,1,0],lerp([95,124,66],[169,173,88],value),0);
    }
  }
  // Long mountain folds and the far belt of conifers establish depth behind the relay.
  for(let k=0;k<3;k++){
    let prev;const z=-58+k*10,base=k===0?[131,157,180]:k===1?[121,150,156]:[99,136,127];
    for(let i=0;i<=80;i++){const x=-92+i*2.4,y=3+k*.18+1.8*Math.sin(x*.095+k)+.9*Math.sin(x*.41+k*5)+between(-.3,.3)+(2-k)*1.35;
      const top=[x,y,z+Math.sin(x*.25)],bot=[x,-4,z+4];if(prev)horizon.quad(prev[0],prev[1],bot,top,tint(base,between(.95,1.05)));prev=[top,bot];}
  }
  function pine(x,z,size){
    const base=floorY(x,z),s=size,g=horizon;g.kind=2;
    g.tube([x,base,z],[x,base+s*.87,z],s*.040,s*.012,[91,95,79],5);
    for(let k=0;k<5;k++){
      const y=base+s*(.14+.14*k),radius=s*(.23-.034*k),tip=[x+s*.025, y+s*(.43-.04*k),z];
      const col=tint(pick([[54,85,70],[70,102,78],[83,115,81]]),.81+k*.064);
      let prev;
      for(let j=0;j<=12;j++){
        const a=TAU*j/12,r=radius*(j%2?.82:1.1),p=[x+r*Math.cos(a),y+(j%2?.078:0)*s,z+r*Math.sin(a)];
        if(prev)g.tri(prev,tip,p,col);prev=p;
      }
      // Drooping sprays break the solid skirt into uneven branch tips.
      for(let j=0;j<(low?4:10);j++){
        const a=j*2.399+k*.89+x,dir=[Math.cos(a),0,Math.sin(a)],side=[-dir[2],0,dir[0]];
        const base=[x,y+s*.19,z],end=add([x,y+s*between(-.002,.12),z],dir,radius*between(.94,1.34));
        const center=lerp(base,end,.62),width=radius*between(.18,.34);
        const edge=add(center,side,width),other=add(center,side,-width);edge[1]-=radius*.26;other[1]-=radius*.25;
        g.tri(base,edge,end,tint(col,1.11));g.tri(base,end,other,tint(col,.91));
        g.tri(edge,add(lerp(edge,end,.38),side,width*.48),end,tint(col,.94));
      }
    }
  }
  for(let i=0;i<(low?105:236);i++){const z=between(-40,-10),x=between(-32,31);if(z>-27&&Math.abs(x-2.2)<4.8)continue;
    const height=between(2.4,6.3);pine(besideTower(x,z,height),z,height);}
  // A high rounded head, staggered shoulders and a low trailing shelf give each
  // cloud a readable silhouette. Thumbprint-sized depressions separate the billows.
  clouds.kind=5;
  const banks=[[-15,10.1,-48,6.0,1,'crown'],[17,10.4,-47,5.4,-1,'bank'],[2,13,-62,4.1,-1,'wisp'],
    [34,15,-59,6.2,1,'bank'],[-37,13,-59,7,-1,'crown'],[-7.2,6.9,-42,2.65,1,'wisp']];
  const billows=[
    [-1.26,-.018,.05,.36,.12,.26],[-1.07,.047,.01,.30,.22,.29],[-.82,.15,-.02,.34,.34,.41],
    [-.54,.31,-.01,.42,.49,.44],[-.22,.20,-.10,.33,.33,.39],[.07,.12,-.08,.36,.31,.40],
    [.39,.075,.012,.32,.23,.33],[.64,-.005,.045,.37,.15,.27],[1.0,-.04,.01,.53,.10,.23],
    [1.38,-.060,-.02,.39,.060,.14],[-.64,.055,.30,.26,.22,.22],[-.21,.017,.32,.34,.18,.20],[.26,-.016,.25,.40,.13,.18]
  ];
  for(const [cx,cy,cz,size,direction,shape] of banks){
    const lobes=billows.map(([x,y,z,rx,ry,rz])=>{
      const swell=between(.85,1.15),rise=between(-.047,.047),depth=between(-.075,.075);
      if(shape==='wisp')return [x*direction,.10*x+.10*Math.sin(2.8*x)+y*.22+rise*.5,z+depth,rx*1.17,ry*.34,rz*.67];
      if(shape==='bank')return [x*direction,y*.57+rise,z+depth,rx*1.08,ry*swell*.82,rz];
      return [x*direction,y+rise,z+depth,rx*swell,ry*swell,rz];
    });
    if(shape==='crown')lobes.push([-.61*direction,.56,-.10,.30,.41,.39],[-.25*direction,.37,-.11,.24,.40,.31],[.26*direction,.21,.11,.24,.24,.23]);
    if(shape==='bank')lobes.push([.23*direction,.26,-.055,.35,.32,.30],[.55*direction,.22,-.12,.22,.32,.26],[-1.0*direction,.12,.08,.27,.21,.24]);
    function density(p){
      let sum=0;for(const b of lobes){const x=(p[0]-b[0])/b[3],y=(p[1]-b[1])/b[4],z=(p[2]-b[2])/b[5];
        const d=x*x+y*y+z*z;if(d<6)sum+=Math.exp(-2*d);}
      const shelf=-.155+.030*p[0]*direction+.023*Math.sin(p[0]*4.3+p[2]);
      return Math.min(sum-.235,(p[1]-shelf)*4.0);
    }
    const dims=low?[34,15,12]:[61,27,20],values=[],positions=[];
    const index=(i,j,k)=>i+dims[0]*(j+dims[1]*k);
    for(let k=0;k<dims[2];k++)for(let j=0;j<dims[1];j++)for(let i=0;i<dims[0];i++){
      const p=[-1.94+3.88*i/(dims[0]-1),-.32+1.53*j/(dims[1]-1),-.85+1.72*k/(dims[2]-1)];positions.push(p);values.push(density(p));
    }
    const offsets=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],cache=new Map();
    const isopoint=(a,b)=>{
      const key=Math.min(a,b)*positions.length+Math.max(a,b);if(cache.has(key))return cache.get(key);
      const p=lerp(positions[a],positions[b],values[a]/(values[a]-values[b]));
      const n=norm([0,1,2].map(k=>{const q=p.slice();q[k]+=.025;const hi=density(q);q[k]-=.05;return density(q)-hi}));
      const out=[add([cx,cy,cz],p,size),n];cache.set(key,out);return out;
    };
    for(let k=0;k<dims[2]-1;k++)for(let j=0;j<dims[1]-1;j++)for(let i=0;i<dims[0]-1;i++){
      const ids=offsets.map(([a,b,c])=>index(i+a,j+b,k+c));if(ids.every(v=>values[v]<0)||ids.every(v=>values[v]>=0))continue;
      for(const tet of [[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6],[0,5,1,6]]){
        const on=tet.map(v=>ids[v]).filter(v=>values[v]>=0),off=tet.map(v=>ids[v]).filter(v=>values[v]<0);
        if(!on.length||!off.length)continue;const face=[];
        if(on.length===2){
          const a=isopoint(on[0],off[0]),b=isopoint(on[0],off[1]),c=isopoint(on[1],off[1]),d=isopoint(on[1],off[0]);face.push(a,b,c,a,c,d);
        }else{const one=on.length===1?on[0]:off[0];for(const v of (on.length===1?off:on))face.push(isopoint(one,v));}
        for(const [p,n] of face)clouds.vertex(p,n,[252,247,223],0);
      }
    }
    // Detached slivers beneath the shelf taper to a point in all three dimensions.
    for(const [u,v,length,radius] of [[.88,-.28,1.12,.057],[-.75,-.24,.47,.035]]){
      let last;
      for(let i=0;i<=16;i++){
        const t=i/16,k=Math.sin(Math.PI*t),width=k*(1.15-.48*t)*radius;
        const x=cx+size*direction*(u+(t-.5)*length),y=cy+size*(v+t*.052-.020*k),z=cz+.15*size;
        const ring=[];
        for(let j=0;j<8;j++){const a=TAU*j/8;ring.push([x,y+size*width*Math.sin(a),z+size*width*3.1*Math.cos(a)])}
        if(last)for(let j=0;j<8;j++){
          const n=(j+1)%8,normal=norm([0,Math.sin((j+.5)*TAU/8),Math.cos((j+.5)*TAU/8)*.45]);
          for(const p of [last[j],last[n],ring[n],last[j],ring[n],ring[j]])clouds.vertex(p,normal,[250,247,228],0);
        }
        last=ring;
      }
    }
  }
  function leaf(p,dir,len,width,fold,col,weight){
    const f=norm(dir),side=norm(cross(f,[.09,1,.15]));let prev;
    for(let i=0;i<=4;i++){const t=i/4,s=Math.sin(t*Math.PI);
      const mid=add(p,f,len*t);mid[1]+=len*(.19*s-.13*t*t);
      const l=add(mid,side,-width*s),r=add(mid,side,width*s);l[1]-=s*fold;r[1]-=s*fold;
      const w=weight*(.30+.70*t);
      if(prev){const [L,M,R,v]=prev;plants.quad(L,M,mid,l,col,[v,v,w,w]);plants.quad(M,R,r,mid,tint(col,.84),[v,v,w,w]);}
      prev=[l,mid,r,w];
    }
  }
  function wood(path,r0,r1,base){
    const rings=[],sides=9;
    for(let k=0;k<path.length;k++){
      const t=k/(path.length-1),r=mix(r0,r1,t),axis=norm(sub(path[Math.min(k+1,path.length-1)],path[Math.max(0,k-1)]));
      const side=norm(cross(axis,Math.abs(axis[2])>.86?[1,0,0]:[0,0,1])),across=cross(axis,side);
      const ring=[];for(let j=0;j<sides;j++){const a=TAU*j/sides+.27*t,rad=r*(1+.14*Math.sin(3*a+2*t));ring.push(add(add(path[k],side,rad*Math.cos(a)),across,rad*Math.sin(a)))}rings.push(ring);
    }
    plants.kind=3;
    for(let k=1;k<rings.length;k++)for(let j=0;j<sides;j++){
      const a=rings[k-1],b=rings[k],n=(j+1)%sides;
      plants.quad(a[j],a[n],b[n],b[j],tint(base,.71+.41*(.5+.5*Math.sin(j*2.8+k*.31))));
      if(r0>.26&&j%2===0){const P=lerp(a[j],a[n],.47),Q=lerp(b[j],b[n],.55);plants.tube(P,Q,r0*.028,r0*.015,tint(base,.65),4);}
    }
    plants.kind=2;
  }
  function orchard(x,z,sz,hero=false){
    const y=floorY(x,z),p=(a,b,c)=>[x+a*sz,y+b*sz,z+c*sz];
    wood([p(0,-.12,0),p(-.16,.7,.09),p(-.03,1.2,0),p(.27,1.8,-.13),p(.18,2.4,-.12)],.36*sz,.14*sz,bark);
    for(let j=0;j<7;j++){const a=j*TAU/7;wood([p(0,.35,0),p(.43*Math.cos(a),.09,.43*Math.sin(a)),p(.79*Math.cos(a),0,.76*Math.sin(a))],.14*sz,.018*sz,bark)}
    const heads=hero?10:7;
    for(let k=0;k<heads;k++){
      const a=k*2.39,reach=between(.74,1.65),cx=Math.cos(a)*reach+.22,cz=Math.sin(a)*reach,cy=2.1+between(.13,.95);
      const top=p(cx,cy,cz);wood([p(.12,1.25+.12*(k%4),0),p(cx*.46,cy-.72,cz*.48),p(cx*.79,cy-.49,cz*.79),top],.14*sz,.032*sz,bark);
      const count=hero?(low?10:34):(low?6:17);
      for(let j=0;j<count;j++){
        const b=j*2.399+between(-.19,.19),reach=between(.14,.72)*sz;
        const q=add(top,[Math.cos(b)*reach,between(-.22,.18)*sz,Math.sin(b)*reach]),phase=between(0,TAU);
        if(j%2===0)plants.tube(top,q,.019*sz,.005*sz,[104,100,62],4);
        for(let n=0;n<(low?3:7);n++){
          const h=b+(n-3)*.53+between(-.15,.15),l=between(.15,.36)*sz;
          const start=lerp(top,q,.50+.5*n/7);plants.phase=phase;
          leaf(start,[Math.cos(h),between(-.56,.25),Math.sin(h)],l,l*between(.16,.26),l*.059,pick(foliage),.026*sz);
        }
        if(j%8===3){const fruit=add(q,[0,-.105*sz,0]);plants.ball(fruit,[.061*sz,.079*sz,.057*sz],pick([[222,166,63],[206,177,64]]),8,5)}
      }
    }
  }
  orchard(-4.3,-2.2,2.2,true);orchard(6.7,-7.7,1.5);orchard(-9,-11,1.8);orchard(10.2,-17,1.82);
  function fern(x,z,sz,near){
    const y=floorY(x,z)-.02;
    for(let j=0;j<(near?9:6);j++){
      const a=TAU*j/(near?9:6)+between(-.25,.25),length=sz*between(.67,1.12),dir=[Math.cos(a),0,Math.sin(a)],across=[-dir[2],0,dir[0]];
      const col=near?pick([[42,81,56],[70,103,59],[91,122,64],[60,92,63]]):pick(foliage);
      const at=t=>[x+dir[0]*length*(t*.36+.65*t*t),y+length*(1.75*t-1.09*t*t),z+dir[2]*length*(t*.36+.65*t*t)];
      plants.phase=a+x*.82;const wind=near?.105*length:.046*length;
      let prev=at(0);const pairs=low?6:near?18:9;
      for(let i=1;i<=pairs;i++){
        const t=i/pairs,q=at(t),base=at((i-.4)/pairs),wide=length*(.045+.18*Math.sin(t*Math.PI))*(1-.40*t);
        const rib=mul(across,.0075*length*(1-.7*t));
        plants.quad(sub(prev,rib),add(prev,rib),add(q,rib),sub(q,rib),stem,[wind*(t-1/pairs)**2,wind*(t-1/pairs)**2,wind*t*t,wind*t*t]);prev=q;
        for(const s of [-1,1]){
          const tip=add(add(base,across,s*wide),dir,wide*.51);tip[1]+=wide*(.19-.28*t);
          const mid=lerp(base,tip,.48),wing=mul(dir,wide*(near?.29:.23));mid[1]+=wide*.28;wing[1]=wide*.20;
          tip[1]-=wide*.21;
          const w=wind*t*t;
          if(near){
            let previous;const steps=low?4:8;
            for(let k=0;k<=steps;k++){
              const v=k/steps,arch=Math.sin(Math.PI*v),width=arch*(k%2?.75:1.0);
              const rib=lerp(base,tip,v);rib[1]+=wide*.18*arch;
              const a=add(rib,wing,width*.66),b=add(rib,wing,-width*.66);a[1]-=wide*.20*arch;b[1]-=wide*.085*arch;
              const weight=w+.022*v;
              if(previous){const [pa,pm,pb,pw]=previous;
                plants.quad(pa,pm,rib,a,tint(col,1.05+.11*v),[pw,pw,weight,weight]);
                plants.quad(pm,pb,b,rib,tint(col,1.25+.12*v),[pw,pw,weight,weight]);}
              if(k>0&&k<steps&&k%2===0){
                const ribWidth=mul(dir,.004*length),lineEnd=lerp(rib,a,.90);
                plants.tri(add(rib,ribWidth),sub(rib,ribWidth),lineEnd,tint(col,1.46),[weight,weight,weight]);
              }
              previous=[a,rib,b,weight];
            }
          }else{plants.tri(base,add(mid,wing),tip,col,[w,w+.014,w+.030]);plants.tri(base,tip,sub(mid,wing),tint(col,1.17),[w,w+.030,w+.014]);}
        }
      }
    }
  }
  // Near-lens clumps overlap the fighters during a camera truck. Each rachis flexes from its root.
  for(const [x,z,s] of [[-1.14,2.99,1.05],[1.44,3.02,1.17],[-1.99,2.55,1.02],[2.25,2.59,.89]])fern(x,z,s,true);
  for(let i=0;i<(low?24:68);i++){const x=between(-12,12),z=between(-15,2.2);if(Math.abs(x)<2.7&&z>-3)continue;fern(x,z,between(.21,.67),false);}
  // Cross-lit citrus sprays enter from just outside the lens; the folded lamina and midrib
  // have thickness even when seen from below. The branch stays fixed as the camera trucks.
  for(const [start,tip,spray] of [
    [[-3.6,2.60,2.2],[-1.35,1.98,2.42],.42],
    [[-2.65,2.91,.55],[-.92,2.47,1.15],.40],
    [[3.4,2.74,1.75],[1.19,2.03,2.35],.46],
    [[2.22,.12,2.45],[1.04,.73,2.25],.31]
  ]){
    const branch=[start,lerp(start,tip,.34),lerp(start,tip,.69),tip];branch[1][1]-=.10;branch[2][1]-=.06;
    wood(branch,.046,.009,[101,91,57]);
    for(let j=1;j<=13;j++){
      const t=j/14,base=lerp(start,tip,t),side=j%2?1:-1;
      const end=add(base,[side*.075,-.055,side*.13]);
      plants.tube(base,end,.012,.006,[110,111,65],5);plants.phase=start[0]*2+t;
      const direction=[(start[0]>0?-.47:.47)+.25*side,-.63+.16*side,side*.80];
      leaf(end,direction,spray*(.74+.32*Math.sin(t*Math.PI)),spray*.216,spray*.106,
        pick([[53,83,59],[82,102,59],[96,117,67],[131,140,74]]),.066);
    }
  }
  // Independent blades, meadow flowers and broken slabs along the edge of the beaten path.
  for(let i=0;i<(low?1300:6600);i++){
    const x=between(-14,14),z=between(-18,3.6),y=floorY(x,z),dist=Math.abs(z+.18*x+.25);
    if(dist<.92&&rand()<.93)continue;
    const h=between(.042,.16),shade=pick([[106,134,65],[164,169,77],[124,145,69],[189,180,95]]);
    plants.phase=x+z;for(let j=0;j<3;j++){const a=j*2.399+z,dx=Math.cos(a)*h*.19,dz=Math.sin(a)*h*.19;
      const L=[x-dx*.62,y-.014,z-dz*.62],R=[x+dx*.62,y-.014,z+dz*.62],m=[x+dz*.70,y+h*.57,z-dx*.70],tip=[x+dz*3.3,y+h*(1+j*.20),z-dx*3.3];
      plants.quad(L,R,[m[0]+dx*.32,m[1],m[2]+dz*.32],[m[0]-dx*.32,m[1],m[2]-dz*.32],shade,[0,0,h*.045,h*.045]);
      plants.tri([m[0]-dx*.32,m[1],m[2]-dz*.32],[m[0]+dx*.32,m[1],m[2]+dz*.32],tip,tint(shade,1.10),[h*.045,h*.045,h*.17]);}
    if(i%31===0)plants.ball([x,y+h,z],[.035,.021,.033],i%3?[237,206,107]:[229,209,192],5,3);
  }
  for(let i=0;i<92;i++){const x=between(-16,16),z=between(-18,2);if(Math.abs(x)<2.2&&z>-3)continue;
    const rad=between(.10,.61);land.ball([x,floorY(x,z)-.045,z],[rad,rad*.44,rad*.74],pick([[119,129,107],[145,145,117],[92,111,94]]),7,4);}
  const model=world.relayModels,[start,mid,end]=model.dish;
  const mount=importedMesh(world,start,mid,model.dishBase),dish=importedMesh(world,mid,end,world.dishPivot),bird=importedMesh(world,...model.bird,model.birdOrigin);
  return {land:land.finish(),plants:plants.finish(),horizon:horizon.finish(),clouds:clouds.finish(),mount,dish,bird};
}

function battleRobot(){
  const groups=Array.from({length:10},()=>new Geometry());let g=groups[0];
  const getColor=c=>Array.isArray(c)?c:[145,163,166];
  buildYardRobot({standing:true,tree:[-.14,0,-.47],land:()=>0,barrier(){},setGroup(){},part:n=>{g=groups[n]},
    quad:(a,b,c,d,col,step,grain,emit)=>{g.kind=emit?4:0;g.quad(a,b,c,d,getColor(col));g.kind=0},
    line:(a,b,r,col)=>g.tube(a,b,r,r,col,6),pipe:(a,b,r,R,col,step,n)=>g.tube(a,b,r,R,col,n||8),
    ellipsoid:(p,r,col)=>g.ball(p,r,col,12,7)});
  for(const s of [-1,1]){
    g=groups[s<0?7:8];
    g.quad([s*.10,.44,-.155],[s*.23,.45,-.14],[s*.21,.55,-.141],[s*.10,.57,-.147],[130,155,159]);
  }
  g=groups[9];g.kind=4;for(let i=0;i<5;i++)g.tube([-.103,.443+i*.023,-.155],[.103,.443+i*.023,-.155],.011,.011,[255,155,61],8);
  return groups.map(g=>g.finish());
}
const I=[1,0,0,0,1,0,0,0,1];
function orientation(y=0,x=0,z=0,s=1){
  const cy=Math.cos(y),sy=Math.sin(y),cx=Math.cos(x),sx=Math.sin(x),cz=Math.cos(z),sz=Math.sin(z);
  return [cy*cz+sy*sx*sz,cx*sz,-sy*cz+cy*sx*sz,-cy*sz+sy*sx*cz,cx*cz,sy*sz+cy*sx*cz,sy*cx,-sx,cy*cx].map(v=>v*s);
}
function transformed(m,p){return [0,1,2].map(k=>m[k]*p[0]+m[k+3]*p[1]+m[k+6]*p[2])}
function compose(a,b){return [...transformed(a,b.slice(0,3)),...transformed(a,b.slice(3,6)),...transformed(a,b.slice(6,9))]}
const projectionGL=`
uniform vec3 camera,right,up,forward,offset;
uniform mat3 model;uniform vec2 lens;uniform float clock;
vec4 project(vec3 p){vec3 d=p-camera;float z=dot(d,forward);return vec4(dot(d,right)*lens.x,dot(d,up)*lens.y,1.0013342*z-.2001334,z);}
`;
const windGL=`float wind(vec3 p,float phase){return sin(clock*1.48+phase*.61+p.z*.64)+.36*sin(clock*2.15+p.x*1.17+phase);}`;
const meshVS=`precision highp float;
attribute vec3 point,normal,color,detail;`+projectionGL+windGL+`
varying vec3 pos,n,ink;varying float kind;
void main(){vec3 q=point;float k=wind(q,detail.y)*detail.x;q.x+=k;q.z+=k*.36;q.y+=.14*abs(k);
pos=model*q+offset;n=normalize(model*normal);kind=detail.z;ink=color;gl_Position=project(pos);}`;
const meshFS=`precision highp float;
varying vec3 pos,n,ink;varying float kind;uniform vec3 camera;uniform float clock;uniform vec4 feet;
float hash(vec2 p){vec3 a=fract(vec3(p.xyx)*.1031);a+=dot(a,a.yzx+33.33);return fract((a.x+a.y)*a.z);}
float wash(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float footprint(vec2 p,vec2 f,float s){vec2 v=(p-f-vec2(.09,-.055))*vec2(2.8,4.5)/s;return exp(-dot(v,v));}
void main(){vec3 normal=normalize(n);vec3 sun=normalize(vec3(-.58,.81,.47));
float diffuse=dot(normal,sun);if(kind>1.5&&kind<2.5)diffuse=abs(diffuse)*.80+.14;
float light=.79+.23*diffuse+.08*max(0.,normal.y);
vec2 surface=pos.xz+vec2(.24,.65)*pos.y;
float large=wash(surface*.85),grain=wash(surface*8.7);
vec3 c=ink*light*(.969+.040*large+.023*grain);
if(kind>.5&&kind<1.5){
 float trail=1.-smoothstep(.38,1.34,abs(pos.z+.18*pos.x+.24+.24*sin(pos.x*1.1))+(large-.5)*.85);
 c=mix(c,vec3(.70,.62,.421),trail*(.66+.15*large));
 float leafShade=wash(pos.xz*1.3+vec2(.10*sin(clock*.48),.04*clock))*.57+wash(pos.xz*3.5)*.43;
 float patch=(1.-smoothstep(.42,.56,leafShade))*(1.-smoothstep(0.,5.,length(pos.xz-vec2(-2.8,-.8))));
 c*=1.-.34*patch;
 float sh=max(footprint(pos.xz,feet.xy,.95),footprint(pos.xz,feet.zw,.94));c*=1.-.51*sh;
 vec2 shadowOffset=vec2(.42,-.20);float shade=max(footprint(pos.xz,feet.xy+shadowOffset,1.38),footprint(pos.xz,feet.zw+shadowOffset*.80,1.13));c*=1.-.21*shade;
 c*=.94+.10*large+.045*floor(grain*3.)/3.;
}
if(kind>2.5&&kind<3.5)c*=.82+.22*wash(vec2(pos.x*7.+pos.z*6.,pos.y*.9))+.10*grain;
if(kind>3.5&&kind<4.5)c=ink;
if(kind>4.5){
  float tone=diffuse+.32*normal.y;
  c=mix(vec3(.61,.70,.85),vec3(.76,.84,.91),smoothstep(-.53,-.48,tone));
  c=mix(c,vec3(.957,.949,.877),smoothstep(-.12,-.07,tone));
  c=mix(c,vec3(1.,.989,.926),smoothstep(.57,.63,tone));
}
float dist=length(camera-pos);float fog=kind>4.5?.08:smoothstep(8.,70.,dist)*.67;c=mix(c,vec3(.68,.80,.86),fog);
gl_FragColor=vec4(c,1.);}`;
const splatVS=`precision highp float;
attribute vec3 point,color,cov0,cov1;`+projectionGL+`uniform float pixelF;
varying vec3 ink,conic;varying float size;
void main(){vec3 p=point;gl_Position=project(p);float invZ=1./max(.1,gl_Position.w);
mat3 cov=mat3(cov0.x,cov0.y,cov0.z,cov0.y,cov1.x,cov1.y,cov0.z,cov1.y,cov1.z);
vec3 d=p-camera, ax=right-forward*dot(d,right)*invZ,ay=up-forward*dot(d,up)*invZ;
float f=pixelF*invZ;float a=dot(ax,cov*ax)*f*f+.16,b=-dot(ax,cov*ay)*f*f,c=dot(ay,cov*ay)*f*f+.16;
conic=vec3(c,-b,a)/max(.0001,a*c-b*b);size=clamp(1.+3.94*sqrt(.5*(a+c+sqrt((a-c)*(a-c)+4.*b*b))),1.,96.);gl_PointSize=size;ink=color;}`;
const splatFS=`precision highp float;varying vec3 ink,conic;varying float size;
void main(){vec2 d=(gl_PointCoord-.5)*size;float q=d.x*d.x*conic.x+2.*d.x*d.y*conic.y+d.y*d.y*conic.z;if(q>3.4)discard;gl_FragColor=vec4(ink*(1.-.012*q),1.);}`;
function cameraRig(w,h,steer,vertical,impact,reduced,clock){
  const aspect=w/h,dist=Math.max(4.65,5.00/Math.max(.37,aspect));
  const yaw=.035+steer*.39+(reduced?0:.012*Math.sin(clock*.36));
  const eye=[Math.sin(yaw)*dist,1.02+.065*dist+vertical*.6,Math.cos(yaw)*dist+.18-impact*.25];
  const target=[impact*.08,1.00+vertical*.65,-.70],forward=norm(sub(target,eye)),right=norm(cross(forward,[0,1,0])),up=cross(right,forward);
  const focal=1/Math.tan(.354);return {eye,right,up,forward,lens:[focal/aspect,focal]};
}
function glBattle(canvas,gl){
  const programs=[],buffers=[],store=new Map();
  function program(v,f){
    const p=gl.createProgram();programs.push(p);
    for(const [type,src] of [[gl.VERTEX_SHADER,v],[gl.FRAGMENT_SHADER,f]]){
      const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));gl.attachShader(p,s);gl.deleteShader(s);
    }gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));
    const a={},u={};for(const k of ['point','normal','color','detail','cov0','cov1'])a[k]=gl.getAttribLocation(p,k);
    for(const k of ['camera','right','up','forward','offset','model','lens','clock','feet','pixelF','skyAspect'])u[k]=gl.getUniformLocation(p,k);
    return {p,a,u};
  }
  const mesh=program(meshVS,meshFS),splat=program(splatVS,splatFS);
  const sky=program('attribute vec3 point;varying vec2 uv;void main(){uv=point.xy;gl_Position=vec4(point.xy,.99999,1.);}',`precision mediump float;varying vec2 uv;
    void main(){float t=smoothstep(-.22,1.,uv.y);gl_FragColor=vec4(mix(vec3(.79,.88,.87),vec3(.31,.61,.89),t)+.037*max(0.,-uv.x),1.);}`);
  function buf(data,dynamic=false){const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,dynamic?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);return b}
  const skyBuf=buf(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]));let heroBuffer;
  function attrs(pg,layout,stride,on){for(const [k,off] of layout){const i=pg.a[k];if(i<0)continue;if(on){gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,3,gl.FLOAT,false,stride,off)}else gl.disableVertexAttribArray(i)}}
  const geoAttrs=[['point',0],['normal',12],['color',24],['detail',36]],actorAttrs=[['point',0],['color',12],['cov0',24],['cov1',36]];
  function uniforms(pg,c,t,f){const u=pg.u;gl.useProgram(pg.p);for(const [k,a] of [['camera',c.eye],['right',c.right],['up',c.up],['forward',c.forward]])gl.uniform3fv(u[k],a);
    gl.uniform2fv(u.lens,c.lens);gl.uniform1f(u.clock,t);if(u.feet)gl.uniform4fv(u.feet,f);}
  let rig,time,feet;
  return {begin(c,t,f){rig=c;time=t;feet=f;gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.64,.80,.91,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
    gl.useProgram(sky.p);gl.bindBuffer(gl.ARRAY_BUFFER,skyBuf);attrs(sky,[['point',0]],12,true);gl.drawArrays(gl.TRIANGLES,0,3);attrs(sky,[['point',0]],12,false);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
    uniforms(mesh,c,t,f);
  },mesh(g,off=[0,0,0],mat=I){
    if(!g.data.length)return;
    if(!store.has(g))store.set(g,buf(g.data));gl.bindBuffer(gl.ARRAY_BUFFER,store.get(g));attrs(mesh,geoAttrs,48,true);
    gl.uniform3fv(mesh.u.offset,off);gl.uniformMatrix3fv(mesh.u.model,false,mat);gl.drawArrays(gl.TRIANGLES,0,g.data.length/12);attrs(mesh,geoAttrs,48,false);
  },actor(actor){uniforms(splat,rig,time,feet);gl.uniform1f(splat.u.pixelF,canvas.height*.5*rig.lens[1]);
    if(!heroBuffer)heroBuffer=buf(actor.packed,true);else{gl.bindBuffer(gl.ARRAY_BUFFER,heroBuffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,actor.packed)}
    attrs(splat,actorAttrs,52,true);gl.drawArrays(gl.POINTS,0,actor.count);attrs(splat,actorAttrs,52,false);uniforms(mesh,rig,time,feet);
  },end(){},dispose(){for(const b of buffers)gl.deleteBuffer(b);for(const p of programs)gl.deleteProgram(p);gl.getExtension('WEBGL_lose_context')?.loseContext();}};
}
// Shared perspective and a software z-buffer keep the same leaf/actor occlusion without WebGL.
function softwareBattle(canvas){
  const ctx=canvas.getContext('2d',{alpha:false});
  let image,pixels,depth,w,h,rig,cameraT,groundFeet;const screen=new Float64Array(9);
  function rgb(r,g,b){return (255<<24)|((clamp(b,0,255)|0)<<16)|((clamp(g,0,255)|0)<<8)|(clamp(r,0,255)|0)}
  function project(x,y,z,i){
    const d=rig.eye;x-=d[0];y-=d[1];z-=d[2];const f=rig.forward,r=rig.right,u=rig.up;
    const dist=x*f[0]+y*f[1]+z*f[2];if(dist<.10)return false;const iz=1/dist;
    screen[i]=(1+(x*r[0]+y*r[1]+z*r[2])*rig.lens[0]*iz)*w*.5;
    screen[i+1]=(1-(x*u[0]+y*u[1]+z*u[2])*rig.lens[1]*iz)*h*.5;screen[i+2]=iz;return true;
  }
  function triangle(ink){
    const [ax,ay,az,bx,by,bz,cx,cy,cz]=screen;
    const xmin=Math.max(0,Math.ceil(Math.min(ax,bx,cx)-.5)),xmax=Math.min(w-1,Math.floor(Math.max(ax,bx,cx)-.5));
    const ymin=Math.max(0,Math.ceil(Math.min(ay,by,cy)-.5)),ymax=Math.min(h-1,Math.floor(Math.max(ay,by,cy)-.5));if(xmin>xmax||ymin>ymax)return;
    const x1=bx-ax,y1=by-ay,x2=cx-ax,y2=cy-ay,det=x1*y2-x2*y1;if(Math.abs(det)<.015)return;
    const du=y2/det,dv=-y1/det,dyu=-x2/det,dyv=x1/det;
    let startU=du*(xmin+.5-ax)+dyu*(ymin+.5-ay),startV=dv*(xmin+.5-ax)+dyv*(ymin+.5-ay);
    for(let y=ymin;y<=ymax;y++,startU+=dyu,startV+=dyv){
      let u=startU,v=startV;for(let x=xmin,at=y*w+xmin;x<=xmax;x++,at++,u+=du,v+=dv){
        if(u<-.0001||v<-.0001||u+v>1.0001)continue;const z=az+u*(bz-az)+v*(cz-az);
        if(z>=depth[at]){depth[at]=z;pixels[at]=ink;}
      }
    }
  }
  return {begin(c,t,feet){rig=c;cameraT=t;groundFeet=feet;
    if(w!==canvas.width||h!==canvas.height){w=canvas.width;h=canvas.height;image=ctx.createImageData(w,h);pixels=new Uint32Array(image.data.buffer);depth=new Float32Array(w*h);}
    depth.fill(0);for(let y=0;y<h;y++){const t=clamp(y/(h*.72));pixels.fill(rgb(mix(80,201,t),mix(157,222,t),mix(226,220,t)),y*w,(y+1)*w)}
  },mesh(g,o=[0,0,0],m=I){const d=g.data;
    for(let i=0;i<d.length;i+=36){
      let valid=true;let ox,oz;
      for(let j=0;j<3;j++){
        const k=i+j*12,a=d[k+9],wind=a?(Math.sin(cameraT*1.48+d[k+10]*.61+d[k+2]*.64)+.36*Math.sin(cameraT*2.15+d[k]*1.17+d[k+10]))*a:0;
        const x=d[k]+wind,y=d[k+1]+.14*Math.abs(wind),z=d[k+2]+wind*.36;
        ox=o[0]+m[0]*x+m[3]*y+m[6]*z;oz=o[2]+m[2]*x+m[5]*y+m[8]*z;
        if(!project(ox,o[1]+m[1]*x+m[4]*y+m[7]*z,oz,j*3)){valid=false;break}
      }
      if(!valid)continue;
      const k=d[i+11],sun=-.58*d[i+3]+.81*d[i+4]+.47*d[i+5];let light=k===4?1:.80+.23*(k===2?Math.abs(sun):sun)+.07*Math.max(0,d[i+4]);
      let r=d[i+6]*light,g=d[i+7]*light,b=d[i+8]*light;
      if(k===1){const path=clamp(1.28-Math.abs(oz+.18*ox+.24));r=mix(r,.69,path*.72);g=mix(g,.63,path*.72);b=mix(b,.42,path*.72);
        const sh=Math.max(0,1-Math.min(Math.hypot(ox-groundFeet[0],oz-groundFeet[1]),Math.hypot(ox-groundFeet[2],oz-groundFeet[3]))*2);light=1-.3*sh;r*=light;g*=light;b*=light;}
      if(k===5){
        const v=sun+.32*d[i+4];[r,g,b]=v<-.50?[.61,.70,.85]:v<-.10?[.76,.84,.91]:v<.60?[.957,.949,.877]:[1,.989,.926];
      }
      const fog=k===5?.08:clamp((1/screen[2]-8)/73)*.58;
      triangle(rgb(255*mix(r,.68,fog),255*mix(g,.80,fog),255*mix(b,.86,fog)));
    }
  },actor(actor){const d=actor.packed;
    for(let i=0;i<d.length;i+=13){if(!project(d[i],d[i+1],d[i+2],0))continue;const x=screen[0],y=screen[1],z=screen[2];
      const rad=Math.max(.70,Math.sqrt(Math.max(d[i+6],d[i+9],d[i+11]))*h*rig.lens[1]*z*.88),ink=rgb(d[i+3]*255,d[i+4]*255,d[i+5]*255);
      for(let iy=Math.max(0,Math.floor(y-rad));iy<Math.min(h,y+rad);iy++)for(let ix=Math.max(0,Math.floor(x-rad));ix<Math.min(w,x+rad);ix++){
        const k=iy*w+ix;if((iy+.5-y)**2+(ix+.5-x)**2<=rad*rad&&z>=depth[k]){depth[k]=z;pixels[k]=ink;}
      }
    }
  },end(){ctx.putImageData(image,0,0)},dispose(){}};
}

function createYardBattle({world,actor,reduced,leave}){
  const root=document.createElement('section');root.className='relay-duel';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Relay clearing duel');
  root.innerHTML='<style>'+battleStyles+'</style><canvas tabindex="-1" aria-label="Three-dimensional relay clearing. Drag to look around the fighters."></canvas>'+
    '<div class="duel-top"><div class="duel-foe"><div class="duel-name">Yard robot <small data-foehp></small></div><span class="duel-bar"><i data-foebar></i></span><div class="duel-intent" aria-live="polite"><strong></strong><span></span></div></div><button class="duel-exit" aria-label="Return to the tree" title="Return to the tree (Esc)">‹ Leave</button></div>'+
    '<div class="duel-dock"><div class="duel-menu"><div class="duel-commands" role="group" aria-label="Battle commands">'+
    ['Strike','Brace','Birdcall'].map((a,i)=>'<button class="duel-command" data-act="'+i+'" aria-keyshortcuts="'+(i+1)+'" title="'+(i+1)+' · '+['Heel kick. Builds one signal.','Guard the next hit. Builds one signal on contact.','Spend two signal to summon the kingfisher. Strong against the exposed coil.'][i]+'">'+a+'</button>').join('')+
    '</div><div class="duel-status"><div class="duel-name">Traveler</div><div class="duel-health"><b>HP</b><small data-hp></small><span class="duel-bar"><i data-hpbar></i></span></div><div class="duel-signal"><b>Signal</b><span data-signal></span></div></div></div></div><div class="duel-float" aria-hidden="true" hidden></div>'+
    '<div class="duel-result" hidden><h2></h2><div class="duel-outcomes"><button data-retry>Retry</button><button data-leave>Return to tree</button></div></div>';
  const $=s=>root.querySelector(s),canvas=$('canvas'),buttons=[...root.querySelectorAll('[data-act]')];
  const gl=canvas.getContext('webgl',{alpha:false,depth:true,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
  const gpu=!!gl,render=gl?glBattle(canvas,gl):softwareBattle(canvas);
  let field,robot;
  try{field=makeClearing(world,!gl);robot=battleRobot()}catch(err){render.dispose();throw err}
  const wings=[];for(const s of [-1,1]){const wing=new Geometry();
    for(let j=0;j<4;j++){const a=[-.15+j*.073,.20,s*.16],b=[.14+j*.066,.15,s*(.77-j*.07)],c=[.32+j*.063,.09,s*(.96-j*.09)],d=[.16+j*.048,.10,s*.18];
      wing.quad(a,b,c,d,j%2?[151,173,170]:[218,214,178]);}
    wings.push(wing.finish());
  }
  const ladder=new Geometry();const {site,dishScale}=relayTower;
  for(const x of [-.36,.36])ladder.tube([site[0]+x,.05,site[2]+1.4],[site[0]+x,5.14,site[2]+1.4],.040,.040,[131,136,117],7);
  for(let k=0;k<21;k++)ladder.tube([site[0]-.36,.15+k*.24,site[2]+1.4],[site[0]+.36,.15+k*.24,site[2]+1.4],.031,.031,[172,150,101],6);
  ladder.finish();
  const dust=new Geometry();dust.kind=4;dust.ball([0,0,0],[.021,.029,.018],[255,210,106],6,4);dust.finish();
  const intents=[['Jab','One fist rises.'],['Ram','He digs in his heels.'],['Vent','His coil is exposed.']];
  const attacks=['Strike','Brace','Birdcall'];let hp,foe,signal,round,phase,action,elapsed,resolved,hitLabel,hitTime,targetHit,result;
  let active=true,raf=0,stamp=0,time=0,view=0,tilt=0,viewGoal=0,tiltGoal=0,drag=null,audio=null;

  let selectedCommand=0;
  function selectCommand(index){
    selectedCommand=index;buttons.forEach((button,i)=>button.classList.toggle('selected',i===index));
  }
  buttons.forEach((button,i)=>button.addEventListener('focus',()=>selectCommand(i)));
  selectCommand(0);
  const focusButton=()=>{(result?$(result==='Victory'?'[data-leave]':'[data-retry]'):buttons[0]).focus({preventScroll:true})};
  function hud(){
    $('[data-foehp]').textContent=foe+' / 72';$('[data-foebar]').style.width=(100*foe/72)+'%';
    $('[data-hp]').textContent=hp+' / 40';$('[data-hpbar]').style.width=(100*hp/40)+'%';
    $('[data-signal]').textContent=('◆'.repeat(signal))+('◇'.repeat(2-signal));$('[data-signal]').setAttribute('aria-label',signal+' of 2 signal');
    buttons.forEach((b,i)=>b.setAttribute('aria-disabled',String(phase!=='choose'||(i===2&&signal<2))));
    const intent=intents[round%3];$('.duel-intent strong').textContent=phase==='hero'?attacks[action]:intent[0];
    $('.duel-intent span').textContent=phase==='hero'?(action===2?'Kingfisher inbound.':action===1?'Holding guard.':'Closing in.') :intent[1];
    $('.duel-result').hidden=!result;$('.duel-dock').hidden=!!result;
    root.dataset.phase=phase;root.dataset.round=round+1;
    if(result){$('.duel-result h2').textContent=result;$('[data-retry]').hidden=result==='Victory';}
  }
  function restart(){hp=40;foe=72;signal=0;round=0;phase='intro';action=-1;elapsed=0;hitTime=0;result='';resolved=false;hud()}
  function tone(from,to,dur,delay=0,gain=.055,wave='sine'){
    if(!audio||audio.state!=='running')return;
    const t=audio.currentTime+delay,osc=audio.createOscillator(),amp=audio.createGain();
    osc.type=wave;osc.frequency.setValueAtTime(from,t);osc.frequency.exponentialRampToValueAtTime(to,t+dur);amp.gain.setValueAtTime(.0001,t);amp.gain.exponentialRampToValueAtTime(gain,t+.014);amp.gain.exponentialRampToValueAtTime(.0001,t+dur);
    osc.connect(amp);amp.connect(audio.destination);osc.start(t);osc.stop(t+dur+.012);osc.onended=()=>{osc.disconnect();amp.disconnect()};
  }
  function pick(i){
    if(!active||phase!=='choose'||(i===2&&signal<2))return;
    try{if(!audio){const AC=window.AudioContext||window.webkitAudioContext;if(AC)audio=new AC()}if(audio?.state==='suspended')audio.resume().catch(()=>{})}catch{}
    if(i===2){signal-=2;tone(795,1070,.16);tone(965,1260,.17,.16);tone(1530,2040,.15,.44,.045);tone(1980,1620,.13,.57,.031)}
    action=i;phase='hero';elapsed=0;resolved=false;hud();
  }
  function hit(target,value){
    targetHit=target;hitLabel='−'+value;hitTime=.58;
    if(target==='robot')foe=Math.max(0,foe-value);else hp=Math.max(0,hp-value);
    tone(target==='robot'?260:150,58,.15,0,.075,'triangle');hud();
  }
  function step(dt){
    if(phase==='choose'||phase==='over')return;
    elapsed+=dt;const speed=reduced.matches?.48:1;
    if(phase==='intro'){if(elapsed>.56*speed){phase='choose';elapsed=0;hud();focusButton()}return}
    const hero=phase==='hero',duration=(hero?(action===2?1.55:action===1?.60:1.0):(round%3===1?1.18:.93))*speed;
    if(!resolved&&elapsed>=duration*(hero&&action===2?.62:.48)){
      resolved=true;
      if(hero){if(action===0){signal=Math.min(2,signal+1);hit('robot',12)}else if(action===2)hit('robot',round%3===2?32:18)}
      else if(round%3!==2){const raw=round%3===1?24:8;if(action===1)signal=Math.min(2,signal+1);hit('hero',action===1?raw/4:raw)}
    }
    if(elapsed<duration)return;
    if(hp===0||foe===0){phase='over';result=foe===0?'Victory':'Defeat';elapsed=0;hud();focusButton();return}
    if(hero)phase='robot';else{round++;phase='choose';}elapsed=0;resolved=false;hud();
  }
  function fraction(){
    const speed=reduced.matches?.48:1;
    return clamp(elapsed/((phase==='hero'?(action===2?1.55:action===1?.60:1):(round%3===1?1.18:.93))*speed));
  }
  const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
  const bump=(t,a,b,c,d)=>smooth(a,b,t)*(1-smooth(c,d,t));
  function draw(){
    const heroAct=phase==='hero',robotAct=phase==='robot',p=fraction(),intent=round%3,bird=heroAct&&action===2;
    const attack=heroAct&&action===0?bump(p,.06,.44,.54,.91):0;
    const rush=robotAct&&intent!==2?bump(p,.12,.46,.56,.92):0;
    const brace=action===1&&(heroAct||robotAct)?(heroAct?smooth(.04,.42,p):1-smooth(.72,1,p)):0;
    const impact=attack+ rush+(bird?bump(p,.25,.54,.72,.97):0);
    const hx=-1.03+1.74*attack, hz=.43-.49*attack;
    const rx=1.14-(intent===1?1.73:1.65)*rush,rz=-.28+.53*rush;
    const c=cameraRig(canvas.width,canvas.height,view,tilt,reduced.matches?0:impact,reduced.matches,time),feet=[hx,hz,rx,rz];
    render.begin(c,time,feet);render.mesh(field.horizon);render.mesh(field.clouds,[Math.sin(time*.027)*1.25,0,0]);
    render.mesh(field.land);render.mesh(field.mount,site,orientation(0,0,0,dishScale));render.mesh(ladder);
    const dishRoot=add(site,mul(sub(world.dishPivot,world.relayModels.dishBase),dishScale));
    render.mesh(field.dish,dishRoot,orientation(-.12+.12*Math.sin(time*.12),0,0,dishScale));
    const primed=intent===1&&phase!=='over'?1:0,vent=intent===2&&phase!=='over'?1:0;
    const face=-.98+(vent?-.83:0),intro=phase==='intro'?1-smooth(0,.52,elapsed):0;
    const lean=primed*.12+(.27*rush),baseScale=1.04;
    const robotMat=orientation(face,lean,0,baseScale),robotPos=[rx,(result==='Victory'?-.21:0)+.025*Math.sin(time*2.1),rz];
    for(let i=1;i<robot.length;i++){
      if(i===9&&!vent)continue;
      const upper=i!==2&&i!==3,raise=upper?.19*(1-intro):0;
      let pivot=[0,0,0],rot=I,shift=[0,raise,0];
      if(i===4||i===5){const a=i===4?-1:1;pivot=[a*.22,.516,.01];rot=orientation(0,-.22-(intent===0&&a===1?.50:0)-rush*(a===1?1.0:.25),a*(primed?.35:.08));}
      if(i===6){pivot=[0,.64,0];rot=orientation(.13*Math.sin(time*1.2)+(result==='Victory'?-.65:0),result==='Victory'?.3:0);}
      if(i===7||i===8){const s=i===7?-1:1;shift[0]+=vent*s*.145;shift[2]-=vent*.055;pivot=[s*.19,.51,-.15];rot=orientation(s*vent*.70);}
      const disp=add(add(shift,pivot),transformed(rot,pivot),-1);
      render.mesh(robot[i],add(robotPos,transformed(robotMat,disp)),compose(robotMat,rot));
    }
    const hpose={x:hx,y:-.065*brace,z:hz,yaw:1.91,turn:0,phase:attack*3.2,stride:attack*.48,run:0,kick:attack,brace,call:bird?bump(p,.02,.18,.38,.58):0};
    actor.pose(hpose,time,1.06,[1.03,1,.95]);render.actor(actor);
    if(bird){
      const q=smooth(.29,.62,p),exit=smooth(.62,.96,p);
      const bp=[mix(-2.42,rx,q)+exit*2.5,mix(2.40,1.02,q)+exit*1.8,mix(1.25,rz,q)-exit*2.10];
      const bm=orientation(Math.PI,-.10, .26-.61*exit,.55);render.mesh(field.bird,bp,bm);
      wings.forEach((wing,i)=>render.mesh(wing,bp,compose(bm,orientation(0,(i?1:-1)*.48*Math.sin(p*22),0))));
    }
    render.mesh(field.plants);
    if(hitTime>.15){const f=1-hitTime/.58,location=targetHit==='robot'?[rx,.88,rz]:[hx,.88,hz];
      for(let j=0;j<8;j++){const a=j*2.399;render.mesh(dust,add(location,[Math.cos(a)*f*.63,.16+f*.58-f*f*.37,Math.sin(a)*f*.40]),orientation(0,0,a,1.1-f*.77));}}
    render.end();const label=$('.duel-float');label.hidden=hitTime<=0||!!result;
    if(!label.hidden){const q=sub(targetHit==='robot'?[rx,1.55,rz]:[hx,1.62,hz],c.eye),depth=dot(q,c.forward);
      label.textContent=hitLabel;label.style.left=50*(1+dot(q,c.right)*c.lens[0]/depth)+'%';label.style.top=50*(1-dot(q,c.up)*c.lens[1]/depth)-(.58-hitTime)*9+'%';}
  }
  let repaint=true;
  function resize(){repaint=true;const s=Math.min(devicePixelRatio||1.0,(gpu?1550:520)/Math.max(innerWidth,innerHeight));
    canvas.width=Math.max(1,Math.round(innerWidth*s));canvas.height=Math.max(1,Math.round(innerHeight*s));}
  function frame(now){if(!active)return;raf=requestAnimationFrame(frame);
    if(document.hidden){stamp=0;return}if(stamp&&now-stamp<(gpu?1000/40:1000/12)-.5)return;
    const dt=stamp?Math.min(.12,(now-stamp)/1000):0;stamp=now;if(!reduced.matches)time+=dt;
    view+= (viewGoal-view)*(1-Math.exp(-dt*12));tilt+=(tiltGoal-tilt)*(1-Math.exp(-dt*12));
    const priorPhase=phase,hadHit=hitTime>0;hitTime=Math.max(0,hitTime-dt);step(dt);
    if(!reduced.matches||repaint||hadHit||priorPhase!==phase||(phase!=='choose'&&phase!=='over')||Math.abs(view-viewGoal)+Math.abs(tilt-tiltGoal)>.0003){draw();repaint=false;}
  }
  buttons.forEach((b,i)=>b.addEventListener('click',()=>pick(i)));
  function exit(){leave(result==='Victory')}
  $('.duel-exit').onclick=exit;$('[data-leave]').onclick=exit;$('[data-retry]').onclick=()=>{restart();focusButton()};
  function key(e){
    if(e.altKey||e.ctrlKey||e.metaKey)return;
    if(e.key==='Escape'){e.preventDefault();exit();return}
    if(e.repeat)return;
    if(/^[123]$/.test(e.key)){e.preventDefault();pick(Number(e.key)-1)}
    if(phase==='choose'&&(e.key==='ArrowDown'||e.key==='ArrowUp'||e.key==='ArrowRight'||e.key==='ArrowLeft')){
      e.preventDefault();const dir=e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1;buttons[(selectedCommand+dir+3)%3].focus();
    }
    if(e.key==='Tab'){
      const list=result?[...root.querySelectorAll('.duel-result button:not([hidden]),.duel-exit')]:[...buttons,$('.duel-exit')];
      const at=list.indexOf(document.activeElement);e.preventDefault();list[(at+(e.shiftKey?-1:1)+list.length)%list.length].focus();
    }
  }
  canvas.onpointerdown=e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);drag=[e.clientX,e.clientY,viewGoal,tiltGoal];};
  canvas.onpointermove=e=>{if(drag){viewGoal=clamp(drag[2]-(e.clientX-drag[0])/Math.max(1,innerWidth)*2.7,-1,1);tiltGoal=clamp(drag[3]+(e.clientY-drag[1])/innerHeight,-.35,.56);}};
  canvas.onpointerup=canvas.onpointercancel=()=>{drag=null};root.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{if(active){e.preventDefault();leave(false)}});
  document.body.append(root);window.addEventListener('keydown',key);window.addEventListener('resize',resize);resize();restart();frame(performance.now());
  return {focus:focusButton,destroy(){active=false;cancelAnimationFrame(raf);window.removeEventListener('keydown',key);window.removeEventListener('resize',resize);root.remove();render.dispose();if(audio)audio.close().catch(()=>{})}};
}
window.createYardBattle=createYardBattle;

})();
