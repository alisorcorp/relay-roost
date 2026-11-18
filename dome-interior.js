// The folded receiving station. This file is requested only when the cabin opens.
function createRelayInterior(makePaintedGeometry) {
  const geo=makePaintedGeometry(),pigments=[],solids=[];
  const TAU=2*Math.PI,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,t)=>a+(b-a)*t,add=(a,b,t=1)=>a.map((v,i)=>v+t*b[i]);
  const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((v,n,i)=>v+n*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const unit=a=>{const d=Math.hypot(...a)||1;return a.map(n=>n/d)};
  const X=[1,0,0],Y=[0,1,0],Z=[0,0,1];
  const C={ink:0x233138,iron:0x4e6063,slate:0x56686c,teal:0x397374,deep:0x244e54,patina:0x75a49a,
    ivory:0xe3d7b7,bone:0xc5bc9e,brass:0xd0a259,gold:0xedc987,copper:0xbb7650,rust:0x944f3f,
    oak:0xac7950,walnut:0x634841,linen:0xd6bea4,sea:0x51d3c1,cyan:0xa3f6e9,honey:0xffc97b,
    brick:0x975f4a,blue:0x375f73,navy:0x283e51,wine:0x944d55,plum:0x704f62,olive:0x79805b};
  // The straight walls meet a half drum. The floor, shell and collision edge
  // all use these same points, including the seam at the spring of the curve.
  const drum={x:.15,z:-5.95,r:2.20,segments:20};
  const polar=(angle,r,y)=>[drum.x+r*Math.cos(angle),y,drum.z-r*Math.sin(angle)];
  const rim=Array.from({length:drum.segments+1},(_,i)=>polar(Math.PI*i/drum.segments,drum.r,0));
  const rooms=[[-6.85,-2.05,-3.65,2.08],[-2.05,2.35,drum.z,3.53],[2.35,6.68,-3.22,2.55],[-.78,.78,3.53,4.20]];
  // Center, half aperture, shear per unit of travel, and the length of the light in air.
  const windows=[
    {x:-5.74,y:1.96,z:-3.49,w:.57,h:.94,sx:.39,sy:-.55,length:5.2,color:[.90,.90,.63]},
    {x:-4.31,y:1.96,z:-3.49,w:.57,h:.94,sx:.39,sy:-.55,length:5.2,color:[.80,.94,.78]},
    {x:4.97,y:2.18,z:-3.055,w:.89,h:.79,sx:-.28,sy:-.52,length:4.65,color:[1,.69,.39]}
  ];
  const lamps=[[-4.86,1.02,-.68,1.85,.07,.28,.25],[-1.22,1.50,-3.72,2.35,.58,.26,.08],
    [-.92,1.34,-5.22,1.28,.10,.34,.32],[.15,1.58,-7.46,2.75,.13,.54,.48],[1.84,1.16,-4.14,1.58,.45,.23,.07],[1.58,1.27,2.12,1.19,.75,.41,.14],[5.69,1.66,1.15,1.58,.64,.30,.09],[-2.30,2.10,.30,1.25,.42,.23,.04]];
  function windowLight(win,x,y,z){
    const t=z-win.z;if(t<0||t>win.length)return 0;
    const u=(x-win.x-win.sx*t)/(win.w+.048*t),v=(y-win.y-win.sy*t)/(win.h+.033*t);
    const edge=Math.min(1-Math.abs(u),1-Math.abs(v),1-Math.hypot(u,Math.max(0,(v-.40)/.60)));
    if(edge<=0)return 0;
    const bars=Math.min(Math.abs(v+.40),Math.abs(v-.09),Math.abs(v-.47));
    const mullion=clamp(Math.abs(u)*9+.12,0,1)*clamp(bars*9+.16,0,1);
    return clamp(edge*6,0,1)*mullion*(1-.58*t/win.length);
  }
  function roomLight(x,y,z){
    const light=[.58,.63,.67];
    for(const win of windows){const g=windowLight(win,x,y,z);for(let k=0;k<3;k++)light[k]+=.72*g*win.color[k];}
    for(const [lx,ly,lz,r,red,green,blue] of lamps){
      const d=((x-lx)**2+(y-ly)**2+(z-lz)**2)/(r*r);
      if(d<3){const gain=Math.exp(-1.7*d);light[0]+=red*gain;light[1]+=green*gain;light[2]+=blue*gain;}
    }
    return light;
  }
  let seed=839014;
  const random=()=>((seed=(Math.imul(1664525,seed)+1013904223)>>>0)/4294967296);
  const rgb=c=>[c>>16&255,c>>8&255,c&255];
  const packed=(a,b,c)=>(clamp(a,0,255)|0)|((clamp(b,0,255)|0)<<8)|((clamp(c,0,255)|0)<<16);
  const shadowPads=[[-4.96,-.64,1.24,1.12],[-3.10,-2.82,.59,.34],[-1.27,-3.35,.54,1.22],
    [1.60,2.23,.58,.45],[-1.13,-5.23,.55,.53],[.15,-7.54,1.12,.52],[1.72,-4.15,.50,.78],[5.68,-1.45,.68,1.13],[3.20,1.75,.58,.33],[5.66,.98,.46,.44]];
  // Stable, continuous pigment variation across adjoining patches. The wood,
  // stone and enamel each sample it at the scale of their surface marks.
  function lattice(x,y){
    let h=Math.imul(x,0x165667b1)^Math.imul(y,0x27d4eb2d);
    h=Math.imul(h^(h>>>15),0x85ebca6b);
    return ((h^(h>>>13))>>>0)/4294967296;
  }
  function wash(x,y){
    const i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j;
    const a=u*u*(3-2*u),b=v*v*(3-2*v);
    return mix(mix(lattice(i,j),lattice(i+1,j),a),mix(lattice(i,j+1),lattice(i+1,j+1),a),b);
  }
  // The service bench and all its instruments are installed against the
  // port wall as one assembly. Apply its rigid transform to solids as well.
  let installingBench=false,motionGroup=0;
  const benchPoint=([x,y,z])=>[z+.59,y,-3.70-x];
  function face(a,b,c,d,color,material='metal',detail=.105){
    if(installingBench)[a,b,c,d]=[a,b,c,d].map(benchPoint);
    const across=sub(b,a),up=sub(d,a),other=sub(c,b),normal=unit(cross(across,up));
    const lu=Math.max(Math.hypot(...across),Math.hypot(...sub(c,d))),lv=Math.max(Math.hypot(...up),Math.hypot(...other));
    const nu=Math.max(1,Math.ceil(lu/detail)),nv=Math.max(1,Math.ceil(lv/detail)),start=pigments.length;
    const albedo=rgb(color),level=.69+.23*Math.max(0,normal[1])+.22*Math.max(0,dot(normal,[-.48,.69,.54]));
    for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){
      const u=(i+.5)/nu,v=(j+.5)/nv,p=a.map((n,k)=>n+across[k]*u+mix(up[k],other[k],u)*v);
      const [x,y,z]=p;
      const emitting=material==='lit'||material==='glass'||material==='phosphor';
      const light=emitting?[1,1,1]:roomLight(x,y,z);
      const grain=.018*Math.sin(4.7*x+1.3*y+2.4*z)+.022*Math.sin(2.2*x-3*y+5*z)+.04*(random()-.5);
      let value=emitting?1:level+grain;
      if(material==='phosphor'){
        const radius=Math.hypot(x-drum.x,y-1.67);
        value=1.05-.53*Math.min(1,radius/.87)**1.7+.038*Math.sin(y*65);
      }
      if(material==='glass')value=.90+.032*Math.sin(x*18+y*2)+.045*Math.sin(x*5-y*8)+.027*(random()-.5);
      const flat=Math.abs(normal[1])>.68,along=Math.abs(normal[0])>.70?z:x,acrossFace=flat?z:y;
      let patina=0;
      if(material==='wood'||material==='boards'){
        const warp=wash(along*1.35,acrossFace*5.3),grain=acrossFace*32+warp*3.1+.5*Math.sin(along*3.4);
        const ring=(.5+.5*Math.cos(grain))**6;
        value+=.19*(warp-.48)-.17*ring+.046*Math.sin(grain*2.65);
        if(material==='boards'){
          const edge=Math.min(u,1-u)*lu,side=Math.min(v,1-v)*lv;
          value+=.068*Math.exp(-side*48)-.096*Math.exp(-edge*26);
          if((edge-.062)**2+(side-.061)**2<.016**2)value*=.47;
        }
      }
      if(material==='stone'||material==='floor'){
        const cloud=wash(along*2.4+4,acrossFace*2.4),vein=wash(along*4.4+1.2*acrossFace,acrossFace*6.7+cloud*1.1);
        value+=.21*(cloud-.48)+.075*(wash(along*16,acrossFace*16)-.48);
        if(material==='floor'){
          const seam=Math.min(u*lu,(1-u)*lu,v*lv,(1-v)*lv);
          value+=.065*Math.exp(-seam*35);
          if(x<-2.05)value+=.16*clamp(1-Math.abs(vein-.51)/.073,0,1)*(.24+.76*cloud);
          else value+=.06*Math.exp(-((x-.25)**2)/.63)-.11*clamp((vein-.61)*3.1,0,1);
        }
      }
      if(material==='enamel'||material==='metal'){
        const age=wash(along*3.9+17,acrossFace*4.5+1),edge=Math.min(u*lu,(1-u)*lu,v*lv,(1-v)*lv);
        value+=.082*(age-.45);
        if(material==='enamel'){
          const fleck=wash(along*18,acrossFace*22),wear=age+.28*fleck+.22*Math.exp(-edge*19);
          patina=clamp((wear-.91)*6,0,.76);
          value+=.15*(wash(along*6.0,acrossFace*1.35)-.5);
        }
      }
      if(material==='cloth'||material==='rug'){
        const weave=.5+.5*Math.cos(2*Math.PI*(along*12+acrossFace*10));
        value+=.10*(weave-.45)+.12*(wash(along*4.3,acrossFace*5.2)-.48);
        if(material==='rug'&&flat){
          const U=(x-3.40)/2.24,V=(z+.605)/1.85,e=Math.min(U,1-U,V,1-V);
          const a=Math.abs((U*8%1)-.5),b=Math.abs((V*7%1)-.5);
          const brocade=Math.max(0,1-Math.abs(a+b-.44)/.085);
          value+=brocade*(e<.135?.53:.18)-.13*(e>.087&&e<.105);
        }
      }
      if(material==='floor'||material==='boards'){
        for(const [px,pz,rx,rz] of shadowPads){
          const dx=(x-px)/rx,dz=(z-pz)/rz;if(Math.abs(dx)<2&&Math.abs(dz)<2)value-=.40*Math.exp(-1.5*(dx*dx+dz*dz));
        }
      }
      const channels=albedo.map((n,k)=>value*light[k]*mix(n,[120,77,55][k],patina));
      pigments.push(packed(...channels));
    }
    geo.panel(a,b,c,d,start,nu,nv,motionGroup);
  }
  // Center x/z, bottom y. Every exposed face has its own baked pigment patch.
  function box(x,y,z,w,h,d,col,mat='metal',detail){
    const l=x-w/2,r=x+w/2,f=z+d/2,b=z-d/2,t=y+h;
    const F=(p,q,a,b)=>face(p,q,a,b,col,mat,detail);
    F([l,y,f],[r,y,f],[r,t,f],[l,t,f]);F([r,y,b],[l,y,b],[l,t,b],[r,t,b]);
    F([r,y,f],[r,y,b],[r,t,b],[r,t,f]);F([l,y,b],[l,y,f],[l,t,f],[l,t,b]);
    F([l,t,f],[r,t,f],[r,t,b],[l,t,b]);F([l,y,b],[r,y,b],[r,y,f],[l,y,f]);
  }
  function rod(a,b,r,color,r2=r,n=9,mat='metal'){
    const delta=sub(b,a);if(Math.hypot(...delta)<.00001)return;
    const axis=unit(delta),u=unit(cross(axis,Math.abs(axis[1])<.85?Y:Z)),v=cross(axis,u);
    const p=(c,r,i)=>add(add(c,u,r*Math.cos(TAU*i/n)),v,r*Math.sin(TAU*i/n));
    for(let i=0;i<n;i++){
      const A=p(a,r,i),B=p(a,r,i+1),D=p(b,r2,i),E=p(b,r2,i+1);
      face(A,B,E,D,color,mat,.22);
      if(r2>.055)face(b,D,E,b,color,mat,.25);
      if(r>.055)face(a,B,A,a,color,mat,.25);
    }
  }
  const post=(x,y,z,r,h,c,r2=r,n=14,m)=>rod([x,y,z],[x,y+h,z],r,c,r2,n,m);
  function path(points,r,c,m,n=7){for(let i=1;i<points.length;i++)rod(points[i-1],points[i],r,c,r,n,m)}
  function hoop(o,u,v,r,th,col,n=36,mat){
    const at=a=>add(add(o,u,r*Math.cos(a)),v,r*Math.sin(a));
    let a=at(0);for(let i=1;i<=n;i++){const b=at(TAU*i/n);rod(a,b,th,col,th,6,mat);a=b;}
  }
  function globe(o,rx,ry,rz,col,mat='metal',n=16,m=8){
    const at=(i,j)=>{const z=TAU*i/n,t=Math.PI*j/m;return [o[0]+rx*Math.cos(z)*Math.sin(t),o[1]+ry*Math.cos(t),o[2]+rz*Math.sin(z)*Math.sin(t)]};
    for(let j=0;j<m;j++)for(let i=0;i<n;i++)face(at(i,j),at(i+1,j),at(i+1,j+1),at(i,j+1),typeof col==='function'?col(i,j):col,mat,.16);
  }
  function block(x,z,w,d){
    if(installingBench){[x,,z]=benchPoint([x,0,z]);[w,d]=[d,w];}
    solids.push({left:x-w/2,right:x+w/2,back:z-d/2,front:z+d/2});
  }
  const palette=(list)=>list[Math.floor(random()*list.length)];
  const inRect=(x,z,r)=>x>=r[0]&&x<=r[1]&&z>=r[2]&&z<=r[3];
  const onDeck=(x,z)=>rooms.some(r=>inRect(x,z,r));
  const inside=(x,z)=>onDeck(x,z)||(z<drum.z&&Math.hypot(x-drum.x,z-drum.z)<=drum.r);
  const xs=[...new Set(rooms.flatMap(r=>r.slice(0,2)))].sort((a,b)=>a-b),zs=[...new Set(rooms.flatMap(r=>r.slice(2)))].sort((a,b)=>a-b);
  const perimeter=[];
  for(let i=1;i<xs.length;i++)for(let j=1;j<zs.length;j++){
    const l=xs[i-1],r=xs[i],b=zs[j-1],f=zs[j],x=(l+r)/2,z=(b+f)/2;
    if(!onDeck(x,z))continue;
    if(!onDeck(l-.01,z))perimeter.push([l,b,l,f]);if(!onDeck(r+.01,z))perimeter.push([r,b,r,f]);
    if(b!==drum.z&&!onDeck(x,b-.01))perimeter.push([l,b,r,b]);if(!onDeck(x,f+.01))perimeter.push([l,f,r,f]);
  }
  const straightEdges=perimeter.length;
  for(let i=1;i<rim.length;i++)perimeter.push([rim[i-1][0],rim[i-1][2],rim[i][0],rim[i][2]]);
  function edge(x,z){
    let dist=Infinity;
    for(const [a,b,c,f] of perimeter){
      const dx=c-a,dz=f-b,t=clamp(((x-a)*dx+(z-b)*dz)/(dx*dx+dz*dz),0,1);
      dist=Math.min(dist,(x-a-t*dx)**2+(z-b-t*dz)**2);
    }
    return (inside(x,z)?-1:1)*Math.sqrt(dist);
  }
  const height=(x,z)=>x<2.35?0:z<-.81||z>1.04?.36:x<2.57?.12:x<2.79?.24:.36;
  for(let i=0;i<rooms.length;i++){
    const pads=i===2?[[2.79,6.68,-3.22,2.55],[2.35,2.79,-3.22,-.81],[2.35,2.79,1.04,2.55]]:[rooms[i]];
    for(const [l,r,b,f] of pads){
      const x=(l+r)/2,z=(b+f)/2,w=r-l,d=f-b,top=i===2?.36:0;
      box(x,-.52,z,w,top+.50,d,C.ink,'metal',.2);
      box(x,top-.12,z,w,.09,d,i===2?C.walnut:C.iron);
      const nx=Math.ceil(w/(i===2?1.7:.84)),nz=Math.ceil(d/(i===2?.32:.85));
      for(let j=0;j<nz;j++)for(let k=0;k<nx+(i===2&&j%2?1:0);k++){
        const offset=i===2&&j%2?-.47:0;
        const a=Math.max(l,l+(k+offset)*w/nx)+.009,h=Math.min(r,l+(k+1+offset)*w/nx)-.009,B=b+j*d/nz+.009,F=b+(j+1)*d/nz-.009;
        const col=i===0?palette([0x708b86,0x748d85,0x647d7c,0x849185]):i===2?palette([0xbc9068,0xab805d,0xb78b65,0xc39c71]):palette([0x687270,0x75817b,0x707976,0x626e6c]);
        face([a,top,F],[h,top,F],[h,top,B],[a,top,B],col,i===2?'boards':'floor',i===2?.028:.042);
        if(i===1&&(j+k)%2===0)for(const xx of [a+.055,h-.055])box(xx,top+.002,F-.048,.025,.006,.025,C.brass);
      }
    }
  }
  // Exposed plinths: dark joists, inspection hatches and copper conduits in the cut edges.
  for(const [l,b,r,f] of perimeter.slice(0,straightEdges)){
    const dx=r-l,dz=f-b,len=Math.hypot(dx,dz),ax=dx/len,az=dz/len;
    const mid=[(l+r)/2,-.34,(b+f)/2];
    rod([l,-.36,b],[r,-.36,f],.035,C.copper,.035,7);
    for(let k=.18;k<len;k+=.64)box(l+k*ax,-.46,b+k*az,dx?.06:.12,.30,dz?.06:.12,C.iron);
    if(len>2){const [x,,z]=mid;box(x,-.31,z,dx?.45:.18,.16,dz?.45:.18,C.ink);}
  }
  // Back walls are paneled and capped; every front cut remains open to the camera.
  function wall(x,z,w,h,base,col,kind){
    box(x,base,z,w,h,.23,col,kind===2?'stone':'enamel',.043);
    box(x,base,z+.126,w,.19,.11,C.ink);box(x,base+.62,z+.136,w,.065,.09,C.brass);
    box(x,base+h-.095,z,w+.11,.105,.32,C.iron);box(x,base+h+.005,z,w+.10,.035,.30,C.brass);
    const n=Math.ceil(w/.82);
    for(let j=0;j<n;j++){const cx=x-w/2+(j+.5)*w/n;
      box(cx,base+.21,z+.126,w/n-.055,.375,.033,kind===2?C.walnut:C.deep);
      box(cx,base+.24,z+.148,w/n-.12,.035,.024,kind===2?C.oak:C.patina);
      for(const sx of [-1,1])box(cx+sx*(w/n*.5-.075),base+.51,z+.15,.025,.034,.025,C.brass);
    }
    for(const side of [-1,1]){
      const a=x+side*(w/2-.08);box(a,base,z+.10,.15,h,.19,kind===2?C.walnut:C.iron);
      for(const y of [.17,.71,h-.22])box(a,base+y,z+.12,.215,.075,.23,C.brass);
    }
  }
  wall(-4.45,-3.65,4.80,3.20,0,0x527c79,0);wall(4.515,-3.22,4.33,2.58,.36,0xba967a,2);
  function sideWall(x,b,f,h,col,base=0){
    box(x,base,(b+f)/2,.17,h,f-b,col,'stone');box(x,base+h-.045,(b+f)/2,.24,.067,f-b+.04,C.brass);
    box(x,base+.09,(b+f)/2,.24,.11,f-b+.04,C.iron);
  }
  sideWall(-6.84,-3.64,-1.40,2.76,C.deep);sideWall(-6.84,-1.4,1.99,.24,C.iron);
  sideWall(6.67,-3.20,-1.22,2.42,C.walnut,.36);sideWall(6.67,-1.22,2.53,.20,C.walnut,.36);
  for(const [x,b,f] of [[-2.05,-3.62,2.07],[2.35,-3.19,2.53]]){
    const start=x<0?-1.66:b;
    sideWall(x,start,-.81,2.22,x<0?C.teal:C.iron);block(x,(start-.81)/2,.20,-.81-start);
    sideWall(x,1.04,f,.37,C.iron);block(x,(1.04+f)/2,.20,f-1.04);
    for(const z of [-.81,1.04]){
      box(x,0,z,.29,2.23,.19,C.iron);box(x,.20,z,.31,.12,.23,C.copper);
      box(x,1.88,z,.32,.09,.23,C.brass);
    }
    path([[x,2.12,-.82],[x,2.42,-.48],[x,2.42,.69],[x,2.12,1.04]],.087,C.brass);
    path([[x,2.14,-.66],[x,2.32,-.44],[x,2.32,.64],[x,2.12,.92]],.035,C.patina);
  }
  for(let k=0;k<2;k++){
    const x=2.46+.22*k,h=.12*(k+1);
    box(x,-.52,.115,.22,h+.52,1.85,k%2?C.slate:C.iron);
    box(x-.088,h+.001,.115,.023,.009,1.79,C.brass);
  }
  // A clear aisle from the pressure-lock sill to either room.
  for(const x of [-.57,.57]){box(x,.010,2.61,.028,.012,2.57,C.brass);box(x,.017,3.82,.052,.018,.43,C.sea,'lit');}
  for(const side of [-1,1]){
    const x=side*.76;box(x,0,3.86,.14,1.13,.62,C.iron);
    box(x,.81,3.86,.18,.13,.63,C.copper);box(x,.96,3.85,.21,.16,.66,C.bone);
    box(x,1.13,3.80,.088,.049,.27,C.cyan,'lit');
  }
  for(let k=0;k<6;k++)box(0,.010,3.53+k*.096,1.26,.013,.030,k%2?C.brass:C.ink);
  // Shaped luminous apertures. Each pane, transom and lead line has real depth.
  function glazing(win){
    const {x,y,z,w,h}=win,glass=win===windows[2]?0xffddb1:0xc8e7dd;
    const profile=t=>t<.69?1:Math.sqrt(Math.max(0,1-((t-.69)/.31)**2));
    for(let j=0;j<24;j++){
      const v=j/24,V=(j+1)/24,l=w*profile(v),L=w*profile(V),a=y-h+2*h*v,b=y-h+2*h*V;
      face([x-l,a,z+.015],[x+l,a,z+.015],[x+L,b,z+.015],[x-L,b,z+.015],glass,'glass',.065);
    }
    for(const side of [-1,1]){
      const outline=[];for(let j=0;j<=22;j++){const t=j/22;outline.push([x+side*(w+.042)*profile(t),y-h+2*h*t,z+.06]);}
      path(outline,.057,C.ink);path(outline.map(p=>add(p,Z,.027)),.021,C.brass);
    }
    rod([x,y-h,z+.075],[x,y+h-.045,z+.075],.027,C.brass);
    for(const t of [-.40,.09,.47]){const ww=w*profile((t+1)/2);box(x,y+t*h,z+.071,ww*2,.043,.055,C.iron);}
    box(x,y-h-.065,z+.09,2*w+.27,.115,.37,C.bone);
    for(const side of [-1,1])box(x+side*(w-.08),y-h-.21,z+.09,.11,.17,.19,C.brass);
  }
  windows.forEach(glazing);
  // Celestial survey room. The inlaid compass and the instrument use different axes.
  const ox=-4.96,oz=-.64;
  for(const r of [1.50,1.43,1.08])hoop([ox,.025,oz],X,Z,r,r>1.49?.026:.015,C.brass,60);
  for(let i=0;i<40;i++){const a=TAU*i/40,r=i%5===0?1.23:1.33;
    rod([ox+r*Math.cos(a),.035,oz+r*Math.sin(a)],[ox+1.43*Math.cos(a),.035,oz+1.43*Math.sin(a)],i%5===0?.022:.011,C.ivory);}
  for(const [y,r,h,c,r2] of [[.01,.96,.11,C.iron,.99],[.12,.87,.095,C.copper,.81],[.215,.67,.17,C.deep,.57],[.385,.54,.10,C.brass,.50],[.49,.33,.43,C.teal,.26],[.90,.36,.085,C.gold,.36]])post(ox,y,oz,r,h,c,r2,26);
  const sphere=[ox,1.65,oz],axis=unit([.34,.84,.41]),perp=unit(cross(axis,X)),across=cross(axis,perp);
  hoop(sphere,X,Y,1.16,.043,C.brass,52);
  motionGroup=2;
  globe(sphere,.53,.53,.53,(i,j)=>(Math.sin(i*.96+j*1.46)+Math.cos(i*1.62-j*.91)>.62?C.patina:j%4===1?0x428f8c:C.teal),'metal',26,14);
  for(let j=1;j<6;j++){const t=j*Math.PI/6;hoop(add(sphere,axis,.54*Math.cos(t)),perp,across,.54*Math.sin(t),.009,C.gold,32);}
  for(const [u,v,r,th,c] of [[X,Z,.84,.033,C.brass],[perp,across,.99,.047,C.gold],[axis,perp,.80,.029,C.copper]]){
    hoop(sphere,u,v,r,th,c,52);
  }
  for(let i=0;i<24;i++){const a=i*TAU/24,p=add(add(sphere,perp,Math.cos(a)*.99),across,Math.sin(a)*.99);
    rod(p,add(p,axis,i%3===0?.090:.045),.010,C.gold);}
  rod(add(sphere,axis,-.85),add(sphere,axis,.90),.036,C.gold);
  globe(add(sphere,axis,.95),.092,.092,.092,C.cyan,'lit');
  for(const a of [-.76,.86,2.63]){const end=[ox+1.10*Math.cos(a),1.54,oz+.83*Math.sin(a)];rod([ox,.93,oz],end,.025,C.copper);globe(end,.104,.104,.104,a>2?C.sea:C.honey,'lit');}
  motionGroup=0;
  block(ox,oz,1.82,1.72);
  function table(x,z,w,d,y=0,top=.92,col=C.oak){
    box(x,y+top-.075,z,w,.10,d,col,'wood',.034);
    for(const a of [-1,1])for(const b of [-1,1]){const xx=x+a*(w/2-.10),zz=z+b*(d/2-.09);
      box(xx,y,zz,.09,top-.062,.09,C.iron);box(xx,y+.11,zz,.11,.048,.11,C.brass);}
    box(x,y+top-.18,z,w-.12,.105,d-.12,C.walnut);
    block(x,z,w-.07,d-.07);return y+top+.025;
  }
  function chart(x,y,z,w,h){
    box(x,y,z,w,.07+h,.065,C.brass);box(x,y+.045,z+.037,w-.10,h-.018,.028,C.navy);
    const cx=x-.08*w,cy=y+.50*h;
    for(const r of [.19,.32,.42])hoop([cx,cy,z+.062],X,Y,h*r,.009,r===.32?C.brass:C.patina,32);
    const points=[];for(let i=0;i<14;i++){
      const px=x+(random()-.5)*w*.78,py=y+h*(.16+.73*random()),pos=[px,py,z+.068];
      globe(pos,.014,.014,.009,i%3?C.ivory:C.honey,'lit',6,3);if(i<6)points.push(pos);
    }path(points,.006,C.brass);
  }
  chart(-2.92,1.19,-3.50,1.13,1.22);
  const deskY=table(-3.05,-2.79,1.24,.73);
  for(let i=0;i<4;i++){box(-3.35+.07*i,deskY+i*.014,-2.77+i*.014,.46,.012,.35,i%2?C.bone:C.ivory);
    box(-3.34+.07*i,deskY+i*.014+.014,-2.74,.27,.006,.012,C.iron);}
  for(let i=0;i<3;i++)rod([-2.88+i*.088,deskY+.057,-2.98],[-2.81+i*.088,deskY+.057,-2.66],.047,C.linen);
  // Patch bay, oscilloscopes, desk radios and the suspended receiver loom.
  function gauge(x,y,z,r){
    rod([x,y,z],[x,y,z+.045],r,C.brass,r,14);rod([x,y,z+.048],[x,y,z+.054],r*.80,C.ivory,r*.80,14,'lit');
    rod([x,y-r*.35,z+.061],[x+r*.38,y+r*.44,z+.061],.009,C.ink);
  }
  function screen(x,y,z,w,h,c){
    box(x,y,z,w,h,.092,C.ink);box(x,y+.052,z+.052,w-.10,h-.10,.027,C.deep);
    const pts=[];for(let i=0;i<=24;i++){const t=i/24;pts.push([x+(t-.5)*(w-.16),y+h*(.51+.18*Math.sin(t*16)+.065*Math.sin(t*39)),z+.078]);}
    path(pts,.011,c,'lit',5);
    for(let i=0;i<4;i++)box(x-w*.38+i*.055,y+.09,z+.071,.026,.027,.01,c,'lit');
  }
  function buildRadioBench(){
    wall(.15,-2.60,4.40,2.80,0,0x445f66,1);block(.15,-2.60,4.40,.23);
    const bench=table(-.34,-1.88,2.76,.78,0,.92,C.oak);
    for(let k=0;k<2;k++){
      const x=-.97+k*1.16;box(x,bench,-1.96,1.05,.80,.47,C.iron);box(x,bench+.065,-1.71,.96,.61,.052,C.slate);
      screen(x-.12,bench+.19,-1.655,.60,.37,k?C.honey:C.sea);
      // The oscilloscope lids are visible from the catwalk above. Recessed
      // heat vents, inspection screws and an enamel tag break up each casing.
      const lid=bench+.806;
      box(x-.11,lid,-1.97,.59,.012,.27,C.ink);
      for(let vent=0;vent<9;vent++)box(x-.365+vent*.064,lid+.013,-1.97,.024,.013,.247,C.slate);
      box(x+.32,lid,-1.95,.163,.012,.102,k?C.patina:C.brass);
      box(x+.30,lid+.014,-1.93,.070,.003,.012,C.ink);
      for(const sign of [-1,1])for(const zz of [-2.14,-1.78])post(x+sign*.458,lid,zz,.019,.013,C.bone,.019,8);
      for(let j=0;j<3;j++)gauge(x+.29,bench+.20+j*.17,-1.65,.065);
      for(let j=0;j<6;j++)box(x-.36+.12*j,bench+.085,-1.62,.067,.042,.031,j===2?C.honey:C.ink,j===2?'lit':'metal');
    }
    for(const x of [-1.02,.17]){
      box(x,.14,-1.90,.91,.54,.48,C.teal);
      for(let j=0;j<6;j++)box(x,.22+.060*j,-1.645,.67,.014,.018,C.ink);
    }
    box(-.35,2.18,-2.39,2.53,.10,.40,C.iron);box(-.35,2.18,-2.17,2.11,.027,.039,C.honey,'lit');
    for(const x of [-1.48,.77])rod([x,2.26,-2.40],[x,2.68,-2.48],.025,C.copper);
    for(let k=0;k<4;k++){
      const x=-1.65+k*.14;path([[x,2.61,-2.44],[x+.07,2.43,-2.22],[x+.26,2.24,-2.15],[x+.64,2.22,-2.20],[x+.94,2.42,-2.48]],.023,k%2?C.copper:C.ink);
    }
    box(1.56,.05,-1.76,.89,1.87,.84,C.deep);block(1.56,-1.76,.89,.84);
    for(let j=0;j<5;j++){const y=.20+j*.301;box(1.56,y,-1.30,.76,.25,.070,j%2?C.iron:C.slate);
      for(let k=0;k<4;k++)box(1.31+k*.09,y+.11,-1.254,.044,.052,.018,k===(j%4)?C.sea:C.ink,k===(j%4)?'lit':'metal');
      gauge(1.79,y+.13,-1.245,.066);}
    for(const x of [1.28,1.55,1.81]){
      post(x,1.92,-1.76,.12,.09,C.copper);post(x,2.01,-1.76,.078,.34,C.patina,.069,12);
      post(x,2.35,-1.76,.086,.039,C.brass);
      for(let j=0;j<3;j++)hoop([x,2.06+j*.08,-1.76],X,Z,.082,.014,C.gold,14);
    }
    // Toolboard with labeled drawers, spanners, cable coils, reels and a stool.
    box(-1.53,1.30,-2.42,.65,.78,.07,C.walnut,'wood');
    for(let j=0;j<4;j++){const x=-1.75+j*.14;rod([x,1.5,-2.363],[x+.025,1.88-j*.04,-2.36],.019,C.bone);hoop([x,1.89-j*.04,-2.36],X,Y,.044,.013,C.brass,12);}
    post(-.49,0,-1.10,.32,.08,C.iron);post(-.49,.08,-1.10,.069,.42,C.brass);
    post(-.49,.50,-1.10,.27,.10,C.wine,.29);block(-.49,-1.10,.40,.40);
    for(let i=0;i<3;i++)hoop([.94,.028+i*.021,-.99],X,Z,.21+i*.047,.021,C.ink,24);
    path([[1.16,.06,-.86],[1.27,.044,-.98],[1.30,.04,-1.12],[1.46,.04,-1.18],[1.60,.10,-1.25]],.019,C.ink);
    rod([1.59,.09,-1.26],[1.64,.18,-1.29],.037,C.copper);
    chart(.37,1.90,-2.48,.96,.50);
    path([[-1.87,.21,-2.35],[-1.87,2.36,-2.35],[-1.65,2.60,-2.35],[.82,2.60,-2.35],[1.07,2.41,-2.35],[1.07,1.12,-2.35]],.060,C.copper);
    for(const x of [-1.36,-.74,.53])rod([x,2.60,-2.35],[x+.056,2.60,-2.35],.087,C.brass);
    hoop([-1.87,.83,-2.224],X,Y,.154,.021,C.rust,24);
    for(let k=0;k<4;k++){const a=k*TAU/4;rod([-1.87,.83,-2.224],[-1.87+.15*Math.cos(a),.83+.15*Math.sin(a),-2.224],.011,C.copper);}
    for(const [x,y] of [[.98,1.53],[1.21,1.48]]){
      box(x,y,-2.43,.205,.30,.018,C.linen);box(x,y+.27,-2.409,.060,.050,.021,C.brass);
      for(let j=0;j<3;j++)box(x-.012,y+.075+j*.050,-2.418,.12-j*.014,.008,.018,C.ink);
    }
  }
  installingBench=true;buildRadioBench();installingBench=false;
  // Keeper's quarters. Parquet, brass-bound berth, a striped quilt and a reading lamp.
  box(4.52,.365,.32,2.24,.018,1.85,C.wine,'rug',.023);
  for(const x of [3.46,5.58])box(x,.385,.32,.045,.010,1.76,C.bone);
  for(const z of [-.53,1.17])box(4.52,.385,z,2.16,.010,.037,C.brass);
  for(let i=0;i<7;i++){
    const x=3.72+.26*i;path([[x-.11,.395,.32],[x,.395,.16],[x+.11,.395,.32],[x,.395,.48],[x-.11,.395,.32]],.012,i%2?C.brass:C.linen);
  }
  box(5.79,.49,-1.68,1.20,.33,2.15,C.walnut,'wood');block(5.79,-1.68,1.23,2.18);
  for(const x of [5.25,6.32])for(const z of [-2.65,-.71]){post(x,.36,z,.067,.58,C.brass);globe([x,.98,z],.079,.079,.079,C.gold);}
  box(5.79,.82,-1.70,1.15,.15,2.08,C.linen,'cloth');
  box(5.79,.97,-1.40,1.14,.095,1.31,C.blue,'cloth',.031);
  for(let j=0;j<9;j++)box(5.29+.126*j,1.067,-1.40,.031,.009,1.31,j%3===0?C.bone:C.patina,'cloth');
  globe([5.79,1.038,-2.40],.45,.106,.23,C.ivory,'cloth',16,8);
  box(5.79,.75,-2.75,1.23,.44,.07,C.oak,'wood');
  // Sideboard with asymmetric stacks of books, a kettle and a shaded lamp.
  const tea=table(5.86,1.17,.94,.70,.36,.65);
  globe([5.66,tea+.14,1.17],.15,.135,.14,C.patina);
  rod([5.55,tea+.14,1.16],[5.43,tea+.25,1.16],.055,C.brass,.023);
  hoop([5.69,tea+.24,1.17],X,Y,.115,.017,C.ink,20);
  post(6.10,tea,1.18,.11,.045,C.brass);post(6.10,tea+.04,1.18,.026,.37,C.brass);
  post(6.10,tea+.40,1.18,.24,.28,C.honey,.13,18,'lit');
  for(let i=0;i<2;i++){post(5.68+i*.20,tea,1.38,.055,.075,C.ivory);hoop([5.74+i*.2,tea+.044,1.38],X,Y,.026,.009,C.brass,12);}
  const books=[C.wine,C.olive,C.blue,C.iron,C.copper,C.linen,C.deep];
  for(let row=0;row<3;row++){
    const y=1.12+row*.47;box(3.27,y,-2.99,1.30,.076,.33,C.walnut,'wood');
    for(let j=0;j<8;j++){const x=2.74+j*.127,h=.18+random()*.20;box(x,y+.076,-2.95,.09,h,.21,books[(j+row*3)%7]);
      box(x,y+.095+h*.62,-2.835,.078,.021,.009,C.brass);}
  }
  for(let j=0;j<3;j++){box(3.23,.36+.21*j,1.80,1.15,.20,.51,C.oak,'wood');box(3.23,.42+.21*j,2.065,.23,.032,.045,C.brass);}
  block(3.23,1.8,1.15,.51);
  // Ribbon pipes step around the foundation; the ends show flanged joints.
  for(let i=0;i<3;i++){
    const y=.34+i*.12;path([[-6.70,y,-3.43],[-6.24,y,-3.43],[-6.04,y+.13,-3.43],[-3.60,y+.13,-3.43],[-3.31,y,-3.43],[-2.22,y,-3.43]],.034,i===1?C.patina:C.copper);
    for(const x of [-6.35,-3.72,-2.62])box(x,y-.053,-3.40,.055,.135,.10,C.brass);
  }
  // A portable survey scope points through the port window. The three feet
  // and the counterweight describe the silhouette even from the reverse view.
  const scope=[-6.18,.91,1.04],aim=unit([-.48,.46,-.76]);
  for(let k=0;k<3;k++){
    const a=.4+k*TAU/3,foot=[scope[0]+.39*Math.cos(a),.031,scope[2]+.39*Math.sin(a)];
    rod(foot,scope,.042,C.oak,.054,7,'wood');globe(foot,.06,.036,.06,C.brass);
  }
  for(const [a,b,r,c] of [[-.52,-.32,.067,C.ink],[-.34,.15,.104,C.copper],[.12,.58,.126,C.brass],[.58,.68,.147,C.ink]]){
    rod(add(scope,aim,a),add(scope,aim,b),r,c);
  }
  rod(add(scope,aim,.681),add(scope,aim,.692),.112,C.patina);
  globe(add(scope,[0,-.12,0]),.095,.095,.095,C.brass);
  block(scope[0],scope[2],.42,.44);
  // The star-map drawer has a folding rule and rolled vellum on its lid.
  box(-5.05,.025,1.69,.94,.39,.52,C.walnut,'wood');block(-5.05,1.69,.94,.52);
  box(-5.05,.417,1.69,.98,.059,.55,C.oak,'wood');
  for(const x of [-5.39,-4.71]){box(x,.046,1.96,.057,.39,.032,C.brass);box(x,.479,1.69,.057,.019,.54,C.brass);}
  box(-5.05,.26,1.974,.16,.062,.025,C.brass);
  rod([-5.36,.536,1.62],[-4.90,.536,1.67],.055,C.linen);
  rod([-5.20,.503,1.84],[-4.69,.503,1.71],.016,C.brass);
  // A handwheel, flanges and wall-mounted extraction grille belong to the
  // receiver, and give the service wall a visible depth at grazing angles.
  const fan=[-6.73,1.61,-2.34];
  rod(fan,add(fan,X,.044),.39,C.iron,.39,22);rod(add(fan,X,.046),add(fan,X,.065),.31,C.ink,.31,22);
  for(const radius of [.15,.24,.32])hoop(add(fan,X,.085),Y,Z,radius,.012,C.patina,24);
  for(let k=0;k<8;k++){const a=k*TAU/8;rod(add(fan,X,.089),[fan[0]+.089,fan[1]+.31*Math.sin(a),fan[2]+.31*Math.cos(a)],.012,C.iron);}
  // Recessed floor grille and two clipped service slips.
  box(.96,.004,1.64,.89,.012,.54,C.iron);box(.96,.018,1.64,.79,.008,.44,C.ink);
  for(let j=0;j<12;j++)box(.60+j*.066,.028,1.64,.020,.009,.39,C.slate);
  // Gathered linen beside the bunk. Each fold changes direction at its tie.
  rod([3.91,2.98,-2.96],[6.04,2.98,-2.96],.026,C.brass);
  for(const side of [-1,1]){
    const edge=4.97+side*.91;
    const point=(j,row)=>[edge-side*([.32,.13,.27][row])*(j/8),[2.96,1.92,1.43][row]-.016*(j%2),
      -2.944+.043*Math.cos(j*Math.PI)+[.005,-.018,.042][row]];
    for(let j=0;j<8;j++)for(let row=0;row<2;row++)face(point(j,row+1),point(j+1,row+1),point(j+1,row),point(j,row),
      j%2?0xa76555:0xca8968,'cloth',.07);
    rod(point(0,1),point(8,1),.022,C.gold);
    path([point(5,1),add(point(5,1),[side*.07,-.12,.028]),add(point(5,1),[side*.04,-.21,.030])],.013,C.brass);
  }
  // A clipping grows in a ceramic pot on the chart dresser.
  post(3.52,.99,1.79,.114,.22,C.teal,.156);post(3.52,1.18,1.79,.16,.05,C.patina);
  for(let k=0;k<10;k++){
    const a=k*2.39,t=.19+.10*(k%3),center=[3.52,1.21,1.79],tip=[center[0]+t*Math.cos(a),1.37+.075*(k%4),center[2]+t*Math.sin(a)];
    const left=add(center,sub(tip,center),.60),crosswise=[-.055*Math.sin(a),.015,.055*Math.cos(a)];
    const mid=add(left,[0,.04,0]);rod(center,mid,.009,C.olive);
    face(center,add(left,crosswise),tip,mid,k%2?0x759579:0x849b6c);
    face(center,mid,tip,add(left,crosswise,-1),k%2?0x9daa77:0x697e67);
  }
  // The receiving drum is the exposed back half of the outside dome. Its
  // meridians curve inward above the windows and stop at the cut.
  const delta=Math.PI/drum.segments;
  function band(a,b,r,low,high,col,mat='metal',detail=.09){
    face(polar(b,r,low),polar(a,r,low),polar(a,r,high),polar(b,r,high),col,mat,detail);
  }
  function ledge(a,b,inner,outer,y,col,mat='metal'){
    face(polar(a,inner,y),polar(b,inner,y),polar(b,outer,y),polar(a,outer,y),col,mat);
  }
  for(let i=0;i<drum.segments;i++){
    const a=i*delta,b=a+delta;
    // Copper joints between radial flagstones continue the lines of the ribs.
    face(polar(a,0,-.018),polar(a,drum.r,-.018),polar(b,drum.r,-.018),polar(b,0,-.018),C.ink);
    for(const [inner,outer] of [[.014,.72],[.735,1.44],[1.46,drum.r-.008]]){
      ledge(a+.002,b-.002,inner,outer,0,i%4===0?0x617f7d:0x76918c,'floor');
    }
    band(a,b,drum.r,-.52,2.65, i%5===0?C.rust:C.iron,'enamel');
    band(a,b,drum.r-.09,0,.45,0x3c6264,'enamel');
    band(a,b,drum.r-.09,.45,2.68,i%5===0?0xc77a4c:0xc6c4a8,'enamel',.057);
    for(const [r,y,h,col] of [[drum.r+.016,-.39,.062,C.copper],[drum.r-.116,.37,.066,C.brass],[drum.r-.115,.76,.06,C.iron],[drum.r-.12,2.18,.057,C.brass]]){
      band(a,b,r,y,y+h,col);
    }
    const outer=drum.r+.009;
    face(polar(a,outer,.53),polar(b,outer,.53),polar(b,outer,2.48),polar(a,outer,2.48),
      i%5===0?0xbe7954:0xaaa994,'enamel',.057);
    if(i%2===0){
      path([polar(a,outer+.014,.08),polar(a,outer+.014,2.59)],.029,C.iron);
      for(const h of [.21,1.13,2.39])globe(polar(a,outer+.041,h),.048,.044,.046,C.copper,'metal',7,3);
    }
    // Thick cap: top, inner trim and outer trim remain visible on reverse orbit.
    ledge(a,b,drum.r-.16,drum.r+.07,2.68,C.bone);
    band(a,b,drum.r+.07,2.56,2.68,C.copper);band(a,b,drum.r-.16,2.55,2.68,C.brass);
    if(i%2===0){
      const t=a+delta/2;
      for(const h of [.19,.52,2.34]){const p=polar(t,drum.r-.12,h);globe(p,.028,.028,.028,C.brass,'metal',6,3);}
    }
  }
  for(let i=0;i<=10;i++){
    const a=i*Math.PI/10;
    const profile=[[2.15,.06],[2.15,1.90],[2.11,2.60],[2.01,2.84],[1.83,3.08],[1.54,3.28]];
    const rib=profile.map(([r,y])=>polar(a,r,y));
    path(rib,i%2===0?.060:.039,i%2===0?C.iron:C.copper,undefined,7);
    if(i%2===0)path(profile.slice(2).map(([r,y])=>polar(a,r-.050,y+.008)),.018,C.gold);
  }
  for(const [r,y,th,col] of [[1.54,3.28,.053,C.brass],[1.83,3.08,.030,C.copper],[2.20,-.43,.023,C.brass],[1.46,.018,.014,C.brass]]){
    path(Array.from({length:drum.segments+1},(_,i)=>polar(i*delta,r,y)),th,col);
  }
  // The receiver screen sits in a cast housing. Rings, sweep and returns use
  // separate depths so the glass can be inspected from an oblique angle.
  const dial=[drum.x,1.67,-7.66];
  function dialLayer(z,r,depth,col,mat){
    const at=add(dial,Z,z);rod(at,add(at,Z,depth),r,col,r,40,mat);
  }
  dialLayer(-.115,1.06,.18,C.ink);dialLayer(.060,.989,.052,C.copper);
  dialLayer(.110,.917,.054,C.bone);dialLayer(.166,.864,.024,0x357e73,'phosphor');
  const scopeFace=add(dial,Z,.197);
  for(const r of [.20,.40,.60,.79])hoop(scopeFace,X,Y,r,.009,r>.78?C.gold:0x689692,38);
  for(let i=0;i<36;i++){
    const a=TAU*i/36,co=Math.cos(a),si=Math.sin(a),tick=i%3===0?.064:.032;
    rod(add(scopeFace,[.83*co,.83*si,.009]),add(scopeFace,[(.83-tick)*co,(.83-tick)*si,.009]),.010,i%3===0?C.gold:C.patina);
    if(i%9===0)rod(add(scopeFace,[co*.13,si*.13,0]),add(scopeFace,[co*.71,si*.71,0]),.006,C.patina);
  }
  for(let i=0;i<7;i++){
    const x=.16+.46*Math.cos(1.7*i)*Math.sin(.76*i),y=-.12+.45*Math.sin(i*2.83);
    globe(add(scopeFace,[x,y,.012]),.021,.021,.012,0x9be8c7,'lit',6,3);
  }
  const sweepDir=unit([-.55,.83,0]);
  motionGroup=13;
  for(let k=1;k<=4;k++){
    const a=2.155+.033*k,unitVector=[Math.cos(a),Math.sin(a),0],z=.015;
    rod(add(scopeFace,[0,0,z]),add(add(scopeFace,unitVector,.74),Z,z),.013,0x387e74+(4-k)*0x030c0b,.012,5,'lit');
  }
  rod(add(scopeFace,[0,0,.026]),add(add(scopeFace,sweepDir,.74),Z,.026),.011,C.sea,.006,6,'lit');
  motionGroup=0;
  globe(add(scopeFace,Z,.03),.053,.053,.041,C.gold);
  for(const side of [-1,1]){
    const x=drum.x+side*.77;
    box(x,.22,-7.45,.15,.97,.20,C.iron);box(x,.26,-7.31,.21,.095,.13,C.brass);
  }
  box(drum.x,.01,-7.38,1.74,.25,.48,C.deep,'enamel');block(drum.x,-7.5,1.76,.49);
  for(let k=0;k<12;k++)box(drum.x-.70+k*.127,.076,-7.126,.061,.091,.020,k%4===0?C.copper:C.iron);
  // Clear instrument aisle, with an inset meridian and bearing marks. The
  // painted guides disappear beneath the guard plates at the threshold.
  for(const x of [-.67,.97]){
    box(x,.006,-4.02,.027,.008,3.78,C.brass);
    for(let i=0;i<12;i++)box(x+Math.sign(x)*.066,.013,-2.31-.294*i,i%3===0?.16:.077,.007,.018,C.bone);
  }
  const ringFloor=[drum.x,.022,drum.z];
  for(const r of [.45,.51,.91])hoop(ringFloor,X,Z,r,r>.90?.014:.010,C.brass,48);
  for(let i=0;i<8;i++){
    const a=i*TAU/8,dx=Math.sin(a),dz=Math.cos(a);
    const tip=add(ringFloor,[dx*(i%2?.63:.83),.009,dz*(i%2?.63:.83)]);
    const left=add(ringFloor,[-dz*.087,.009,dx*.087]),right=add(ringFloor,[dz*.087,.009,-dx*.087]);
    face(left,tip,add(ringFloor,Y,.009),left,C.bone);
    face(right,add(ringFloor,Y,.009),tip,right,C.copper);
  }
  // Low starboard service return keeps the long room open to the main camera.
  sideWall(2.35,drum.z,-3.19,.42,C.iron);block(2.35,(drum.z-3.19)/2,.17,-3.19-drum.z);
  const recorderX=1.82,recorderZ=-4.31;
  box(recorderX,.04,recorderZ,.64,.94,1.12,0x50716b,'enamel');block(recorderX,recorderZ,.64,1.12);
  box(recorderX,1.00,recorderZ,.69,.07,1.17,C.iron);
  for(const z of [recorderZ-.26,recorderZ+.24]){
    post(recorderX,1.07,z,.194,.03,C.brass,.194,24);post(recorderX,1.103,z,.151,.026,C.ink,.151,24);
    post(recorderX,1.132,z,.036,.037,C.bone);
    for(let k=0;k<3;k++){const a=TAU*k/3;rod([recorderX,1.135,z],[recorderX+.107*Math.cos(a),1.135,z+.107*Math.sin(a)],.012,C.brass);}
  }
  for(const x of [recorderX-.15,recorderX+.15])rod([x,1.088,recorderZ-.24],[x,1.088,recorderZ+.24],.009,C.walnut);
  for(let k=0;k<5;k++)box(recorderX-.21+k*.09,.71,recorderZ+.570,.046,.052,.025,k===3?C.honey:C.bone,k===3?'lit':'metal');
  for(let k=0;k<4;k++)box(recorderX,.24+.074*k,recorderZ+.57,.45,.025,.021,C.ink);
  // One deck plate has been replaced. Its lap joint, plugs and patches of
  // surviving signal-orange paint show where the crew crosses between wings.
  box(-1.22,.005,.34,.62,.015,.97,0x617471,'enamel',.026);
  for(const side of [-1,1]){
    for(const z of [-.075,.34,.755])post(-1.22+.257*side,.022,z,.032,.009,C.brass,.032,8);
    for(let j=0;j<4;j++)box(-1.22+.193*side,.022,.08+j*.151,.056,.007,.043,C.ink);
  }
  for(const [x,z,len] of [[-.69,.48,.20],[-.57,.54,.108],[.61,-1.05,.18],[.66,-1.13,.10],[-1.08,.92,.18]]){
    face([x,.008,z],[x+len,.008,z-.035],[x+len-.012,.008,z-.047],[x+.024,.008,z-.014],0x9f9580,'floor',.032);
  }
  // Last shift's signal log is still open beside the entrance. Two leaves of
  // paper meet at the spine, and a brass swing arm lights the marked reading.
  const logX=1.60,logZ=2.23,logY=table(logX,logZ,1.04,.77,0,.78,0xbd8857);
  box(logX,.12,logZ,.82,.30,.56,C.deep,'enamel');
  box(logX,.23,logZ+.29,.20,.033,.035,C.brass);
  const sheet=(side,u,v)=>[logX-.095+side*(.016+.238*u),logY+.025+.035*Math.sin(Math.PI*u)+.005*v,logZ+.165-.320*v];
  for(const side of [-1,1]){
    for(let j=0;j<4;j++)face(sheet(side,j/4,0),sheet(side,(j+1)/4,0),sheet(side,(j+1)/4,1),sheet(side,j/4,1),j===0?C.bone:C.ivory,'cloth',.035);
    for(let k=0;k<7;k++){
      const v=.13+k*.104;
      const line=[.15,.37,.59,.71+(k%3)*.063].map(u=>add(sheet(side,u,v),Y,.007));
      path(line,.005,k===1?C.rust:C.iron,undefined,4);
    }
  }
  post(logX+.33,logY,logZ-.19,.11,.039,C.brass);
  const lampTip=[logX-.02,logY+.57,logZ-.10];
  path([[logX+.33,logY+.04,logZ-.19],[logX+.40,logY+.41,logZ-.19],
        [logX+.30,logY+.60,logZ-.19],lampTip],.027,C.brass);
  post(lampTip[0],lampTip[1]-.12,lampTip[2],.133,.12,C.teal,.036,15);
  post(lampTip[0],lampTip[1]-.128,lampTip[2],.104,.012,C.honey,.102,15,'lit');
  post(logX+.32,logY,logZ+.11,.073,.135,C.bone);
  post(logX+.32,logY+.137,logZ+.11,.060,.002,C.walnut);
  hoop([logX+.40,logY+.086,logZ+.11],X,Y,.038,.011,C.brass,10);
  // Brass threshold plate and ten worn anti-slip bars at the start of the aisle.
  box(.03,.008,2.87,.82,.014,.94,0x807d68,'enamel',.035);
  for(let k=0;k<10;k++)box(.03,.023,2.466+k*.089,.65,.009,.016,k%4===0?C.brass:C.slate);
  for(const x of [-.33,.39])for(const z of [2.45,3.28])post(x,.022,z,.022,.010,C.brass,.022,7);
  // Hand-drawn contours and a taped corner distinguish the surveyor's desk
  // from the ruled log in the radio room.
  box(-3.13,deskY+.063,-2.70,.66,.012,.42,0xdacda1,'cloth',.035);
  for(let k=0;k<4;k++){
    const contour=[];for(let j=0;j<=15;j++){
      const a=j*TAU/15,r=.050+k*.036+.022*Math.sin(a*3+.3)+.012*Math.sin(5*a);
      contour.push([-3.17+1.37*r*Math.cos(a),deskY+.080,-2.71+.86*r*Math.sin(a)]);
    }
    path(contour,.005,k===2?C.copper:C.olive,undefined,4);
  }
  for(const x of [-3.41,-2.85])box(x,deskY+.078,-2.87,.086,.006,.029,C.brass);
  // The rug's two knotted ends catch the low window light.
  for(const side of [-1,1])for(let j=0;j<27;j++){
    const x=3.46+j*.081,z=.32+side*.915;
    rod([x,.378,z],[x+.017*Math.sin(j*4),.372,z+side*(.045+.026*(j%3))],.009,j%3?C.bone:C.wine,.006,4);
  }
  // A few chipped threshold paint strokes follow the feet into each doorway.
  for(const side of [-1,1]){
    const x=side<0?-1.84:2.10;
    for(let j=0;j<5;j++){
      const z=-.45+j*.22;
      face([x-.03,.012,z],[x+.035,.012,z+.031],[x+.032,.012,z+.124],[x-.029,.012,z+.093],j%3?0xc49459:0x967449,'enamel',.03);
    }
  }
  const samples={count:pigments.length};
  // An island tab can stay open across a deployment and then request this
  // room for the first time with the previous atlas builder.
  if(geo.finish.length===1){
    samples.data=new Float32Array(samples.count*16);samples.mode=new Uint8Array(samples.count);
    pigments.forEach((color,i)=>samples.data[i*16+7]=color);
  }
  const mesh=geo.finish(samples,pigments);pigments.length=0;
  mesh.scanner=scopeFace;
  mesh.turntable=sphere;
  const barriers=[];
  for(let i=1;i<rim.length;i++){
    const [x1,,z1]=polar((i-1)*delta,drum.r-.09,0),[x2,,z2]=polar(i*delta,drum.r-.09,0);
    barriers.push({x1,z1,x2,z2,r:.055});
  }
  const walkway={land:(x,z)=>inside(x,z)?height(x,z):-Infinity,edge,waterline:-10,walkingSurfaces:[],steppingRocks:[],barriers,solids,spawn:[0,3.15]};
  const motes=[];
  for(const win of windows)for(let j=0;j<22;j++){
    const t=.28+random()*3.0;
    motes.push([win.x+win.sx*t+(random()-.5)*win.w*1.62,win.y+win.sy*t+(random()-.5)*win.h*1.37,win.z+t,
      .0045+.0035*random(),win.color.map(c=>c*(113+55*random())),true]);
  }
  const frame=[];
  for(const [l,b,r,f] of perimeter){
    for(const [x,z] of [[l,b],[r,f]]){
      frame.push([x,-.54,z],[x,z<=drum.z?3.32:z<-.8?3.23:1.16,z]);
    }
  }
  return {mesh,windows,motes,walkway,frame,light:roomLight,exit:[0,.58,3.92],home:{target:[.04,1.18,-1.65],yaw:.47,pitch:.67,zoom:1},
  };
}

