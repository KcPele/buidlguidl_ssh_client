(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[377],{26563:function(e,s,t){Promise.resolve().then(t.bind(t,40033))},40033:function(e,s,t){"use strict";t.r(s),t.d(s,{default:function(){return x}});var r=t(57437),a=t(79205);let l=(0,a.Z)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]),n=(0,a.Z)("Wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);var c=t(88906),o=t(64707),i=t(2265),d=t(99376),u=t(80221),m=t(15488),h=()=>{let e=(0,d.useRouter)(),[s,t]=(0,i.useState)({host:"",username:"",password:"",port:"22"}),[a,l]=(0,i.useState)(""),[n,c]=(0,i.useState)({success:!1,error:"",message:""}),[o,h]=(0,i.useState)(!1),[x,p]=(0,i.useState)(!1);(0,i.useEffect)(()=>{let e=localStorage.getItem(m.LU),s=localStorage.getItem(m.$H);if(e)try{let s=JSON.parse(e);t(e=>({...e,host:s.host||"",username:s.username||"",port:s.port||"22"}))}catch(e){console.error("Failed to parse saved server details")}s&&p("true"===s)},[e]);let f=async t=>{if(t.preventDefault(),l(""),c({success:!1,error:"",message:""}),!s.host||!s.username||!s.password){l("Please fill in all required fields");return}h(!0);try{let t=await fetch("/api/ssh/connect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}),r=await t.json();if(!t.ok)throw Error(r.error||"Failed to connect");c(r),localStorage.setItem(m.LU,JSON.stringify(s)),x&&localStorage.setItem(m.$H,"true"),e.push("/dashboard")}catch(e){l(e instanceof Error?e.message:"An error occurred"),h(!1)}},b=e=>{let{name:s,value:r}=e.target;t(e=>({...e,[s]:r}))};return(0,r.jsx)("div",{className:" bg-base-200 p-4",children:(0,r.jsx)("div",{className:"max-w-md mx-auto",children:(0,r.jsx)("div",{className:"card bg-base-100 shadow-xl",children:(0,r.jsxs)("div",{className:"card-body",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,r.jsx)(u.Z,{className:"w-6 h-6"}),(0,r.jsx)("h2",{className:"card-title",children:"SSH Client"})]}),(0,r.jsx)("button",{onClick:()=>{localStorage.removeItem(m.LU),localStorage.removeItem(m.$H),p(!1),localStorage.removeItem(m.Iy),localStorage.removeItem(m.s6),localStorage.removeItem(m.Bm),t({host:"",username:"",password:"",port:"22"})},className:"btn btn-ghost btn-sm",children:"Clear Saved Data"})]}),(0,r.jsxs)("form",{onSubmit:f,className:"space-y-4",children:[(0,r.jsxs)("div",{className:"form-control w-full",children:[(0,r.jsx)("label",{className:"label",children:(0,r.jsx)("span",{className:"label-text",children:"Server IP/Hostname"})}),(0,r.jsx)("input",{type:"text",name:"host",value:s.host,onChange:b,placeholder:"example.com or 192.168.1.1",className:"input input-bordered w-full"})]}),(0,r.jsxs)("div",{className:"form-control w-full",children:[(0,r.jsx)("label",{className:"label",children:(0,r.jsx)("span",{className:"label-text",children:"Username"})}),(0,r.jsx)("input",{type:"text",name:"username",value:s.username,onChange:b,placeholder:"username",className:"input input-bordered w-full"})]}),(0,r.jsxs)("div",{className:"form-control w-full",children:[(0,r.jsx)("label",{className:"label",children:(0,r.jsx)("span",{className:"label-text",children:"Password"})}),(0,r.jsx)("input",{type:"password",name:"password",value:s.password,onChange:b,placeholder:"password",className:"input input-bordered w-full"})]}),(0,r.jsxs)("div",{className:"form-control w-full",children:[(0,r.jsx)("label",{className:"label",children:(0,r.jsx)("span",{className:"label-text",children:"Port"})}),(0,r.jsx)("input",{type:"text",name:"port",value:s.port,onChange:b,placeholder:"22",className:"input input-bordered w-full"})]}),(0,r.jsxs)("div",{className:"form-control",children:[(0,r.jsxs)("label",{className:"label cursor-pointer",children:[(0,r.jsx)("span",{className:"label-text",children:"Remember server details"}),(0,r.jsx)("input",{type:"checkbox",checked:x,onChange:e=>p(e.target.checked),className:"checkbox checkbox-primary"})]}),(0,r.jsx)("span",{className:"text-xs text-gray-500 mt-1",children:"Note: Password will not be saved"})]}),(0,r.jsx)("button",{type:"submit",className:"btn btn-primary w-full",disabled:o,children:o?"Connecting...":"Connect"})]}),a&&(0,r.jsx)("div",{className:"alert alert-error mt-4",children:(0,r.jsx)("span",{children:a})}),n.error&&(0,r.jsx)("div",{className:"mt-4 p-4 bg-black text-green-400 rounded-lg font-mono min-h-[100px] overflow-y-auto",children:(0,r.jsx)("pre",{children:n.error})})]})})})})};function x(){let{address:e}=(0,o.m)();return e?(0,r.jsx)(h,{}):(0,r.jsx)("div",{className:"min-h-[400px] flex items-center justify-center p-6",children:(0,r.jsxs)("div",{className:"max-w-md w-full space-y-6",children:[(0,r.jsxs)("div",{className:"alert alert-error",children:[(0,r.jsx)(l,{className:"h-5 w-5"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h3",{className:"font-bold",children:"Authentication Required"}),(0,r.jsx)("div",{className:"text-sm",children:"Please connect your wallet to access node setup functionality."})]})]}),(0,r.jsx)("div",{className:"card bg-base-100 shadow-xl",children:(0,r.jsxs)("div",{className:"card-body items-center text-center",children:[(0,r.jsx)("div",{className:"bg-base-200 p-3 rounded-full",children:(0,r.jsx)(n,{className:"h-8 w-8"})}),(0,r.jsx)("h2",{className:"card-title",children:"Wallet Connection Required"}),(0,r.jsx)("p",{className:"text-base-content/80",children:"To ensure secure access and management of your nodes, we require wallet authentication. This helps protect your node infrastructure and ensures only authorized users can make changes."}),(0,r.jsxs)("div",{className:"flex items-center gap-2 text-sm text-base-content/70 mt-4",children:[(0,r.jsx)(c.Z,{className:"h-4 w-4"}),(0,r.jsx)("span",{children:"Secure Authentication"})]})]})})]})})}},15488:function(e,s,t){"use strict";t.d(s,{$H:function(){return c},Bm:function(){return n},Iy:function(){return l},Ko:function(){return o},LU:function(){return r},P0:function(){return i},s6:function(){return a}});let r="ssh_server_details",a="buidlguidlDirectory",l="buidlguidlSetupCompleted",n="setupProgress",c="ssh_remember_me",o="~/buidlguidl-client",i=async(e,s,t,r)=>{let a=e.replace("$DIRECTORY",s).replace("$ADDRESS",t||"").replace("$PASSWORD",r||"");try{let e=await fetch("/api/ssh/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({command:a})}),s=await e.json();if(s.error)throw Error(s.message||"Command execution failed");return s}catch(e){throw e}}},79205:function(e,s,t){"use strict";t.d(s,{Z:function(){return o}});var r=t(2265);let a=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),l=function(){for(var e=arguments.length,s=Array(e),t=0;t<e;t++)s[t]=arguments[t];return s.filter((e,s,t)=>!!e&&""!==e.trim()&&t.indexOf(e)===s).join(" ").trim()};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let c=(0,r.forwardRef)((e,s)=>{let{color:t="currentColor",size:a=24,strokeWidth:c=2,absoluteStrokeWidth:o,className:i="",children:d,iconNode:u,...m}=e;return(0,r.createElement)("svg",{ref:s,...n,width:a,height:a,stroke:t,strokeWidth:o?24*Number(c)/Number(a):c,className:l("lucide",i),...m},[...u.map(e=>{let[s,t]=e;return(0,r.createElement)(s,t)}),...Array.isArray(d)?d:[d]])}),o=(e,s)=>{let t=(0,r.forwardRef)((t,n)=>{let{className:o,...i}=t;return(0,r.createElement)(c,{ref:n,iconNode:s,className:l("lucide-".concat(a(e)),o),...i})});return t.displayName="".concat(e),t}},88906:function(e,s,t){"use strict";t.d(s,{Z:function(){return r}});let r=(0,t(79205).Z)("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]])},80221:function(e,s,t){"use strict";t.d(s,{Z:function(){return r}});let r=(0,t(79205).Z)("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]])},99376:function(e,s,t){"use strict";t.r(s);var r=t(35475),a={};for(var l in r)"default"!==l&&(a[l]=(function(e){return r[e]}).bind(0,l));t.d(s,a)}},function(e){e.O(0,[4707,2971,2117,1744],function(){return e(e.s=26563)}),_N_E=e.O()}]);