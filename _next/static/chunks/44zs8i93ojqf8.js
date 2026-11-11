(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,4399,e=>{"use strict";var t=e.i(43476),r=e.i(31067),i=e.i(71645),a=e.i(90072),v=e.i(38408),o=e.i(98903);let n={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},u={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},s=i.forwardRef(({scale:e=10,frames:t=1/0,opacity:s=1,width:f=1,height:l=1,blur:c=1,near:m=0,far:x=10,resolution:h=512,smooth:p=!0,color:d="#000000",depthWrite:g=!1,renderOrder:y,...D},U)=>{let w,M,j=i.useRef(null),S=(0,v.f)(e=>e.scene),b=(0,v.f)(e=>e.gl),T=i.useRef(null);f*=Array.isArray(e)?e[0]:e||1,l*=Array.isArray(e)?e[1]:e||1;let[C,R,E,P,z,k,A]=i.useMemo(()=>{let e=new a.qL(h,h),t=new a.qL(h,h);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let r=new a.CQ(f,l).rotateX(Math.PI/2),i=new a.kE(r),v=new a.QQ;v.depthTest=v.depthWrite=!1,v.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new a.Es(d)}},e.fragmentShader=e.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),e.fragmentShader=e.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};let o=new a.Zg(n),s=new a.Zg(u);return s.depthTest=o.depthTest=!1,[e,r,v,i,o,s,t]},[h,f,l,e,d]),B=e=>{P.visible=!0,P.material=z,z.uniforms.tDiffuse.value=C.texture,z.uniforms.h.value=e/256,b.setRenderTarget(A),b.render(P,T.current),P.material=k,k.uniforms.tDiffuse.value=A.texture,k.uniforms.v.value=e/256,b.setRenderTarget(C),b.render(P,T.current),P.visible=!1},L=0;return(0,o.f)(()=>{T.current&&(1/0===t||L<t)&&(L++,w=S.background,M=S.overrideMaterial,j.current.visible=!1,S.background=null,S.overrideMaterial=E,b.setRenderTarget(C),b.render(S,T.current),B(c),p&&B(.4*c),b.setRenderTarget(null),j.current.visible=!0,S.overrideMaterial=M,S.background=w)}),i.useImperativeHandle(U,()=>j.current,[]),i.createElement("group",(0,r.f)({"rotation-x":Math.PI/2},D,{ref:j}),i.createElement("mesh",{renderOrder:y,geometry:R,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},i.createElement("meshBasicMaterial",{transparent:!0,map:C.texture,opacity:s,depthWrite:g})),i.createElement("orthographicCamera",{ref:T,args:[-f/2,f/2,l/2,-l/2,m,x]}))});var f=e.i(61786),l=e.i(75056),c=e.i(28593),m=e.i(1624),x=e.i(79001);let h={design:{yaw:-.58,pitch:-.1,zoom:1,x:0,y:0,flap:0,airflow:0},eficiencia:{yaw:0,pitch:.04,zoom:.96,x:0,y:0,flap:.3,airflow:.4},inverter:{yaw:.55,pitch:-.16,zoom:1,x:0,y:0,flap:.55,airflow:.7},ar:{yaw:-.3,pitch:-.62,zoom:1.02,x:0,y:.1,flap:1,airflow:1.35},controle:{yaw:-.5,pitch:-.04,zoom:1.75,x:-.52,y:-.08,flap:.3,airflow:.3},silencio:{yaw:.22,pitch:.42,zoom:1,x:0,y:-.04,flap:.12,airflow:.16}};function p({view:e,light:r,lite:n,temperature:u}){let f=(0,i.useRef)(null),l=(0,v.f)(e=>e.viewport),d=h[e],g=Math.min(.6*l.width/.92,.92*l.height/.5);return(0,o.f)((e,t)=>{let r=f.current;if(!r)return;let i=1-Math.exp(-(3.4*t)),v=e.clock.elapsedTime,o=c.t;o.dragging||(o.yaw*=1-Math.min(1,.35*t),o.pitch*=1-Math.min(1,.6*t));let n=o.dragging?0:.06*Math.sin(.42*v);r.rotation.y+=(d.yaw+o.yaw+n-r.rotation.y)*i,r.rotation.x+=(a.rB.clamp(d.pitch+o.pitch,-.9,.75)-r.rotation.x)*i;let u=g*d.zoom;r.scale.setScalar(r.scale.x+(u-r.scale.x)*i),r.position.x+=(.92*d.x*u-r.position.x)*i,r.position.y+=(.06*l.height+d.y*u+.025*Math.sin(.8*v)-r.position.y)*i}),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(m.StudioEnvironment,{light:r}),(0,t.jsx)("ambientLight",{intensity:r?.8:.25,color:r?"#ffffff":"#9fc3ea"}),(0,t.jsx)("directionalLight",{position:[-3,4.5,4],intensity:r?1.5:2}),(0,t.jsx)("directionalLight",{position:[4,-1,2.5],intensity:r?.25:.34,color:"#8fb4e0"}),(0,t.jsx)("group",{ref:f,rotation:[0,-1.4,0],scale:.8*g,children:(0,t.jsx)(x.f,{flap:d.flap,airflow:d.airflow,temperature:u,light:r})}),(0,t.jsx)(s,{position:[0,-(.36*l.height),0],scale:1.1*l.width,far:l.height,blur:2.6,opacity:r?.34:.62,resolution:n?256:512,color:r?"#1a3f75":"#000010"})]})}e.s(["POSES",0,h,"default",0,function({view:e,light:r,active:a,lite:v,temperature:o}){let[n,u]=(0,i.useState)(v?1.4:1.75);return(0,t.jsxs)(l.f,{frameloop:a?"always":"never",dpr:[1,n],camera:{fov:28,position:[0,0,4.4],near:.1,far:40},gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},style:{pointerEvents:"none"},"aria-hidden":!0,children:[(0,t.jsx)(f.f,{onDecline:()=>u(1),flipflops:2}),(0,t.jsx)(i.Suspense,{fallback:null,children:(0,t.jsx)(p,{view:e,light:r,lite:v,temperature:o})})]})}],4399)},22207,function(e){e.n(e.i(4399))}]);