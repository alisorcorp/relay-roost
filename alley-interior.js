// Two rooms above the service lane. Coordinates are local to the alley door.
function createAlleyInterior(makePaintedGeometry){
  const geo=makePaintedGeometry(),pigments=[],solids=[];
  const TAU=Math.PI*2,X=[1,0,0],Y=[0,1,0],Z=[0,0,1];
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t;
  const add=(a,b,t=1)=>a.map((v,i)=>v+t*b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const unit=a=>a.map(v=>v/(Math.hypot(...a)||1)),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
  const C={tar:0x222331,ink:0x343544,steel:0x637077,nickel:0xa9a8a0,cream:0xd0c2a3,
    red:0xa65248,oxide:0x995a43,ochre:0xc19b57,brass:0xc4a768,blue:0x4c656e,jade:0x53766a,
    wood:0xaf805a,ply:0xd0ab83,tape:0xd6bd89,linen:0xdccbb1,plum:0x815966,denim:0x637e91,
    board:0x3e725a,mint:0x8dffa7,green:0x44cf80,amber:0xffc083,pink:0xfc7297,ice:0x96d9df};
  const workshop=[-5,.72,-2.7,2.75],flat=[.72,4.85,-4.32,.99],stoop=[-2.50,-1.10,2.75,3.43],rooms=[workshop,flat,stoop];
  const windows=[
    {x:-4.07,y:2.16,z:-2.53,w:.53,h:.36,sx:.37,sy:-.51,length:3.5,color:[.22,.52,.48]},
    {x:2.76,y:1.91,z:-4.16,w:.44,h:.57,sx:-.18,sy:-.47,length:3.2,color:[.56,.21,.42]},
    {x:3.69,y:1.91,z:-4.16,w:.44,h:.57,sx:-.18,sy:-.47,length:3.2,color:[.18,.35,.51]}
  ];
  // Center, throw, RGB intensity and direction. The screen throws green
  // forward, the clamp lamp lights the vise, and the bedside bulb washes the quilt.
  const lights=[
    [-2.48,1.53,-1.38,2.45,.11,1.42,.35,'screen'],
    [-.93,1.82,-1.67,1.56,1.16,.71,.30,'down'],
    [-4.07,2.16,-2.46,1.65,.14,.56,.48,'screen'],
    [-4.62,1.86,.24,1.72,.48,.19,.37,'all'],
    [-1.80,.91,2.98,1.54,.53,.32,.16,'all'],
    [1.92,2.40,-3.93,1.89,.36,.55,.50,'down'],
    [4.09,1.50,-1.23,2.25,1.32,.69,.31,'all'],
    [3.22,1.93,-4.08,2.40,.59,.25,.51,'screen']
  ];
  function lampGain(l,x,y,z){
    const dx=x-l[0],dy=y-l[1],dz=z-l[2],r=l[3],d2=(dx*dx+dy*dy+dz*dz)/(r*r);
    if(d2>3)return 0;
    const cone=l[7]==='screen'?.38+.62*clamp(.50+dz*1.7):l[7]==='down'?.30+.70*clamp(.85-dy*2):1;
    return cone*Math.exp(-2.15*d2);
  }
  function lighting(x,y,z){
    const inFlat=x>.72;
    const col=inFlat?[.43,.41,.47]:[.41,.46,.49];
    for(const lamp of lights){const g=lampGain(lamp,x,y,z);for(let k=0;k<3;k++)col[k]+=lamp[4+k]*g;}
    return col;
  }
  function actorLighting(x,y,z){
    const ambient=lighting(x,y,z),bright=lights.map(l=>({lamp:l,g:lampGain(l,x,y,z)}))
      .filter(({g})=>g>.07).sort((a,b)=>b.g*Math.max(...b.lamp.slice(4,7))-a.g*Math.max(...a.lamp.slice(4,7))).slice(0,2);
    for(const {lamp,g} of bright)for(let k=0;k<3;k++)ambient[k]-=.83*g*lamp[4+k];
    return {ambient,points:bright.map(({lamp:l})=>[l[0],l[1],l[2],2.15/(l[3]*l[3]),l[4]*.93,l[5]*.93,l[6]*.93])};
  }
  let seed=782514;
  const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  const pick=a=>a[Math.floor(rand()*a.length)];
  function hash(x,y){let v=Math.imul(x,2654435761)^Math.imul(y,1597334677);v=Math.imul(v^(v>>>16),2246822519);return ((v^(v>>>13))>>>0)/4294967296}
  function wash(x,y){const a=Math.floor(x),b=Math.floor(y),u=x-a,v=y-b,s=u*u*(3-2*u),t=v*v*(3-2*v);
    return mix(mix(hash(a,b),hash(a+1,b),s),mix(hash(a,b+1),hash(a+1,b+1),s),t);}
  const stains=[[-2.46,-1.86,1.46,.75],[-4.46,.77,.64,.76],[-3.85,1.88,.65,.60],[.17,-1.96,.53,.52],
    [1.54,-3.49,.74,.62],[3.99,-2.87,.67,1.2],[3.75,.32,.65,.54],[-1.34,-.87,.35,.39],[-.05,1.91,.62,.56],[-4.46,-1.72,.36,.33]];
  function face(a,b,c,d,color,mat='paint',size=.09){
    const A=sub(b,a),B=sub(d,a),D=sub(c,b),n=unit(cross(A,B)),h=Math.max(Math.hypot(...A),Math.hypot(...sub(c,d))),v=Math.max(Math.hypot(...B),Math.hypot(...D));
    const cols=Math.max(1,Math.ceil(h/size)),rows=Math.max(1,Math.ceil(v/size)),first=pigments.length;
    const base=[color>>16&255,color>>8&255,color&255],plane=.76+.18*Math.max(0,n[1])+.14*Math.max(0,dot(n,[-.42,.70,.58]));
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
      const u=(i+.5)/cols,t=(j+.5)/rows,[x,y,z]=a.map((p,k)=>p+A[k]*u+mix(B[k],D[k],u)*t);
      const s=Math.abs(n[0])>.7?z:x,q=Math.abs(n[1])>.6?z:y;
      const cloud=wash(s*2.1,q*2.1),grit=wash(s*13+.3,q*13),edge=Math.min(u*h,(1-u)*h,t*v,(1-t)*v);
      let value=plane+.18*(cloud-.5)+.08*(grit-.5),wear=0,shift=[118,79,60];
      if(mat==='lit'){pigments.push(base[0]|base[1]<<8|base[2]<<16);continue}
      if(mat==='phosphor'){
        const px=(x+2.51)/.57,py=(y-1.548)/.36;
        const glow=(1.17-.30*(px*px+py*py))*(.94+.06*Math.cos(y*178));
        pigments.push((base[0]*glow|0)|(base[1]*glow|0)<<8|(base[2]*glow|0)<<16);continue;
      }
      if(mat==='screen'){
        const corners=((u-.5)*1.50)**2+((t-.5)*1.65)**2;
        const scan=.90+.10*Math.cos(y*168),glow=1.13-.53*corners+.07*cloud;
        pigments.push(clamp(base[0]*glow*scan,0,255)|clamp(base[1]*glow*scan,0,255)<<8|clamp(base[2]*glow*scan,0,255)<<16);continue;
      }
      if(mat==='plaster'){
        wear=clamp((wash(s*1.83,q*2.67)+.24*grit+.20*Math.exp(-edge*5)-.80)*4);
        value-=.19*(1-clamp(y/1.18))+.07*wash(s*10,q*.72);
        shift=[119,107,93];
      }else if(mat==='paint'){
        wear=clamp((cloud+.26*grit+.32*Math.exp(-edge*20)-.99)*4);
      }else if(mat==='wood'||mat==='box'){
        const fibre=.5+.5*Math.sin(q*48+3.6*wash(s*1.5,q*5.2));
        value+=mat==='wood'?.15*(cloud-.4)-.12*fibre**5:.09*(grit-.5)-.13*Math.exp(-edge*20);
      }else if(mat==='floor'){
        value+=.22*(cloud-.5)-.17*clamp((wash(x*4.3+z*.7,z*8.2)-.55)*3.5);
        for(const [cx,cz,rx,rz] of stains){const dx=(x-cx)/rx,dz=(z-cz)/rz;if(Math.abs(dx)<1.8&&Math.abs(dz)<1.8)value-=.36*Math.exp(-1.7*(dx*dx+dz*dz));}
      }else if(mat==='cloth'){
        value+=.10*(wash(s*5,q*5)-.48)+.045*Math.cos(s*51+q*52);
      }
      const l=lighting(x,y,z),rgb=base.map((c,k)=>clamp(Math.round(value*l[k]*mix(c,shift[k],wear)),0,255));
      pigments.push(rgb[0]|rgb[1]<<8|rgb[2]<<16);
    }
    geo.panel(a,b,c,d,first,cols,rows,0);
  }
  // Box coordinates are center x/z and bottom y.
  function box(x,y,z,w,h,d,col,mat='paint',detail){
    const l=x-w/2,r=x+w/2,b=z-d/2,f=z+d/2,t=y+h,F=(a,b,c,d)=>face(a,b,c,d,col,mat,detail);
    F([l,y,f],[r,y,f],[r,t,f],[l,t,f]);F([r,y,b],[l,y,b],[l,t,b],[r,t,b]);
    F([l,y,b],[l,y,f],[l,t,f],[l,t,b]);F([r,y,f],[r,y,b],[r,t,b],[r,t,f]);
    F([l,t,f],[r,t,f],[r,t,b],[l,t,b]);F([l,y,b],[r,y,b],[r,y,f],[l,y,f]);
  }
  function rod(a,b,r,col,end=r,sides=9,mat='paint'){
    const axis=unit(sub(b,a)),u=unit(cross(axis,Math.abs(axis[1])<.86?Y:Z)),v=cross(axis,u);
    const at=(p,R,k)=>add(add(p,u,R*Math.cos(TAU*k/sides)),v,R*Math.sin(TAU*k/sides));
    for(let i=0;i<sides;i++){const p=at(a,r,i),q=at(a,r,i+1),P=at(b,end,i),Q=at(b,end,i+1);
      face(p,q,Q,P,col,mat,.16);if(end>.029)face(b,P,Q,b,col,mat,.16);if(r>.029)face(a,q,p,a,col,mat,.16);}
  }
  const post=(x,y,z,r,h,c,R=r,n=12,m)=>rod([x,y,z],[x,y+h,z],r,c,R,n,m);
  function wire(points,r,c,mat='paint',sides=6){for(let i=1;i<points.length;i++)rod(points[i-1],points[i],r,c,r,sides,mat)}
  function ring(center,A,B,r,th,c,n=22,mat='paint'){const pts=[];for(let j=0;j<=n;j++)pts.push(add(add(center,A,r*Math.cos(TAU*j/n)),B,r*Math.sin(TAU*j/n)));wire(pts,th,c,mat);}
  const block=(x,z,w,d)=>solids.push({left:x-w/2,right:x+w/2,back:z-d/2,front:z+d/2});
  const inRect=(x,z,r)=>x>=r[0]&&x<=r[1]&&z>=r[2]&&z<=r[3],inside=(x,z)=>rooms.some(r=>inRect(x,z,r));
  const xs=[...new Set(rooms.flatMap(r=>r.slice(0,2)))].sort((a,b)=>a-b),zs=[...new Set(rooms.flatMap(r=>r.slice(2)))].sort((a,b)=>a-b),edges=[];
  for(let i=1;i<xs.length;i++)for(let j=1;j<zs.length;j++){
    const l=xs[i-1],r=xs[i],b=zs[j-1],f=zs[j],x=(l+r)/2,z=(f+b)/2;if(!inside(x,z))continue;
    if(!inside(l-.01,z))edges.push([l,b,l,f]);if(!inside(r+.01,z))edges.push([r,b,r,f]);
    if(!inside(x,b-.01))edges.push([l,b,r,b]);if(!inside(x,f+.01))edges.push([l,f,r,f]);
  }
  const land=(x,z)=>inside(x,z)?(x>.72?.12:0):-Infinity;
  function edge(x,z){let d=Infinity;for(const [a,b,c,f] of edges)d=Math.min(d,Math.hypot(x-clamp(x,a,c),z-clamp(z,b,f)));return inside(x,z)?-d:d}
  for(const [idx,[l,r,b,f]] of rooms.entries()){
    const y=idx===1?.12:0;
    box((l+r)/2,-.42,(b+f)/2,r-l,y+.416,f-b,C.tar);
    const nx=idx===1?3:Math.ceil((r-l)/.72),nz=Math.ceil((f-b)/(idx===1?.36:.94));
    for(let j=0;j<nz;j++)for(let k=0;k<nx+(idx===1&&j%2?1:0);k++){
      const shift=idx===1&&j%2?-.43:0,L=Math.max(l,l+(k+shift)*(r-l)/nx)+.008,R=Math.min(r,l+(k+1+shift)*(r-l)/nx)-.008;
      const B=b+j*(f-b)/nz+.008,F=b+(j+1)*(f-b)/nz-.008;
      face([L,y,F],[R,y,F],[R,y,B],[L,y,B],idx===1?pick([0xac8268,0xba8d6e,0x9e7c69]):pick([0x717b78,0x828982,0x75817e,0x6a7879]),idx===1?'wood':'floor',.038);
    }
  }
  for(const [l,b,r,f] of edges){
    const len=Math.hypot(r-l,f-b),dx=(r-l)/len,dz=(f-b)/len;
    rod([l,-.28,b],[r,-.28,f],.032,C.oxide);
    for(let t=.17;t<len;t+=.58)box(l+dx*t,-.39,b+dz*t,dx?.052:.086,.29,dz?.052:.086,C.steel);
  }
  function backWall(x,z,w,base,h,col){
    box(x,base,z,w,h,.17,col,'plaster',.042);box(x,base+h-.052,z,w+.07,.068,.22,C.ink);
    box(x,base+.013,z+.089,w,.17,.083,C.steel);
    for(let j=0;j<Math.ceil(w/.78);j++){
      const cw=w/Math.ceil(w/.78),xx=x-w/2+(j+.5)*cw;
      box(xx,base+.184,z+.090,cw-.022,.54,.051,pick([C.jade,C.blue,0x686663]),'paint',.046);
    }
    box(x,base+.724,z+.10,w,.038,.074,C.nickel);
  }
  function side(x,b,f,y,h,col){box(x,y,(b+f)/2,.14,h,f-b,col,'plaster',.05);box(x,y+h-.035,(b+f)/2,.21,.048,f-b+.047,C.steel)}
  backWall(-2.14,-2.69,5.72,0,2.76,0x9dada0);backWall(2.785,-4.31,4.13,.12,2.57,0xb9a492);
  side(-4.985,-2.68,-.08,0,2.45,0x829792);side(-4.985,-.08,2.74,0,.25,C.blue);
  side(4.835,-4.30,-1.62,.12,2.17,0x967b7c);side(4.835,-1.62,.97,.12,.18,C.plum);
  side(.72,-4.30,-1.41,0,2.31,0x858c87);block(.72,-2.855,.17,2.89);
  side(.72,.04,.98,0,.55,C.steel);block(.72,.51,.17,.94);
  for(const z of [-1.41,.04]){box(.72,0,z,.255,2.23,.16,C.steel);box(.72,1.79,z,.27,.12,.19,C.oxide)}
  box(.72,2.15,-.685,.25,.125,1.59,C.oxide);
  for(const x of [-2.45,-1.15]){
    box(x,0,3.01,.115,.93,.62,C.red);box(x,.78,3.01,.15,.14,.66,C.oxide);box(x,.92,3.04,.105,.031,.25,C.amber,'lit');
  }
  box(-1.80,.009,3.12,1.18,.021,.31,C.steel);
  for(let j=0;j<12;j++)box(-2.31+j*.092,.032,3.12,.022,.010,.27,C.ink);
  function pane(w,col){
    const {x,y,z}=w,W=w.w*2,H=w.h*2;
    box(x,y-H/2-.06,z-.033,W+.13,H+.12,.12,C.tar);
    face([x-W/2,y-H/2,z+.035],[x+W/2,y-H/2,z+.035],[x+W/2,y+H/2,z+.035],[x-W/2,y+H/2,z+.035],col,'screen',.026);
    for(const u of [-.49,0,.49])box(x+u*W,y-H/2,z+.056,.024,H,.045,C.steel);
    for(let j=0;j<5;j++)box(x,y-H/2+.087+j*(H-.13)/4,z+.085,W+.035,.038,.088,C.ink);
    box(x,y-H/2-.062,z+.056,W+.17,.065,.20,C.nickel);
  }
  windows.forEach((w,i)=>pane(w,[0x88bca2,0xc66e98,0x718daa][i]));
  // Chamfered CRT cabinets taper toward the neck of the tube. The bezel, curved
  // glass and phosphor trace each sit at a different depth.
  let sweepAt;
  function television(x,y,z,s,on){
    const at=(u,v,d)=>[x+u*s,y+v*s,z+d*s];
    const outline=(w,h,cut,d)=>[[-w,-h+cut],[-w+cut,-h],[w-cut,-h],[w,-h+cut],[w,h-cut],[w-cut,h],[-w+cut,h],[-w,h-cut]].map(([u,v])=>at(u,v,d));
    const shell=on?0xc6baa0:0x7b7f7a;
    const loops=[outline(.50,.366,.075,-.73),outline(.74,.51,.10,-.32),outline(.76,.53,.09,-.015),outline(.70,.475,.07,.035),outline(.614,.410,.086,.042),outline(.571,.367,.078,.028)];
    const shades=[0x86857b,shell,0xc9bfab,C.ink,0x4c5351];
    for(let j=1;j<loops.length;j++)for(let k=0;k<8;k++){const n=(k+1)%8;face(loops[j-1][k],loops[j-1][n],loops[j][n],loops[j][k],shades[j-1],'paint',.040);}
    face(at(-.50,-.366,-.73),at(.50,-.366,-.73),at(.50,.366,-.73),at(-.50,.366,-.73),C.steel);
    const tube=(u,v,d=0)=>at(u*(.567-.025*Math.abs(v)**5),v*(.356-.021*Math.abs(u)**5),.030+.058*(1-u*u)*(1-v*v)+d);
    for(let j=0;j<6;j++)for(let k=0;k<8;k++){
      const u=-1+k/4,v=-1+j/3;
      face(tube(u,v),tube(u+.25,v),tube(u+.25,v+1/3),tube(u,v+1/3),on?0x1f7650:0x495755,on?'phosphor':'paint',.022);
    }
    if(on){
      for(let j=0;j<22;j++){const v=-.92+.087*j;wire([tube(-.91,v,.002),tube(-.44,v,.002),tube(0,v,.002),tube(.44,v,.002),tube(.91,v,.002)],.0028*s,0x327350,'lit',4);}
      for(const u of [-.75,-.36,.04,.44,.84])wire([tube(u,-.78,.003),tube(u,0,.003),tube(u,.68,.003)],.0036*s,0x488662,'lit',4);
      sweepAt=t=>tube(-.89+t*1.76,.075+.40*Math.sin(t*TAU*2.28)*(.20+.80*Math.sin(Math.PI*t)**2)+.071*Math.sin(t*TAU*8.4),.017);
      const signal=Array.from({length:59},(_,j)=>sweepAt(j/58));
      wire(signal,.014*s,0x68d98a,'lit');wire(signal.map(p=>add(p,Z,.006*s)),.006*s,0xceffd3,'lit',5);
      for(let j=0;j<7;j++)wire([tube(-.81+j*.194,-.58,.009),tube(-.72+j*.194,-.58,.009)],.012*s,j<4?C.mint:0x419362,'lit',4);
      wire([tube(-.83,.74,.009),tube(-.49,.74,.009)],.012*s,0xaff7bd,'lit',4);
    }else{
      for(const points of [[[.78,.58],[.41,.08],[.50,-.14],[.24,-.77]],[[.42,.08],[.13,.09],[-.12,-.10]]])wire(points.map(([u,v])=>tube(u,v,.007)),.008*s,C.tar);
    }
    for(let k=0;k<7;k++)box(x+(-.47+.119*k)*s,y+.534*s,z-.17*s,.057*s,.009*s,.17*s,C.ink);
    box(x+.54*s,y-.459*s,z+.037*s,.043*s,.023*s,.015*s,on?C.mint:C.oxide,on?'lit':'paint');
    rod(at(.41,-.449,.027),at(.41,-.449,.066),.034*s,C.steel);
    box(x,y-.575*s,z-.22*s,.93*s,.061*s,.42*s,C.tar);
  }
  function carton(x,y,z,w,h,d,closed=true){
    const col=pick([0xba996c,0xbe9167,0xd1b282,0xb18d69]);
    if(closed){box(x,y,z,w,h,d,col,'box',.043);box(x,y+h+.003,z,w*.17,.009,d+.004,C.tape,'box');
      box(x,y+h*.60,z+d*.5+.005,w*.17,h*.38,.009,C.tape,'box');}
    else{
      box(x,y,z,w,.037,d,C.wood);
      for(const a of [-1,1]){
        box(x+a*(w/2-.022),y,z,.044,h,d,col,'box',.041);box(x,y,z+a*(d/2-.021),w,h,.042,col,'box',.041);
        const f=z+a*d*.5,hf=f+a*d*.18;
        face([x-w*.47,y+h,f],[x+w*.47,y+h,f],[x+w*.45,y+h*.88,hf],[x-w*.45,y+h*.88,hf],col,'box',.037);
      }
    }
    box(x-w*.21,y+h*.37,z+d*.5+.013,w*.27,h*.28,.009,C.linen);
    for(let k=0;k<6;k++)box(x-w*.318+k*w*.029,y+h*.398,z+d*.5+.022,.009+k%2*.006,h*.13,.005,C.ink);
  }
  function pcb(x,y,z,w,d){
    box(x,y,z,w,.025,d,C.board);
    for(let row=0;row<2;row++)for(let k=0;k<3;k++){
      const xx=x+(k-1)*w*.265,zz=z+(row-.5)*d*.43;
      box(xx,y+.027,zz,w*.142,.031,d*.20,C.tar);
      for(let j=0;j<3;j++)box(xx+(j-1)*w*.042,y+.03,zz,w*.012,.012,d*.30,C.nickel);
      wire([[xx,y+.027,zz+d*.18],[xx+w*.064,y+.027,zz+d*.18],[xx+w*.111,y+.027,zz+d*.27]],.0035,C.brass,undefined,4);
    }
    for(let j=0;j<9;j++)box(x-w*.38+j*w*.094,y+.028,z+d*.46,w*.040,.008,d*.071,C.brass);
  }
  function can(x,y,z,s,col,lid=C.nickel){
    post(x,y,z,.096*s,.272*s,col,.096*s,12);post(x,y+.27*s,z,.099*s,.018*s,lid);
    post(x,y+.014*s,z,.10*s,.018*s,C.steel);box(x,y+.09*s,z+.096*s,.092*s,.071*s,.012*s,C.linen);
  }
  function metalShelf(x,z,w,d,ys){
    for(const sign of [-1,1])for(const side of [-1,1])box(x+sign*(w*.5-.036),.02,z+side*(d*.5-.036),.052,ys.at(-1)+.25,.052,C.steel);
    for(const y of ys){box(x,y,z,w,.065,d,C.blue);box(x,y-.045,z+d*.5,w,.102,.047,C.steel);}
    wire([[x-w*.46,.11,z-d*.48],[x+w*.46,ys.at(-1),z-d*.48]],.023,C.oxide);
  }
  // Repair bench: the green tube is the brightest object in this room.
  box(-2.06,.84,-1.94,2.94,.14,.91,C.wood,'wood',.024);
  box(-2.06,.78,-1.47,2.99,.12,.053,C.oxide);
  for(const x of [-3.40,-.72])for(const z of [-2.27,-1.59])box(x,.02,z,.087,.83,.087,C.steel);
  block(-2.06,-1.94,2.90,.91);box(-2.69,.08,-1.96,.83,.61,.56,C.jade);
  for(let j=0;j<3;j++){box(-2.69,.12+j*.18,-1.67,.73,.14,.029,C.steel);box(-2.69,.18+j*.18,-1.645,.21,.024,.031,C.nickel);}
  television(-2.51,1.548,-1.61,1,true);
  box(-1.65,.982,-1.64,.41,.031,.27,C.ink);for(let j=0;j<3;j++)for(let k=0;k<8;k++)box(-1.811+k*.045,1.014,-1.73+j*.058,.031,.012,.034,k===7?C.red:C.nickel);
  pcb(-1.11,.985,-1.68,.42,.27);
  post(-1.15,.982,-2.06,.11,.037,C.tar);post(-1.15,1.02,-2.06,.07,.135,C.nickel);
  for(let k=0;k<5;k++)ring([-1.15,1.025+k*.023,-2.06],X,Z,.074,.009,C.steel,14);
  // A sprung iron clamp holds the inspection lamp above the exposed board.
  wire([[-.72,.98,-2.14],[-.66,1.52,-2.18],[-.96,1.88,-2.01],[-1.12,1.82,-1.84]],.024,C.brass);
  post(-1.12,1.732,-1.84,.135,.107,C.jade,.039);post(-1.12,1.723,-1.84,.108,.010,C.amber,.11,16,'lit');
  wire([[-.90,.997,-1.50],[-.76,1.01,-1.64],[-.81,1.01,-1.87],[-.73,.99,-2.10],[-.64,.66,-2.14]],.013,C.tar);
  // Pegboard, half-empty packets and bent spanners above the bench.
  box(-1.61,1.13,-2.53,1.83,1.33,.065,C.wood,'wood',.035);
  for(let j=0;j<6;j++)for(let k=0;k<13;k++)box(-2.37+k*.127,1.24+j*.201,-2.49,.018,.026,.010,C.tar);
  for(let j=0;j<6;j++){const x=-2.32+j*.19,y=2.17-j%3*.07;
    ring([x,y,-2.45],X,Y,.038,.011,C.nickel,10);wire([[x,y-.032,-2.45],[x+.023,y-.23,-2.45],[x+.037,y-.31,-2.45]],.013,j%2?C.nickel:C.oxide);}
  for(let i=0;i<4;i++)box(-1.34+i*.132,1.48+i%2*.20,-2.444,.097,.145,.032,i%2?C.tape:C.denim);
  post(-1.35,.02,-.88,.26,.048,C.tar);post(-1.35,.069,-.88,.044,.49,C.nickel);
  post(-1.35,.54,-.88,.245,.087,C.oxide,.263,18);block(-1.35,-.88,.36,.36);
  // Tall sorting rack. Plastic bins contain wires, loose coils and old drives.
  metalShelf(.13,-2.08,.86,.77,[.15,.76,1.38,2.05]);block(.13,-2.08,.86,.77);
  carton(.13,.215,-2.10,.65,.38,.51);for(let k=0;k<3;k++){
    box(-.09+k*.221,.825,-2.04,.197,.27,.48,k===1?C.jade:C.oxide);
    box(-.09+k*.221,1.05,-1.791,.107,.036,.014,C.tape);
    ring([-.09+k*.221,1.12,-2.04],Y,Z,.084,.016,k%2?C.nickel:C.tar,12);
  }
  for(let j=0;j<3;j++){box(.12,1.45+j*.103,-2.06,.63,.081,.48,C.ink);box(.12,1.471+j*.103,-1.81,.46,.013,.018,C.nickel);}
  carton(.00,2.115,-2.09,.48,.28,.48);can(.43,2.12,-2.02,.70,C.red);
  // Scrap corner: a dead set with a split tube, taped boxes and a milk crate.
  carton(-4.40,.018,.88,.93,.55,.74);television(-4.39,.968,1.10,.67,false);
  carton(-4.05,0,1.84,.76,.51,.66);carton(-4.13,.52,1.85,.56,.37,.49);
  carton(-3.31,.012,2.04,.59,.37,.52,false);
  for(let j=0;j<5;j++){const x=-3.50+j*.087;box(x,.15,2.04,.045,.31+j%2*.10,.27,j%2?C.board:C.ink);}
  block(-4.30,.96,1.10,.81);block(-3.83,1.87,1.51,.81);
  const crate=[-4.50,.02,-.42];
  box(crate[0],.03,crate[2],.68,.076,.63,C.tar);
  for(const s of [-1,1]){for(let k=0;k<4;k++){
    box(crate[0],.089+k*.093,crate[2]+s*.30,.70,.043,.032,C.jade);box(crate[0]+s*.33,.089+k*.093,crate[2],.032,.043,.63,C.jade);}
    for(const u of [-1,1])box(crate[0]+s*.325,.05,crate[2]+u*.295,.053,.385,.055,C.steel);}
  for(let j=0;j<3;j++){post(-4.69+.17*j,.091,-.44,.067,.31+j*.04,C.oxide);ring([-4.68+.16*j,.442,-.42],X,Y,.08,.020,C.nickel,14);}
  block(-4.50,-.42,.68,.63);
  // A wheel rim, spare speaker, fuse board and surface-mounted service runs.
  ring([-4.83,.49,-1.23],Y,Z,.39,.057,C.tar,26);ring([-4.78,.49,-1.23],Y,Z,.27,.023,C.nickel,24);
  for(let i=0;i<8;i++){const a=i*TAU/8;rod([-4.77,.49,-1.23],[-4.77,.49+.26*Math.cos(a),-1.23+.26*Math.sin(a)],.008,C.steel);}
  box(-4.84,.96,-1.39,.13,.89,.67,C.blue);for(let k=0;k<6;k++)box(-4.756,1.06+k*.105,-1.39,.025,.044,.45,C.tar);
  for(let k=0;k<3;k++){
    const y=2.51-k*.097;wire([[-4.88,y,-1.18],[-4.88,y,-2.42],[-4.77,y,-2.53],[-.04,y,-2.53],[.17,y-.18,-2.53],[.17,1.72,-2.53]],.023+k*.003,k===1?C.oxide:C.steel);
  }
  for(const x of [-4.53,-3.62,-2.69,-1.05,-.14])box(x,2.26,-2.487,.052,.32,.065,C.nickel);
  for(let k=0;k<3;k++)wire([[-3.61,2.63,-2.48],[-3.16,2.46,-2.36],[-2.62,2.41-k*.044,-2.33],[-1.94,2.53,-2.42],[-1.75,2.68,-2.51]],.012,k===1?C.oxide:C.tar);
  for(const x of [-3.77,-.48]){box(x,.22,-2.52,.27,.39,.09,C.steel);for(let k=0;k<3;k++)box(x-.081+k*.08,.38,-2.459,.041,.093,.036,C.ink);}
  for(let k=0;k<3;k++)ring([-3.72,.032+k*.019,-.59],X,Z,.25+.026*k,.021,k===1?C.oxide:C.tar,26);
  wire([[-3.46,.032,-.49],[-3.16,.028,-.38],[-3.04,.03,-.47],[-3.04,.034,-.72],[-2.85,.032,-.78]],.018,C.tar);
  // Steel drain and a replaced plate, stepped across when coming in from the rain.
  box(-2.85,.006,1.06,.73,.016,.39,C.tar);
  for(let j=0;j<10;j++)box(-3.16+j*.069,.023,1.06,.028,.011,.33,C.steel);
  box(-.23,.003,.81,.58,.017,.74,C.blue,'paint',.03);
  for(const x of [-.46,0])for(const z of [.49,1.13])post(x,.025,z,.023,.01,C.brass,.023,7);
  // Pasted service tickets with torn corners, layered over a tide mark.
  function flyer(x,y,z,w,h,paper,ink){
    face([x-w/2,y,z],[x+w/2,y+.018,z],[x+w*.47,y+h,z],[x-w*.50,y+h-.012,z],paper,'box',.035);
    box(x,y+h*.72,z+.006,w*.73,h*.108,.009,ink);
    for(let j=0;j<3;j++)box(x-w*.04,y+h*(.20+.126*j),z+.008,w*(.57-.08*(j%2)),h*.030,.009,ink);
    box(x-w*.29,y+h-.023,z+.009,w*.17,.033,.012,C.tape);
  }
  flyer(-3.39,1.22,-2.566,.28,.45,C.ochre,C.ink);flyer(-3.57,1.11,-2.553,.27,.34,C.linen,C.red);
  // The rented room has a patched-up kitchenette, a narrow iron cot and a
  // laundry line over the foot. The same cable goes back to the shop fuse box.
  const y=.12;
  box(3.96,.30,-2.95,1.14,.24,2.00,C.wood,'wood',.044);block(3.96,-2.95,1.23,2.10);
  for(const x of [3.43,4.49])for(const z of [-3.95,-1.95]){
    post(x,y,z,.041,z<-3?.89:.49,C.oxide);post(x,z<-3?.99:.60,z,.055,.034,C.brass);
  }
  for(const h of [.62,.82])rod([3.43,h,-3.95],[4.49,h,-3.95],.023,C.steel);
  box(3.96,.54,-2.94,1.11,.17,1.99,C.linen,'cloth',.032);
  // The rumpled quilt has an irregular foot and hangs over both sides.
  const quilt=(u,v)=>{
    const side=Math.max(0,(Math.abs(u-.5)-.397)/.103);
    return [3.96+(u-.5)*1.29,.746-.211*side+.032*Math.sin(v*12+u*7)+.023*Math.sin(u*22+v*9),
      -3.27+v*1.37+.043*Math.sin(8*u+v)];
  };
  for(let j=0;j<13;j++)for(let k=0;k<14;k++){
    const u=k/14,v=j/13,U=(k+1)/14,V=(j+1)/13;
    const c=j===2||j===8?0xb08d76:k%5===2?(j%4===0?0xb28977:0x846878):j%4===0?0x877b81:0x625b72;
    face(quilt(u,v),quilt(u,V),quilt(U,V),quilt(U,v),c,'cloth',.028);
  }
  box(3.95,.711,-3.66,.88,.13,.39,C.linen,'cloth',.035);
  box(3.98,.849,-3.70,.53,.013,.074,0xbbaa97,'cloth');
  // Futon repair patches and hand stitches follow the folds.
  const patch=[[.22,.50],[.49,.50],[.49,.69],[.22,.69]].map(([u,v])=>add(quilt(u,v),Y,.012));
  face(...patch,0xaa8076,'cloth',.021);
  for(let k=0;k<5;k++){const u=.235+k*.048;wire([add(quilt(u,.51),Y,.017),add(quilt(u+.024,.51),Y,.018)],.004,C.linen);}
  box(4.15,.13,-1.38,.68,.58,.62,C.wood,'wood',.036);block(4.15,-1.38,.71,.64);
  for(const h of [.22,.45]){box(4.15,h,-1.062,.58,.16,.033,C.blue);box(4.15,h+.066,-1.037,.14,.027,.034,C.nickel);}
  post(4.24,.71,-1.46,.13,.043,C.brass);post(4.24,.75,-1.46,.024,.50,C.oxide);
  post(4.24,1.24,-1.46,.223,.275,0xd09c6b,.105,18,'cloth');post(4.24,1.236,-1.46,.187,.013,C.amber,.187,18,'lit');
  for(let j=0;j<3;j++)box(3.99,.712+j*.037,-1.28,.31,.035,.24,[C.plum,C.ochre,C.linen][j],'box');
  // Kitchen below the buzzing strip light: chipped square tiles, mismatched
  // doors, a pressed sink, faucet, kettle, and single hotplate.
  for(let j=0;j<4;j++)for(let k=0;k<6;k++)box(1.07+k*.218,.90+j*.191,-4.184,.208,.181,.041,pick([0xa9b4a0,0x99a59c,0x839a95]),'paint',.028);
  box(1.62,y,-3.78,1.44,.77,.65,C.jade);block(1.62,-3.78,1.45,.68);
  for(const [x,col] of [[1.27,C.blue],[1.97,0x899379]]){
    box(x,.19,-3.442,.65,.62,.040,col,'paint',.035);box(x+.19,.67,-3.408,.131,.027,.034,C.nickel);
  }
  box(1.62,.89,-3.76,1.52,.091,.76,C.nickel,'paint',.035);
  box(1.29,.982,-3.75,.52,.016,.39,C.ink);box(1.29,.999,-3.75,.39,.013,.27,C.steel);
  wire([[1.29,.99,-4.00],[1.29,1.26,-4.00],[1.29,1.34,-3.94],[1.29,1.34,-3.82],[1.29,1.27,-3.79]],.025,C.nickel);
  post(1.99,.983,-3.76,.213,.028,C.tar);ring([1.99,1.014,-3.76],X,Z,.151,.010,C.oxide,18);
  post(2.00,1.03,-3.78,.135,.16,C.cream,.166,14);post(2.00,1.19,-3.78,.168,.068,C.cream,.098,14);
  post(2.00,1.26,-3.78,.093,.021,C.tar);ring([2,1.30,-3.78],X,Y,.101,.017,C.tar,16);
  rod([1.88,1.13,-3.78],[1.77,1.22,-3.78],.053,C.nickel,.022);
  box(1.69,2.23,-4.116,1.27,.081,.19,C.ink);box(1.69,2.22,-4.015,1.05,.035,.044,0xc8e5cb,'lit');
  box(1.70,1.88,-4.094,1.36,.063,.28,C.wood,'wood');
  for(let k=0;k<4;k++)can(1.18+k*.236,1.945,-4.058,.65+.09*(k%3),[C.red,C.ochre,C.blue,C.cream][k]);
  for(const x of [1.14,2.17])wire([[x,1.69,-4.165],[x,1.87,-3.975],[x,1.87,-4.165]],.018,C.steel);
  box(1.41,y,-2.54,.54,.63,.54,C.cream,'paint',.033);block(1.41,-2.54,.54,.53);
  box(1.41,.22,-2.257,.43,.43,.026,C.blue);box(1.42,.48,-2.237,.31,.048,.033,C.nickel);
  box(1.40,.75,-2.54,.56,.047,.55,C.cream);
  // A sagging cord holds a shirt, a towel and a pair of socks, all clipped at the top.
  wire([[.89,2.47,-3.09],[1.35,2.34,-2.92],[1.98,2.28,-2.76],[2.64,2.32,-2.71],[3.15,2.46,-2.67]],.012,C.tar);
  function garment(x,top,z,w,h,c,shirt=false){
    const grid=(u,v)=>[x+(u-.5)*w+(v-.5)*.035,top-v*h+.014*Math.cos(u*Math.PI*3)*v,
      z+.054*Math.sin(u*13+v*2)+.03*v];
    for(let i=0;i<8;i++)for(let j=0;j<4;j++){
      const sleeve=i<2||i>5;if(shirt&&sleeve&&j>0)continue;
      face(grid(i/8,(j+1)/4),grid((i+1)/8,(j+1)/4),grid((i+1)/8,j/4),grid(i/8,j/4),j===3&&c===C.denim?C.cream:c,'cloth',.030);
    }
    for(const a of [-1,1])box(x+a*w*.23,top-.038,z+.011,.028,.083,.025,C.wood);
  }
  garment(1.34,2.35,-2.93,.57,.56,C.denim,true);garment(1.94,2.29,-2.78,.37,.50,C.oxide);
  for(const x of [2.29,2.44])garment(x,2.31,-2.73,.075,.23,C.linen);
  // The futon rug is sun-faded and patched; the battered low table holds dinner.
  box(2.91,.124,-.54,1.46,.022,2.05,0x947466,'cloth',.027);
  for(const x of [2.24,3.58])box(x,.148,-.54,.047,.008,1.99,C.denim,'cloth');
  for(const z of [-1.49,.40])box(2.91,.147,z,1.36,.009,.044,C.ochre,'cloth');
  box(3.75,.485,.19,1.16,.094,.66,C.wood,'wood',.025);block(3.75,.19,1.15,.65);
  for(const x of [3.25,4.25])for(const z of [-.05,.44])box(x,.12,z,.072,.37,.070,C.oxide);
  const bowl=[3.87,.582,.15];post(...bowl,.094,.16,C.linen,.167,18);post(3.87,.741,.15,.149,.007,C.wood);
  for(let k=0;k<6;k++){const x=3.79+.031*k;wire([[x,.753,.09],[x+.025,.76,.11],[x-.006,.758,.16],[x+.010,.76,.19]],.007,C.ochre);}
  for(const z of [-.030,.013])rod([3.77,.77,.27+z],[4.08,.79,-.011+z],.008,C.wood,.005,5);
  can(3.37,.583,.13,.77,C.red);
  for(let k=0;k<3;k++)box(4.02+k*.016,.58+k*.009,.35,.26,.008,.17,k===2?C.plum:C.linen,'box');
  // Boots and a slumped duffel tuck beneath the low table.
  for(const x of [3.36,3.54]){box(x,y,-.06,.12,.11,.25,C.tar);post(x,.22,-.11,.062,.11,C.oxide,.073,8);}
  // Stacked magazines, a paint tin, a pedal bin and flaking posters near the landing.
  for(let j=0;j<5;j++)box(1.27+j*.014,y+j*.054,.56-j*.017,.62,.051,.40,[C.blue,C.plum,C.linen,C.red,C.ochre][j],'box');
  can(1.72,y,.49,1.19,C.jade);block(1.47,.49,.84,.50);
  flyer(4.30,1.59,-4.207,.33,.50,C.denim,C.linen);flyer(4.54,1.48,-4.198,.26,.41,C.linen,C.plum);
  // A heat exchanger on the outside return is visible through the cutaway.
  for(const z of [-3.22,-2.87,-2.52]){box(4.74,1.33,z,.08,.54,.26,C.steel);
    for(let k=0;k<4;k++)box(4.694,1.40+k*.083,z,.022,.028,.21,C.tar);}
  // A low wheeled parts trolley sits just to the right of the door. A drawer
  // is pulled out, with a disassembled tape deck and a trail of colored leads.
  const tx=-.05,tz=1.91;
  for(const a of [-1,1])for(const b of [-1,1]){
    const x=tx+a*.44,z=tz+b*.29;rod([x-.045,.096,z],[x+.045,.096,z],.082,C.tar,.082,12);
    box(x,.13,z,.070,.11,.068,C.steel);
  }
  box(tx,.22,tz,1.07,.68,.74,0x98554e,'paint',.038);block(tx,tz,1.08,.84);
  for(let k=0;k<3;k++){
    const z=tz+.37+(k===1?.17:0);box(tx,.26+.195*k,z,.94,.151,.07,C.red);
    box(tx,.33+.195*k,z+.045,.35,.032,.039,C.nickel);
    box(tx-.35,.314+.195*k,z+.045,.102,.059,.013,C.cream);
  }
  box(tx,.444,tz+.43,.91,.028,.24,C.tar);
  for(const x of [tx-.43,tx+.43])box(x,.445,tz+.46,.025,.13,.20,C.steel);
  for(let j=0;j<7;j++)box(tx-.32+j*.098,.473,tz+.46,.047,.066,.111,j%3?C.nickel:C.oxide);
  box(tx,.90,tz,1.13,.062,.80,C.ink);
  box(tx-.12,.966,tz,.65,.032,.48,C.nickel);pcb(tx-.14,1.001,tz,.46,.31);
  for(const x of [tx-.42,tx+.18])box(x,.99,tz,.027,.11,.46,C.steel);
  for(let j=0;j<3;j++)wire([[tx+.07,1.054,tz+j*.041],[tx+.22,1.11,tz+.12+j*.03],[tx+.37,.99,tz+.29],[tx+.44,.94-j*.025,tz+.43],[tx+.42,.77-j*.039,tz+.43]],.009,[C.red,C.ochre,C.blue][j]);
  can(tx+.39,.966,tz-.15,.67,C.ochre);
  // A discarded loudspeaker leans against the left wall. The torn dust cap,
  // separate woofer surround, and mounting screws show what was stripped out.
  const sx=-4.46,sz=-1.72;
  box(sx,.025,sz,.57,.87,.48,0x645347,'wood',.032);block(sx,sz,.57,.48);
  box(sx,.055,sz+.251,.52,.81,.032,C.tar);
  for(const [cy,rad] of [[.35,.20],[.69,.084]]){
    rod([sx,cy,sz+.274],[sx,cy,sz+.298],rad,C.steel,rad,22);
    rod([sx,cy,sz+.297],[sx,cy,sz+.309],rad*.84,C.ink,rad*.60,22);
    ring([sx,cy,sz+.315],X,Y,rad*.75,.012,C.tar,22);ring([sx,cy,sz+.317],X,Y,rad*.33,.009,C.nickel,16);
    for(const i of [-1,1])for(const j of [-1,1])box(sx+i*rad*.74,cy+j*rad*.74,sz+.307,.022,.022,.011,C.nickel);
  }
  // Tins and transformer windings on a shallow, sagging wall shelf.
  box(-3.97,1.47,-2.43,1.31,.072,.32,C.wood,'wood',.032);
  for(const x of [-4.48,-3.46])wire([[x,1.23,-2.56],[x,1.47,-2.30],[x,1.47,-2.56]],.019,C.oxide);
  for(let j=0;j<3;j++)can(-4.43+j*.171,1.55,-2.41,.63,[C.red,C.cream,C.ochre][j]);
  for(let j=0;j<2;j++){
    const x=-3.87+.205*j;box(x,1.55,-2.42,.14,.14,.16,C.tar);
    for(let k=0;k<4;k++)ring([x-.045+k*.029,1.64,-2.42],Y,Z,.083,.012,C.oxide,12);
  }
  // Paper rolled around a bundle of salvaged tubes and loose tools in the crate.
  for(let j=0;j<5;j++){
    const x=-4.60+(j%3)*.078,y=.12+(j%2)*.084;
    rod([x,y,1.48],[x+.10,y+.27,1.61],.037,j%2?C.nickel:C.oxide,.036,9);
  }
  const looseSheets=[[-3.30,1.35,.38,.21],[-3.17,1.30,.22,.16],[.25,-.77,.24,.15],[2.02,.18,.19,.15]];
  for(const [x,z,w,d] of looseSheets){
    const y=land(x,z)+.016;
    face([x-w/2,y,z],[x+w/2,y+.006,z+d*.23],[x+w*.46,y,z+d],[x-w*.57,y+.016,z+d*.84],C.linen,'box',.023);
    for(let k=0;k<3;k++)wire([[x-w*.29,y+.014,z+d*(.30+.15*k)],[x+w*(.17+.049*k),y+.015,z+d*(.39+.15*k)]],.0035,C.blue,undefined,4);
  }
  // Heater and drainpipes along the partition. The stopcock is reachable
  // from the kitchenette, and the patched elbow has left a stain on the wall.
  box(.834,1.08,-2.47,.16,.85,.61,C.cream,'paint',.030);
  for(let k=0;k<6;k++)box(.923,1.18+k*.083,-2.47,.021,.030,.43,C.steel);
  for(const z of [-2.64,-2.34]){
    wire([[.86,1.08,z],[.88,.67,z],[.99,.56,z],[1.11,.56,z],[1.16,.50,z],[1.16,.19,z]],.031,C.oxide);
    ring([1.15,.40,z],X,Z,.041,.010,C.nickel,12);
  }
  ring([1.00,.72,-2.34],Y,Z,.094,.014,C.red,16);
  // Books, an improvised cassette stereo and a basket of laundry beside the cot.
  box(4.48,1.54,-2.71,.49,.067,1.12,C.wood,'wood',.035);
  for(let j=0;j<6;j++){const z=-3.12+j*.109,h=.19+(j%3)*.055;
    box(4.48,1.607,z,.29,h,.079,[C.red,C.denim,C.plum,C.ochre,C.jade,C.linen][j]);box(4.325,1.64+h*.4,z,.016,.016,.067,C.linen);}
  box(4.48,1.607,-2.33,.29,.19,.24,C.ink);box(4.322,1.66,-2.33,.012,.068,.18,C.steel);
  const bx=2.00,bz=-1.92;box(bx,.13,bz,.51,.034,.49,C.wood);
  for(const sign of [-1,1])for(let k=0;k<5;k++){
    box(bx,.17+k*.066,bz+sign*.22,.51,.036,.030,C.ochre);box(bx+sign*.246,.17+k*.066,bz,.029,.036,.46,C.wood);
  }
  for(let j=0;j<5;j++){
    const zz=bz-.15+j*.075,x=bx-.04+.035*Math.sin(j*3);
    face([x-.18,.41,zz],[x+.18,.43,zz],[x+.17,.50+j%2*.04,zz+.08],[x-.14,.47,zz+.09],j%2?C.denim:C.linen,'cloth',.022);
  }
  block(bx,bz,.51,.48);
  // Unfinished dinner has accumulated cans and takeout cartons below the sill.
  carton(4.31,y,.71,.42,.25,.33,false);
  for(let j=0;j<3;j++)can(4.20+j*.113,y+.057,.71+(j%2)*.046,.61,[C.red,C.jade,C.ochre][j]);
  // Fabric tape crosses the seam of the old mat; two frayed edges have lost threads.
  for(const z of [-1.52,.44])for(let k=0;k<16;k++){const x=2.28+k*.085;
    rod([x,.143,z],[x+.012*Math.sin(k),.132,z+(z<0?-.068:.068)*(k%3?.76:1)],.006,C.linen,.004,4);}
  // Chipped plaster stops at the old brick skin. A torn piece of wall covering
  // hangs above the terminal; both have thickness in the cutaway.
  const patchBrick=(x,y,z,w,h)=>{
    const at=(u,v)=>[x+w*u,y+h*v,z];
    const outline=[[0,.21],[.12,.09],[.31,.14],[.39,0],[.76,.04],[.80,.20],[.98,.27],[.91,.58],[1,.77],[.80,.89],[.58,.85],[.46,1],[.26,.89],[.27,.73],[.04,.67]];
    for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];face(at(.50,.50),at(...a),at(...b),at(.50,.50),0x89776a,'plaster',.045);}
    for(let row=0;row<3;row++){const span=row===1?4:3;
      for(let k=0;k<span;k++){const u=.15+k*(.70/span)+(row===1?0:.035),v=.21+.192*row;
        face(add(at(u,v),Z,.007),add(at(u+.70/span-.025,v+.008),Z,.008),add(at(u+.70/span-.036,v+.15),Z,.007),add(at(u+.013,v+.16),Z,.008),
          pick([0x975f50,0xa87762,0x815f53]),'plaster',.03);}
    }
  };
  patchBrick(-3.33,1.96,-2.590,.79,.60);
  patchBrick(1.17,1.04,-4.203,.41,.66);
  // Scraps of insulating tape and tire marks across the stained shop tiles.
  for(const [x,z,turn] of [[-3.44,.06,.3],[-2.72,.15,1.2],[-.42,1.20,-.48]]){
    const uv=(u,v)=>[x+u*Math.cos(turn)-v*Math.sin(turn),.010,z+u*Math.sin(turn)+v*Math.cos(turn)];
    face(uv(-.063,-.021),uv(.065,-.020),uv(.085,.032),uv(-.048,.026),C.tar,'paint',.016);
  }
  for(const [x,z,rx,rz] of [[-3.65,-1.10,.26,.105],[-4.38,.41,.20,.11],[-.21,1.22,.22,.091],[-1.02,-1.29,.17,.09]]){
    const points=[];for(let k=0;k<13;k++){
      const a=k*TAU/13,r=.79+.21*rand();points.push([x+rx*Math.cos(a)*r,.008,z+rz*Math.sin(a)*r]);}
    for(let k=0;k<13;k++)face([x,.008,z],points[k],points[(k+1)%13],[x,.008,z],0x555e59,'floor',.031);
  }
  // A battered tabletop fan was wired to the rack. Its cage and folded blades
  // remain readable even when viewed from the rear.
  const fx=.116,fz=-1.985;
  box(fx+.18,2.115,fz,.24,.306,.23,C.blue);
  box(fx+.18,2.42,fz,.125,.109,.15,C.steel);
  rod([fx+.18,2.48,fz],[fx+.18,2.60,fz],.027,C.nickel);
  const hub=[fx+.18,2.67,fz+.045];
  for(let k=0;k<4;k++){
    const a=k*TAU/4,polar=(r,b,d)=>[hub[0]+r*Math.cos(b),hub[1]+r*Math.sin(b),hub[2]+d];
    face(polar(.026,a,0),polar(.129,a+.15,.010),polar(.15,a+.73,-.014),polar(.049,a+.87,-.019),C.jade);
  }
  for(const r of [.070,.111,.169])ring(add(hub,Z,.023),X,Y,r,.006,C.nickel,23);
  for(let k=0;k<7;k++){const a=TAU*k/7;rod(add(hub,Z,.034),[hub[0]+.166*Math.cos(a),hub[1]+.166*Math.sin(a),hub[2]+.024],.004,C.steel,undefined,4);}
  // The lane's utility map is pinned to a patched insulation board.
  box(-.30,1.52,-2.586,.53,.64,.041,C.ink);
  box(-.30,1.55,-2.559,.47,.56,.012,C.tape,'box',.023);
  for(const [pts,col] of [[[[0,.30],[.12,.30],[.20,.21],[.20,.09],[.35,.09]],C.red],[[[.02,.12],[.11,.12],[.18,.20],[.39,.20]],C.blue]]){
    const positions=pts.map(([a,b])=>[-.50+a,1.65+b,-2.545]);wire(positions,.008,col);for(const q of positions.slice(1,-1))ring(add(q,Z,.005),X,Y,.016,.004,C.cream,9);
  }
  const mesh=geo.finish({count:pigments.length},pigments);pigments.length=0;
  const frame=[[-5.08,-.45,2.78],[-5.08,2.83,-2.78],[.72,2.82,-2.78],[.72,2.79,-4.39],[4.95,2.80,-4.39],
    [4.95,-.45,1.03],[.74,-.45,2.78],[-1.09,-.44,3.45],[-2.51,-.44,3.45],[-5,2.48,-.08]];
  const motes=[];for(const w of windows)for(let i=0;i<9;i++){const t=.2+rand()*1.9;motes.push([w.x+w.sx*t+(rand()-.5)*w.w*1.37,w.y+w.sy*t+(rand()-.5)*w.h,w.z+t,.004,w.color.map(c=>c*130),true]);}
  const trace=Array.from({length:12},(_,i)=>[0,0,0,.012+(i===0?.007:0),[111,230,145].map(c=>c*Math.exp(-i/4.3)),false]);
  motes.push(...trace);
  function animate(time){
    for(let i=0;i<trace.length;i++){
      const t=(1+(time*.46+.22-i*.009)%1)%1,p=sweepAt(t);
      trace[i][0]=p[0];trace[i][1]=p[1];trace[i][2]=p[2]+.005;
    }
  }
  return {mesh,frame,windows,motes,animate,light:lighting,actorLighting,home:{target:[-.09,1.12,-.50],yaw:.22,pitch:.61,zoom:1},
    exit:[-1.8,.49,3.12],exitGate:{x:-1.80,z:3.12,halfWidth:.58},
    walkway:{land,edge,solids,walkingSurfaces:[],steppingRocks:[],barriers:[],waterline:-10,spawn:[-1.80,2.49]}};
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