// Integrate window light along the visible part of each camera ray. Depth from
// the opaque pass clips the light at the first surface, including the traveler.
function makeInteriorLightPass(gl,program,level,sceneTexture){
  const vertex='attribute vec2 corner;varying vec2 uv;void main(){uv=.5+.5*corner;gl_Position=vec4(corner,0.,1.);}';
  const pg=program(vertex,`precision highp float;
    varying vec2 uv;uniform sampler2D scene;uniform vec2 viewport;uniform vec3 right,up,eye,focus;
    uniform float scale;uniform vec4 aperture[3],shape[3];uniform vec3 tint[3];
    float luma(vec3 c){return dot(c,vec3(.24,.59,.17));}
    float ink(vec4 c,vec4 d){return max(.57*smoothstep(.004,.026,abs(c.a-d.a)),.62*smoothstep(.11,.36,luma(d.rgb)-luma(c.rgb)));}
    void main(){
      vec4 surface=texture2D(scene,uv);vec2 pixel=(uv-.5)*viewport/scale;
      vec3 at=focus+right*pixel.x+up*pixel.y;
      float nearest=surface.a>.015?(.5-surface.a)*48.:-24.;
      vec3 base=vec3(5.,6.,12.)/255.;
      if(surface.a>.015){
        vec2 texel=1./viewport;
        float edge=max(ink(surface,texture2D(scene,uv+vec2(texel.x,0.))),ink(surface,texture2D(scene,uv+vec2(0.,texel.y))));
        base=surface.rgb*(1.-.38*edge);
      }
      vec3 beam=vec3(0.);
      for(int i=0;i<3;i++){
        vec3 center=aperture[i].xyz;float width=aperture[i].w,height=shape[i].x,lengthZ=shape[i].w;
        vec2 shear=shape[i].yz;vec3 origin=at-center;
        origin.xy-=shear*origin.z;
        vec3 dir=vec3(eye.xy-shear*eye.z,eye.z);
        vec3 inv=vec3(1.)/(dir+mix(vec3(-.00001),vec3(.00001),step(vec3(0.),dir)));
        vec2 spread=vec2(width,height)+lengthZ*vec2(.048,.033);
        vec3 a=(vec3(-spread,0.)-origin)*inv,b=(vec3(spread,lengthZ)-origin)*inv;
        vec3 lo=min(a,b),hi=max(a,b);
        float enter=max(nearest,max(lo.x,max(lo.y,lo.z))),leave=min(24.,min(hi.x,min(hi.y,hi.z)));
        if(leave<=enter)continue;
        float stepSize=(leave-enter)/16.,density=0.;
        for(int j=0;j<16;j++){
          float depth=enter+(float(j)+.5)*stepSize;vec3 p=origin+dir*depth;
          if(at.y+eye.y*depth<.04)continue;
          vec2 q=p.xy/(vec2(width,height)+p.z*vec2(.048,.033));
          float shapeEdge=min(1.-abs(q.y),1.-length(vec2(q.x,max(0.,(q.y-.39)/.61))));
          float soft=.028+.047*p.z;
          float bars=mix(.08,1.,smoothstep(.020,.052+soft,abs(q.x)));
          bars*=mix(.15,1.,smoothstep(.014,.040+soft,min(abs(q.y+.40),min(abs(q.y-.09),abs(q.y-.47)))));
          float fade=smoothstep(0.,.18,p.z)*(1.-smoothstep(.49,1.,p.z/lengthZ));
          density+=smoothstep(-soft,soft,shapeEdge)*bars*fade;
        }
        beam+=tint[i]*(1.-exp(-.40*density*stepSize));
      }
      gl_FragColor=vec4(base+(.97-base)*min(beam,vec3(.76)),1.);
    }`);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const a=gl.getAttribLocation(pg,'corner'),u={};
  for(const n of ['scene','viewport','right','up','eye','focus','scale','aperture[0]','shape[0]','tint[0]'])u[n]=gl.getUniformLocation(pg,n);
  const aperture=level.windows.flatMap(v=>[v.x,v.y,v.z,v.w]),shape=level.windows.flatMap(v=>[v.h,v.sx,v.sy,v.length]),tint=level.windows.flatMap(v=>v.color);
  return function(axes,target,scale,w,h){
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,w,h);gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);
    gl.useProgram(pg);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,sceneTexture);gl.uniform1i(u.scene,0);
    gl.uniform2f(u.viewport,w,h);gl.uniform3fv(u.right,axes[0]);gl.uniform3fv(u.up,axes[1]);gl.uniform3fv(u.eye,axes[2]);
    gl.uniform3fv(u.focus,target);gl.uniform1f(u.scale,scale);
    gl.uniform4fv(u['aperture[0]'],aperture);gl.uniform4fv(u['shape[0]'],shape);gl.uniform3fv(u['tint[0]'],tint);
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    gl.drawArrays(gl.TRIANGLES,0,3);gl.disableVertexAttribArray(a);
  };
}
function softwareInteriorLight(level,pixels,depth,axes,target,scale,w,h){
  const [right,up,eye]=axes;
  for(let i=0;i<pixels.length;i++)if(depth[i]===-40)pixels[i]=0xff0c0605;
  for(const a of level.windows){
    const dx=eye[0]-a.sx*eye[2],dy=eye[1]-a.sy*eye[2],dz=eye[2];
    const inv=v=>1/(v+(v<0?-.00001:.00001)),ix=inv(dx),iy=inv(dy),iz=inv(dz);
    const spanX=a.w+.048*a.length,spanY=a.h+.033*a.length;
    // Project the eight corners of the sheared beam. Only this region can
    // contain scattering, which keeps the fallback practical on a phone.
    let lx=w,hx=0,ly=h,hy=0;
    for(const z of [0,a.length])for(const x of [-spanX,spanX])for(const y of [-spanY,spanY]){
      const X=a.x+x+a.sx*z-target[0],Y=a.y+y+a.sy*z-target[1],Z=a.z+z-target[2];
      const px=w*.5+scale*(right[0]*X+right[2]*Z),py=h*.5-scale*(up[0]*X+up[1]*Y+up[2]*Z);
      lx=Math.min(lx,px);hx=Math.max(hx,px);ly=Math.min(ly,py);hy=Math.max(hy,py);
    }
    for(let y=Math.max(0,Math.floor(ly));y<Math.min(h,hy+1);y++)for(let x=Math.max(0,Math.floor(lx));x<Math.min(w,hx+1);x++){
      const off=y*w+x,px=(x+.5-w*.5)/scale,py=(h*.5-y-.5)/scale;
      const atY=target[1]+up[1]*py,z0=target[2]+right[2]*px+up[2]*py-a.z;
      const x0=target[0]+right[0]*px+up[0]*py-a.x-a.sx*z0,y0=atY-a.y-a.sy*z0;
      const xa=(-spanX-x0)*ix,xb=(spanX-x0)*ix,ya=(-spanY-y0)*iy,yb=(spanY-y0)*iy,za=-z0*iz,zb=(a.length-z0)*iz;
      const start=Math.max(depth[off],Math.min(xa,xb),Math.min(ya,yb),Math.min(za,zb));
      const end=Math.min(24,Math.max(xa,xb),Math.max(ya,yb),Math.max(za,zb));if(end<=start)continue;
      const step=(end-start)/10;let sum=0;
      for(let j=0;j<10;j++){
        const t=start+(j+.5)*step,z=z0+dz*t;if(atY+eye[1]*t<.04)continue;
        const u=(x0+dx*t)/(a.w+.048*z),v=(y0+dy*t)/(a.h+.033*z),soft=.035+z*.047;
        const edge=Math.min(1-Math.abs(v),1-Math.hypot(u,Math.max(0,(v-.39)/.61)));
        const bars=Math.min(1,.09+Math.abs(u)/(.046+soft))*Math.min(1,.14+Math.min(Math.abs(v+.40),Math.abs(v-.09),Math.abs(v-.47))/(.040+soft));
        sum+=Math.min(1,Math.max(0,.5+edge/(2*soft)))*bars*Math.min(1,z/.18)*Math.min(1,Math.max(0,2*(1-z/a.length)));
      }
      const k=1-Math.exp(-.40*sum*step),c=pixels[off];let out=0xff000000;
      for(let j=0;j<3;j++){const n=c>>(8*j)&255;out|=(n+(247-n)*k*a.color[j])<<8*j;}
      pixels[off]=out;
    }
  }
}
