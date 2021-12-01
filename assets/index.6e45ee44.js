const U=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))e(n);new MutationObserver(n=>{for(const f of n)if(f.type==="childList")for(const i of f.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&e(i)}).observe(document,{childList:!0,subtree:!0});function l(n){const f={};return n.integrity&&(f.integrity=n.integrity),n.referrerpolicy&&(f.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?f.credentials="include":n.crossorigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function e(n){if(n.ep)return;n.ep=!0;const f=l(n);fetch(n.href,f)}};U();const u={height:0,width:0};var P;(function(t){t[t.PIECE_LEFT=1]="PIECE_LEFT",t[t.PIECE_TOP=2]="PIECE_TOP",t[t.PIECE_RIGHT=3]="PIECE_RIGHT",t[t.PIECE_BOTTOM=4]="PIECE_BOTTOM"})(P||(P={}));function q(t){const o=t.getFullYear(),l=t.getMonth()+1,e=t.getDate(),n=t.getHours(),f=t.getMinutes(),i=t.getSeconds(),M=a=>a<10?`0${a}`:a;return`${o}${M(l)}${M(e)}${M(n)}${M(f)}${M(i)}`}function R(t){return document.getElementById(t)}async function G(t=0){return new Promise(o=>setTimeout(o,t))}async function K(t){return new Promise((o,l)=>{const e=new FileReader;e.onload=()=>o(e.result),e.onerror=l,e.readAsDataURL(t)})}function z(t){for(let o=0;o<t.data.length;o+=4){const l=t.data[o],e=t.data[o+1],n=t.data[o+2],f=t.data[o+3],i=(l+e+n)/3;t.data[o]=i,t.data[o+1]=i,t.data[o+2]=i,t.data[o+3]=f}return t}function J(t,o,l){const e=[0];let n=0,f=0;const i={},M=new ImageData(o,l);M.data.set(t.data);const a=M.data;for(let h=1;h<l-2;h+=1){let c=0;for(let g=1;g<o-2;g+=1){const w=h*o*4+g*4,C=w-4,b=w+4,x=w-o*4,E=w+o*4,v=E-4,L=E+4,j=E+o*4,S=(a[w]+a[C]+a[b]+a[x])/4,A=(a[E]+a[v]+a[L]+a[j])/4;Math.abs(S-A)>25&&(c+=1)}e.push(c),n+=c}f=n/e.length;for(let h=0;h<e.length;h++)e[h]>f*.7+o*.3?e[h]=1:e[h]=0;const s=[];for(let h=0;h<e.length;h++)e[h]==1&&s.push(h);for(let h=0;h<s.length;h++)for(let c=0;c<h;c++)i[s[h]-s[c]]?i[s[h]-s[c]]++:i[s[h]-s[c]]=1;let r=0,d=0;for(const h in i)i[h]>r&&parseInt(h)>10&&(r=i[h],d=parseInt(h));return d}function Q(t,o,l){const e=[];let n=0,f=0;const i={},M=new ImageData(o,l);M.data.set(t.data);const a=M.data;for(let h=20;h<o-2;h+=1){let c=0;for(let g=20;g<l;g+=1){const w=g*o*4+h*4,C=w-4,b=w+o*4,x=w-o*4,E=w+4,v=E+4,L=E-o*4,j=E+o*4,S=(a[w]+a[C]+a[b]+a[x])/4,A=(a[E]+a[v]+a[L]+a[j])/4;Math.abs(S-A)>25&&(c+=1)}e.push(c),n+=c}f=n/e.length;for(let h=0;h<e.length;h++)e[h]>f*.7+l*.3?e[h]=1:e[h]=0;const s=[];for(let h=0;h<e.length;h++)e[h]==1&&s.push(h);for(let h=0;h<s.length;h++)for(let c=0;c<h;c++)i[s[h]-s[c]]?i[s[h]-s[c]]++:i[s[h]-s[c]]=1;let r=0,d=0;for(const h in i)i[h]>r&&parseInt(h)>1&&(r=i[h],d=parseInt(h));return d}function B(t,o,l,e,n,f,i){let M=0;switch(i){case P.PIECE_LEFT:for(let a=1;a<l-2;a++){const s=a*o*4,r=a*n*4+n*4-4,d=r-o*4,h=r+o*4,c=[];c.push(Math.abs(e[r]-t[s])+Math.abs(e[r+1]-t[s+1])+Math.abs(e[r+2]-t[s+2])),c.push(Math.abs(e[d]-t[s])+Math.abs(e[d+1]-t[s+1])+Math.abs(e[d+2]-t[s+2])),c.push(Math.abs(e[h]-t[s])+Math.abs(e[h+1]-t[s+1])+Math.abs(e[h+2]-t[s+2])),M+=c[0]}break;case P.PIECE_TOP:for(let a=1;a<o-2;a++){const s=a*4,r=a*4+(f-1)*n*4,d=r-4,h=r+4,c=[];c.push(Math.abs(e[r]-t[s])+Math.abs(e[r+1]-t[s+1])+Math.abs(e[r+2]-t[s+2])),c.push(Math.abs(e[d]-t[s])+Math.abs(e[d+1]-t[s+1])+Math.abs(e[d+2]-t[s+2])),c.push(Math.abs(e[h]-t[s])+Math.abs(e[h+1]-t[s+1])+Math.abs(e[h+2]-t[s+2])),M+=c[0]}break;case P.PIECE_RIGHT:for(let a=1;a<l-2;a++){const s=a*o*4+o*4-4,r=a*n*4,d=r-n*4,h=r+n*4,c=[];c.push(Math.abs(e[r]-t[s])+Math.abs(e[r+1]-t[s+1])+Math.abs(e[r+2]-t[s+2])),c.push(Math.abs(e[d]-t[s])+Math.abs(e[d+1]-t[s+1])+Math.abs(e[d+2]-t[s+2])),c.push(Math.abs(e[h]-t[s])+Math.abs(e[h+1]-t[s+1])+Math.abs(e[h+2]-t[s+2])),M+=c[0]}break;case P.PIECE_BOTTOM:for(let a=1;a<o-2;a++){const s=a*4+(l-1)*o*4,r=a*4,d=r-4,h=r+4,c=[];c.push(Math.abs(e[r]-t[s])+Math.abs(e[r+1]-t[s+1])+Math.abs(e[r+2]-t[s+2])),c.push(Math.abs(e[d]-t[s])+Math.abs(e[d+1]-t[s+1])+Math.abs(e[d+2]-t[s+2])),c.push(Math.abs(e[h]-t[s])+Math.abs(e[h+1]-t[s+1])+Math.abs(e[h+2]-t[s+2])),M+=c[0]}break}return M}const T=document.createElement("canvas"),O=T.getContext("2d");async function V(t){const o=R("imgCanvas"),l=o.getContext("2d");return new Promise(e=>{const n=new Image;n.onload=async function(){o.width=n.width,o.height=n.height,T.width=n.width,T.height=n.height,await G(),l.drawImage(n,0,0,n.width,n.height),O.drawImage(n,0,0,n.width,n.height);let f=l.getImageData(0,0,n.width,n.height);const i=new ImageData(n.width,n.height);i.data.set(f.data),console.info("*** \u7070\u5EA6\u5316 ***"),f=z(i),console.info("*** \u8BC6\u522B\u9AD8\u5EA6 ***");const M=J(i,n.width,n.height);console.info("*** \u8BC6\u522B\u5BBD\u5EA6 ***");const a=Q(i,n.width,n.height);if(console.info("maxWidth="+a),console.info("maxHeight="+M),!(M<=1||a<=1)){o.width=n.width+5*Math.ceil(n.width/a)-5,o.height=n.height+5*Math.ceil(n.height/M)-5,await G();for(let s=0;s<Math.ceil(n.height/M);s++)for(let r=0;r<Math.ceil(n.width/a);r++){const d=r*a,h=s*M,c=r*(a+5),g=s*(M+5);let w=a,C=M;r==Math.ceil(n.width/a)-1&&n.width%a!=0&&(w=n.width%a),s==Math.ceil(n.height/M)-1&&n.height%a!=0&&(C=n.height%M),l.drawImage(n,d,h,w,C,c,g,w,C)}e({maxWidth:a,maxHeight:M})}},n.src=t})}function Z(t,o){const l=R("imgResult"),e=l.getContext("2d");l.width=T.width+Math.ceil(T.width/t)-1,l.height=T.height+Math.ceil(T.height/o)-1,setTimeout(()=>{if(l.width%t!=0)for(let a=0;a<Math.ceil(l.height/o);a++){const s=O.getImageData(Math.floor(l.width/t)*t,a*o,t,o);e.putImageData(s,Math.floor(l.width/t)*t+Math.ceil(l.width/t)-1,a*o+a)}if(l.height%o!=0)for(let a=0;a<Math.ceil(l.height/o);a++){const s=O.getImageData(a*t,Math.floor(l.height/o)*o,t,o);e.putImageData(s,a*t+a,Math.floor(l.height/o)*o+Math.ceil(l.height/o)-1)}const n=[];for(let a=0;a<Math.floor(l.height/o);a++)for(let s=0;s<Math.floor(l.width/t);s++){const r=O.getImageData(s*t,a*o,t,o);n.push(r)}const f=[],i={};console.info("\u5757\u6570\u91CF\uFF1A"+Math.floor(l.width/t)+","+Math.floor(l.height/o));const M=Math.floor(l.width/t)-(l.width%t?0:1);for(let a=M;a>=0;a--){let s=O.getImageData(a*t,Math.floor(l.height/o)*o,t,l.height%o);for(let r=Math.floor(l.height/o)-1;r>=0;r--){let d=O.getImageData(Math.floor(l.width/t)*t,r*o,l.width%t||1,o),h=l.width%t;a<Math.floor(l.width/t)-1&&(d=e.getImageData(a*t+t+a+1,r*o+r,t,o),h=t);let c=[],g=256*t*o,w=null,C=0;for(let b=0;b<n.length;b++){let x=2500;(a+1+","+r in i||a==Math.floor(l.width/t)-1)&&(x=B(n[b].data,t,o,d.data,h,o,P.PIECE_RIGHT));let E=2500;(a+","+(r+1)in i||r==Math.floor(l.height/o)-1)&&(E=B(n[b].data,t,o,s.data,t,l.height%o,P.PIECE_BOTTOM));const v=x+E;c.push([v,x,E]),g>v&&(g=v,w=n[b],C=b)}if(a==8&&r==2&&(console.info(a+","+r),console.info(c),console.info(C)),g>=5e3){c=[],g=256*t*o;for(let b=0;b<n.length;b++){let x=2500;(a+1+","+r in i||a==Math.floor(l.width/t)-1)&&(x=B(n[b].data,t,o,d.data,h,o,P.PIECE_RIGHT));let E=2500;(a+","+(r+1)in i||r==Math.floor(l.height/o)-1)&&(E=B(n[b].data,t,o,s.data,t,l.height%o,P.PIECE_BOTTOM));const v=x+E;c.push([v,x,E]),g>x&&(g=x,w=n[b],C=b),g>E&&(g=E,w=n[b],C=b)}}w&&(e.putImageData(w,a*t+a,r*o+r),n.splice(C,1),s=w),i[a+","+r]=1,f.push(g)}}console.info(f)},0)}const k=R("imgResult"),p=k.getContext("2d");function I(){if(k.width<=0||k.height<=0){alert("\u8BF7\u5148\u6267\u884C\u540E\u518D\u4FDD\u5B58\u56FE\u7247");return}const t=document.createElement("canvas"),o=t.getContext("2d");t.width=T.width,t.height=T.height;for(let f=0;f<Math.ceil(t.width/u.width);f++)for(let i=0;i<Math.ceil(t.height/u.height);i++){const M=p.getImageData(f*u.width+f,i*u.height+i,u.width,u.height);o.putImageData(M,f*u.width,i*u.height)}const l="image/jpeg",e=t.toDataURL(l),n=document.createElement("a");n.download=q(new Date)+".jpg",n.href=e,n.dataset.downloadurl=[l,n.download,n.href].join(":"),document.body.appendChild(n),n.click(),document.body.removeChild(n)}const $=R("pieceWidth");$.onchange=()=>u.width=Number($.value);const Y=R("pieceHeight");Y.onchange=()=>u.height=Number(Y.value);const N=R("imageSelect");N.onchange=async function(){const o=N.files[0],l=await K(o),{maxWidth:e,maxHeight:n}=await V(l);u.width=e,u.height=n,$.value=u.width.toString(),Y.value=u.height.toString()};const D=R("imageProcess");D.onclick=()=>Z(u.width,u.height);const X=R("imgResult"),_=X.getContext("2d");let m=-1,y=-1,F;X.onclick=function(t){const o=t.offsetX,l=t.offsetY,e=Math.floor(o/u.width),n=Math.floor(l/u.height);if(m==-1){m=e,y=n,F=_.getImageData(m*u.width+m,y*u.height+y,u.width,u.height);const f=new ImageData(u.width,u.height);f.data.set(F.data),console.info(f.data[0]+","+f.data[1]+","+f.data[2]);for(let i=0;i<u.height;i++)for(let M=0;M<u.width;M++)if(M==0||i==0||M==u.width-1||i==u.height-1)for(let a=0;a<3;a++)f.data[i*u.width*4+M*4+a]=0;_.putImageData(f,m*u.width+m,y*u.height+y),console.info(f.data[0]+","+f.data[1]+","+f.data[2])}else if(m==e&&y==n)_.putImageData(F,m*u.width+m,y*u.height+y),m=-1,y=-1;else{const f=_.getImageData(e*u.width+e,n*u.height+n,u.width,u.height);_.putImageData(F,e*u.width+e,n*u.height+n),_.putImageData(f,m*u.width+m,y*u.height+y),m=-1,y=-1}};const H=R("imageSave");H.onclick=()=>I();
