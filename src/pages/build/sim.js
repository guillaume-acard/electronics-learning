// ===== Build lab: circuit simulator (no DOM). =====
// Nodal analysis, solved by Gaussian elimination at every time step; Newton–Raphson for diodes, LEDs and
// transistors; backward-Euler capacitors; a motor with back-EMF; behavioural chips (NE555, CD4017, op-amps).
// Sources are Norton equivalents (V/R current + 1/R conductance), so the matrix only has node voltages.
// Usage: const c=new Circuit(); const a=c.node(), ...; c.R(a,b,470); ... c.step(dt); then el.i, el.v, c.v(node).
// Node 0 is ground (0 V).
const VT=0.02585, GMIN=1e-9;

class Circuit{
  constructor(){this.n=1;this.els=[];this.x=new Float64Array(1);this.t=0;}
  node(){return this.n++;}
  v(k){return k>0?this.x[k]||0:0;}
  add(e){e.i=0;e.v=0;e.p=0;this.els.push(e);return e;}
  // ---- linear parts
  R(a,b,r){return this.add({t:'R',a,b,g:1/Math.max(r,1e-6)});}
  Vs(p,m,V,r){return this.add({t:'V',a:p,b:m,V,g:1/r});}                         // battery: V with internal resistance r
  Vac(p,m,amp,f,r){return this.add({t:'V',a:p,b:m,V:0,amp,f,g:1/r});}             // audio signal: amp·sin(2πft)
  SW(a,b,on){return this.add({t:'SW',a,b,on,g:1/0.05});}                          // switch / button contact
  C(a,b,C,vmax){return this.add({t:'C',a,b,C,vp:0});}                               // vp: voltage at the previous step
  // ---- non-linear parts
  D(a,b,Is,n){return this.add({t:'D',a,b,Is,nv:n*VT,vd:0});}                      // diode / LED: anode a, cathode b
  Q(c,b,e,Is,bf,br){return this.add({t:'Q',c,b,e,Is,bf,br,vbe:0,vbc:0});}           // NPN (Ebers–Moll)
  Motor(a,b,R,k,J,f){return this.add({t:'M',a,b,g:1/R,k,J,f,w:0});}                 // DC motor: R + back-EMF k·ω
  T555(p1,p2,p3,p4,p5,p6,p7,p8){const x=this.node();                                // internal 1/3 VCC node
    const e=this.add({t:'555',pins:[0,p1,p2,p3,p4,p5,p6,p7,p8],x,q:0,out:0});
    this.R(p8,p5,5000);this.R(p5,x,5000);this.R(x,p1,5000);this.R(p8,p1,1500);     // divider + supply current
    return e;}
  // amplifier: output o driven towards a target, inside the supply (lo, hi) minus dlo/dhi.
  //  mode 'opamp': an integrator stepped from the previous step's inputs: target += (v+ − v−) (fast, stable with any feedback)
  //  mode 'fixed': target = middle of the supply + G·(v+ − v−) (LM386: fixed gain, output biased at half the supply)
  Amp(ip,im,o,lo,hi,{mode='opamp',G=20,ro=50,dlo=0.02,dhi=1.5}={}){return this.add({t:'AMP',ip,im,o,lo,hi,mode,G,go:1/ro,dlo,dhi,vt:0,vo:0,io:0,a:o,b:lo});}
  // CD4017 decade counter: pins[1..16] (real pin numbers), outputs pull to VDD or VSS through ro
  C4017(pins){const e=this.add({t:'4017',pins,count:0,clk:0,vdd:0});this.R(pins[16],pins[8],1e6);return e;}

  // ---- one time step (dt in seconds). Returns false if the solver did not converge.
  step(dt){
    const N=this.n;if(this.x.length<N){const nx=new Float64Array(N);nx.set(this.x);this.x=nx;}
    // NE555 logic from the previous step's voltages
    for(const e of this.els)if(e.t==='555'){const [_,p1,p2,p3,p4,p5,p6]=e.pins,g=this.v(p1),vcc=this.v(e.pins[8])-g;
      if(this.v(p4)-g<0.7||vcc<3)e.q=0;else if(this.v(p2)<this.v(e.x))e.q=1;else if(this.v(p6)>this.v(p5))e.q=0;
      e.vcc=vcc;}
    for(const e of this.els){
      if(e.t==='V'&&e.f)e.V=e.amp*Math.sin(2*Math.PI*e.f*this.t);
      if(e.t==='AMP'&&e.mode==='opamp'){const vl=this.v(e.lo),lo=vl+e.dlo,hi=Math.max(lo,this.v(e.hi)-e.dhi);
        e.vt=Math.min(hi,Math.max(lo,e.vt+Math.min(1,dt/2e-4)*(this.v(e.ip)-this.v(e.im))));}
      if(e.t==='4017'){const P=e.pins,g=this.v(P[8]),vdd=this.v(P[16])-g,hi=k=>this.v(P[k])-g>vdd/2;e.vdd=vdd;
        const clk=hi(14)?1:0;if(vdd<2.5)e.count=0;else if(hi(15))e.count=0;else if(clk&&!e.clk&&!hi(13))e.count=(e.count+1)%10;e.clk=clk;}}
    let ok=false;
    for(let it=0;it<100;it++){
      const A=Array.from({length:N},()=>new Float64Array(N)),z=new Float64Array(N),x=this.x;
      const G=(a,b,g)=>{if(a)A[a][a]+=g;if(b)A[b][b]+=g;if(a&&b){A[a][b]-=g;A[b][a]-=g;}};
      const Iin=(a,b,i)=>{if(a)z[a]-=i;if(b)z[b]+=i;};                              // current i flowing a -> b inside the part
      for(let k=1;k<N;k++)A[k][k]+=GMIN;
      let lim=false;                                                                    // a junction voltage was limited: not converged yet
      for(const e of this.els){switch(e.t){
        case 'R':G(e.a,e.b,e.g);break;
        case 'SW':if(e.on)G(e.a,e.b,e.g);break;
        case 'V':G(e.a,e.b,e.g);Iin(e.a,e.b,-e.V*e.g);break;                           // pushes V/R out of +
        case 'C':{const g=e.C/dt;G(e.a,e.b,g);Iin(e.a,e.b,-g*e.vp);break;}
        case 'M':{G(e.a,e.b,e.g);Iin(e.a,e.b,-e.g*e.k*e.w);break;}
        case 'D':{const raw=this.v(e.a)-this.v(e.b);let vd=pnlim(raw,e.vd,e.nv,e.Is);if(Math.abs(vd-raw)>1e-6)lim=true;e.vd=vd;
          const ex=Math.exp(Math.min(vd/e.nv,80)),id=e.Is*(ex-1),gd=e.Is/e.nv*ex+GMIN;G(e.a,e.b,gd);Iin(e.a,e.b,id-gd*vd);break;}
        case 'Q':{const vb=this.v(e.b);let vbe=vb-this.v(e.e),vbc=vb-this.v(e.c);
          const rbe=vbe,rbc=vbc;vbe=pnlim(vbe,e.vbe,VT,e.Is);vbc=pnlim(vbc,e.vbc,VT,e.Is);if(Math.abs(vbe-rbe)>1e-6||Math.abs(vbc-rbc)>1e-6)lim=true;e.vbe=vbe;e.vbc=vbc;
          const ef=Math.exp(Math.min(vbe/VT,80)),er=Math.exp(Math.min(vbc/VT,80)),If=e.Is*(ef-1),Ir=e.Is*(er-1),gf=e.Is/VT*ef,gr=e.Is/VT*er;
          const ic=If-Ir*(1+1/e.br),ib=If/e.bf+Ir/e.br;                               // currents INTO collector and base
          // linearise: ic = ic0 + gf·dVbe - gr(1+1/br)·dVbc ; ib = ib0 + gf/bf·dVbe + gr/br·dVbc
          const T={c:e.c,b:e.b,e:e.e};
          const stamp=(node,i0,dVbe,dVbc)=>{if(!node)return;                         // current i0 leaves `node` into the device
            // Vbe = vb - ve ; Vbc = vb - vc
            const gb=dVbe+dVbc,ge=-dVbe,gc=-dVbc;
            if(T.b)A[node][T.b]+=gb;if(T.e)A[node][T.e]+=ge;if(T.c)A[node][T.c]+=gc;
            z[node]-=i0-(dVbe*vbe+dVbc*vbc);};
          stamp(e.c,ic,gf,-gr*(1+1/e.br));stamp(e.b,ib,gf/e.bf,gr/e.br);stamp(e.e,-(ic+ib),-(gf+gf/e.bf),gr*(1+1/e.br)-gr/e.br);
          break;}
        case '555':{const [_,p1,,p3,,,,p7]=e.pins,ro=1/10;                                   // output: 10 Ω towards its target
          const vt=e.q?Math.max(0,e.vcc-1.7):0.1;G(p3,p1,ro);Iin(p3,p1,-vt*ro);
          if(!e.q)G(p7,p1,1/15);break;}
        case '4017':{const P=e.pins,go=e.vdd>2?e.vdd/4000:1/1000;                       // CMOS output: about 450 Ω at 9 V
          Q4017.forEach((pn,k)=>G(P[pn],k===e.count?P[16]:P[8],go));G(P[12],e.count<5?P[16]:P[8],go);break;}
        case 'AMP':{const vl=this.v(e.lo),vh=this.v(e.hi),lo=vl+e.dlo,hi=Math.max(lo,vh-e.dhi);let c0;const co={};
          if(e.mode==='fixed'){const base=(vl+vh)/2,u=base+e.G*(this.v(e.ip)-this.v(e.im));let reg=u>hi?1:u<lo?-1:0;if(it>30)reg=e.reg||0;else e.reg=reg;
            if(reg)c0=e.go*(reg>0?hi:lo);else{c0=e.go*base;co[e.ip]=e.go*e.G;co[e.im]=(co[e.im]||0)-e.go*e.G;}}
          else c0=e.go*Math.min(hi,Math.max(lo,e.vt));                                     // op-amp: its output target was set before the loop
          co[e.o]=(co[e.o]||0)-e.go;
          // the output current I = c0 + Σ co·v comes out of the supply pin it flows from (+ when sourcing, − when sinking)
          const from=e.io>=0?e.hi:e.lo;
          for(const [k,c] of Object.entries(co)){const n=+k;if(!n)continue;if(e.o)A[e.o][n]-=c;if(from)A[from][n]+=c;}
          if(e.o)z[e.o]+=c0;if(from)z[from]-=c0;
          const I=c0+Object.entries(co).reduce((s,[k,c])=>s+c*this.v(+k),0);if(it<20){if(Math.sign(I)!==Math.sign(e.io)&&Math.abs(I)>1e-6)lim=true;e.io=I;}
          break;}
      }}
      const nx=solve(A,z,N);if(!nx)return false;
      let d=0;for(let k=1;k<N;k++){d=Math.max(d,Math.abs(nx[k]-x[k]));}
      this.x=nx;if(d<1e-6&&it>0&&!lim){ok=true;break;}
    }
    // results: currents a -> b, voltages, powers; update capacitors and motors
    for(const e of this.els){const va=this.v(e.a),vb=this.v(e.b);
      switch(e.t){
        case 'R':e.v=va-vb;e.i=e.v*e.g;break;
        case 'SW':e.v=va-vb;e.i=e.on?e.v*e.g:0;break;
        case 'V':e.v=va-vb;e.i=(e.V-e.v)*e.g;break;                                     // current delivered out of +
        case 'C':e.v=va-vb;e.i=e.C*(e.v-e.vp)/dt;e.vp=e.v;break;
        case 'D':e.v=va-vb;e.i=e.Is*(Math.exp(Math.min(e.v/e.nv,80))-1);break;
        case 'M':e.v=va-vb;e.i=(e.v-e.k*e.w)*e.g;e.w+=dt*(e.k*e.i-e.f*e.w)/e.J;break;
        case 'Q':{const vbe=this.v(e.b)-this.v(e.e),vbc=this.v(e.b)-this.v(e.c);
          const If=e.Is*(Math.exp(Math.min(vbe/VT,80))-1),Ir=e.Is*(Math.exp(Math.min(vbc/VT,80))-1);
          e.ic=If-Ir*(1+1/e.br);e.ib=If/e.bf+Ir/e.br;e.vce=this.v(e.c)-this.v(e.e);e.i=e.ic;e.v=e.vce;break;}
        case '555':e.v=e.vcc;e.i=0;break;
        case '4017':{const P=e.pins,go=e.vdd>2?e.vdd/4000:1/1000;e.v=e.vdd;e.i=0;
          e.imax=Math.max(...[...Q4017,12].map(pn=>Math.abs(this.v(P[pn])-this.v(e.count===Q4017.indexOf(pn)||(pn===12&&e.count<5)?P[16]:P[8]))*go));break;}
        case 'AMP':{const vl=this.v(e.lo),vh=this.v(e.hi),lo=vl+e.dlo,hi=Math.max(lo,vh-e.dhi);
          const tg=e.mode==='fixed'?Math.min(hi,Math.max(lo,(vl+vh)/2+e.G*(this.v(e.ip)-this.v(e.im)))):Math.min(hi,Math.max(lo,e.vt));
          e.vo=tg;e.i=e.go*(tg-this.v(e.o));e.io=e.i;e.v=this.v(e.o)-vl;e.vs=vh-vl;
          e.pd=Math.abs(e.i)*Math.abs((e.i>=0?vh:vl)-this.v(e.o));e.pavg=(e.pavg||0)+(e.pd-(e.pavg||0))*Math.min(1,dt/0.05);break;}
      }
      e.p=Math.abs(e.v*e.i);if(e.t==='Q')e.p=Math.abs(e.ic*e.vce)+Math.abs(e.ib*(this.v(e.b)-this.v(e.e)));
    }
    this.t+=dt;return ok;
  }
}
const Q4017=[3,2,4,7,10,1,5,6,9,11];   // CD4017: the pin of output Q0 … Q9
// SPICE-style junction voltage limiting: keeps Newton steps on the exponential reasonable
function pnlim(vnew,vold,nv,Is){const vcrit=nv*Math.log(nv/(Math.SQRT2*Is));
  if(vnew>vcrit&&Math.abs(vnew-vold)>2*nv){if(vold>0){const arg=1+(vnew-vold)/nv;vnew=arg>0?vold+nv*Math.log(arg):vcrit;}else vnew=nv*Math.log(vnew/nv);}
  return vnew;}
// Gaussian elimination with partial pivoting on the reduced system (node 0 = ground removed)
function solve(A,z,N){const n=N-1;if(n<=0)return new Float64Array(N);
  const M=[];for(let i=1;i<N;i++){const r=new Float64Array(n+1);for(let j=1;j<N;j++)r[j-1]=A[i][j];r[n]=z[i];M.push(r);}
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
    if(Math.abs(M[p][c])<1e-18)return null;if(p!==c){const t=M[p];M[p]=M[c];M[c]=t;}
    const piv=M[c][c];for(let r=c+1;r<n;r++){const f=M[r][c]/piv;if(f)for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k];}}
  const x=new Float64Array(N);for(let r=n-1;r>=0;r--){let s=M[r][n];for(let k=r+1;k<n;k++)s-=M[r][k]*x[k+1];x[r+1]=s/M[r][r];}
  return x;}
// Diode/LED parameters: Is chosen so the part drops Vf at 10 mA (n = emission coefficient)
function diodeIs(vf,n,i){return (i||0.01)/Math.exp(vf/(n*VT));}
if(typeof module!=='undefined')module.exports={Circuit,diodeIs,VT,Q4017};
