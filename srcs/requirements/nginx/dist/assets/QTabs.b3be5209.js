import{f as ee,h as v,i as b,k as de,x as $e,y as J,L as fe,l as y,p as be,n as Be,M as Me,R as De,N as ce,O as Ee,P as Qe,Q as z,K as We,t as he,S as Fe,T as je,U as Oe,V as Ke,A as Q,W as p,X as ve,C as Ve,Y as Ne,Z as ze}from"./index.dfe8dbd2.js";import{e as He}from"./QLayout.bee7a0fb.js";var tt=ee({name:"QToolbarTitle",props:{shrink:Boolean},setup(e,{slots:g}){const m=v(()=>"q-toolbar__title ellipsis"+(e.shrink===!0?" col-shrink":""));return()=>b("div",{class:m.value},de(g.default))}});let Ue=0;const Xe=["click","keydown"],Ge={icon:String,label:[Number,String],alert:[Boolean,String],alertIcon:String,name:{type:[Number,String],default:()=>`t_${Ue++}`},noCaps:Boolean,tabindex:[String,Number],disable:Boolean,contentClass:String,ripple:{type:[Boolean,Object],default:!0}};function Ye(e,g,m,u){const r=$e(fe,J);if(r===J)return console.error("QTab/QRouteTab component needs to be child of QTabs"),J;const{proxy:M}=he(),D=y(null),W=y(null),F=y(null),H=v(()=>e.disable===!0||e.ripple===!1?!1:Object.assign({keyCodes:[13,32],early:!0},e.ripple===!0?{}:e.ripple)),I=v(()=>r.currentModel.value===e.name),U=v(()=>"q-tab relative-position self-stretch flex flex-center text-center"+(I.value===!0?" q-tab--active"+(r.tabProps.value.activeClass?" "+r.tabProps.value.activeClass:"")+(r.tabProps.value.activeColor?` text-${r.tabProps.value.activeColor}`:"")+(r.tabProps.value.activeBgColor?` bg-${r.tabProps.value.activeBgColor}`:""):" q-tab--inactive")+(e.icon&&e.label&&r.tabProps.value.inlineLabel===!1?" q-tab--full":"")+(e.noCaps===!0||r.tabProps.value.noCaps===!0?" q-tab--no-caps":"")+(e.disable===!0?" disabled":" q-focusable q-hoverable cursor-pointer")+(u!==void 0?u.linkClass.value:"")),x=v(()=>"q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable "+(r.tabProps.value.inlineLabel===!0?"row no-wrap q-tab__content--inline":"column")+(e.contentClass!==void 0?` ${e.contentClass}`:"")),T=v(()=>e.disable===!0||r.hasFocus.value===!0||I.value===!1&&r.hasActiveTab.value===!0?-1:e.tabindex||0);function q(l,h){if(h!==!0&&D.value!==null&&D.value.focus(),e.disable===!0){u!==void 0&&u.hasRouterLink.value===!0&&ce(l);return}if(u===void 0){r.updateModel({name:e.name}),m("click",l);return}if(u.hasRouterLink.value===!0){const w=(d={})=>{let C;const R=d.to===void 0||Fe(d.to,e.to)===!0?r.avoidRouteWatcher=je():null;return u.navigateToRouterLink(l,{...d,returnRouterError:!0}).catch(L=>{C=L}).then(L=>{if(R===r.avoidRouteWatcher&&(r.avoidRouteWatcher=!1,C===void 0&&(L===void 0||L.message!==void 0&&L.message.startsWith("Avoided redundant navigation")===!0)&&r.updateModel({name:e.name})),d.returnRouterError===!0)return C!==void 0?Promise.reject(C):L})};m("click",l,w),l.defaultPrevented!==!0&&w();return}m("click",l)}function _(l){Ee(l,[13,32])?q(l,!0):Qe(l)!==!0&&l.keyCode>=35&&l.keyCode<=40&&l.altKey!==!0&&l.metaKey!==!0&&r.onKbdNavigate(l.keyCode,M.$el)===!0&&ce(l),m("keydown",l)}function E(){const l=r.tabProps.value.narrowIndicator,h=[],w=b("div",{ref:F,class:["q-tab__indicator",r.tabProps.value.indicatorClass]});e.icon!==void 0&&h.push(b(z,{class:"q-tab__icon",name:e.icon})),e.label!==void 0&&h.push(b("div",{class:"q-tab__label"},e.label)),e.alert!==!1&&h.push(e.alertIcon!==void 0?b(z,{class:"q-tab__alert-icon",color:e.alert!==!0?e.alert:void 0,name:e.alertIcon}):b("div",{class:"q-tab__alert"+(e.alert!==!0?` text-${e.alert}`:"")})),l===!0&&h.push(w);const d=[b("div",{class:"q-focus-helper",tabindex:-1,ref:D}),b("div",{class:x.value},We(g.default,h))];return l===!1&&d.push(w),d}const A={name:v(()=>e.name),rootRef:W,tabIndicatorRef:F,routeData:u};be(()=>{r.unregisterTab(A)}),Be(()=>{r.registerTab(A)});function j(l,h){const w={ref:W,class:U.value,tabindex:T.value,role:"tab","aria-selected":I.value===!0?"true":"false","aria-disabled":e.disable===!0?"true":void 0,onClick:q,onKeydown:_,...h};return Me(b(l,w,E()),[[De,H.value]])}return{renderTab:j,$tabs:r}}var at=ee({name:"QRouteTab",props:{...Oe,...Ge},emits:Xe,setup(e,{slots:g,emit:m}){const u=Ke({useDisableForRouterLinkProps:!1}),{renderTab:r,$tabs:M}=Ye(e,g,m,{exact:v(()=>e.exact),...u});return Q(()=>`${e.name} | ${e.exact} | ${(u.resolvedLink.value||{}).href}`,()=>{M.verifyRouteModel()}),()=>r(u.linkTag.value,u.linkAttrs.value)}});let ge=!1;{const e=document.createElement("div");e.setAttribute("dir","rtl"),Object.assign(e.style,{width:"1px",height:"1px",overflow:"auto"});const g=document.createElement("div");Object.assign(g.style,{width:"1000px",height:"1px"}),document.body.appendChild(e),e.appendChild(g),e.scrollLeft=-1e3,ge=e.scrollLeft>=0,e.remove()}function Ze(e,g,m){const u=m===!0?["left","right"]:["top","bottom"];return`absolute-${g===!0?u[0]:u[1]}${e?` text-${e}`:""}`}const Je=["left","center","right","justify"];var nt=ee({name:"QTabs",props:{modelValue:[Number,String],align:{type:String,default:"center",validator:e=>Je.includes(e)},breakpoint:{type:[String,Number],default:600},vertical:Boolean,shrink:Boolean,stretch:Boolean,activeClass:String,activeColor:String,activeBgColor:String,indicatorColor:String,leftIcon:String,rightIcon:String,outsideArrows:Boolean,mobileArrows:Boolean,switchIndicator:Boolean,narrowIndicator:Boolean,inlineLabel:Boolean,noCaps:Boolean,dense:Boolean,contentClass:String,"onUpdate:modelValue":[Function,Array]},setup(e,{slots:g,emit:m}){const{proxy:u}=he(),{$q:r}=u,{registerTick:M}=p(),{registerTick:D}=p(),{registerTick:W}=p(),{registerTimeout:F,removeTimeout:H}=ve(),{registerTimeout:I,removeTimeout:U}=ve(),x=y(null),T=y(null),q=y(e.modelValue),_=y(!1),E=y(!0),A=y(!1),j=y(!1),l=[],h=y(0),w=y(!1);let d=null,C=null,R;const L=v(()=>({activeClass:e.activeClass,activeColor:e.activeColor,activeBgColor:e.activeBgColor,indicatorClass:Ze(e.indicatorColor,e.switchIndicator,e.vertical),narrowIndicator:e.narrowIndicator,inlineLabel:e.inlineLabel,noCaps:e.noCaps})),me=v(()=>{const t=h.value,a=q.value;for(let n=0;n<t;n++)if(l[n].name.value===a)return!0;return!1}),Te=v(()=>`q-tabs__content--align-${_.value===!0?"left":j.value===!0?"justify":e.align}`),we=v(()=>`q-tabs row no-wrap items-center q-tabs--${_.value===!0?"":"not-"}scrollable q-tabs--${e.vertical===!0?"vertical":"horizontal"} q-tabs__arrows--${e.outsideArrows===!0?"outside":"inside"} q-tabs--mobile-with${e.mobileArrows===!0?"":"out"}-arrows`+(e.dense===!0?" q-tabs--dense":"")+(e.shrink===!0?" col-shrink":"")+(e.stretch===!0?" self-stretch":"")),ye=v(()=>"q-tabs__content scroll--mobile row no-wrap items-center self-stretch hide-scrollbar relative-position "+Te.value+(e.contentClass!==void 0?` ${e.contentClass}`:"")),O=v(()=>e.vertical===!0?{container:"height",content:"offsetHeight",scroll:"scrollHeight"}:{container:"width",content:"offsetWidth",scroll:"scrollWidth"}),K=v(()=>e.vertical!==!0&&r.lang.rtl===!0),X=v(()=>ge===!1&&K.value===!0);Q(K,B),Q(()=>e.modelValue,t=>{G({name:t,setCurrent:!0,skipEmit:!0})}),Q(()=>e.outsideArrows,V);function G({name:t,setCurrent:a,skipEmit:n}){q.value!==t&&(n!==!0&&e["onUpdate:modelValue"]!==void 0&&m("update:modelValue",t),(a===!0||e["onUpdate:modelValue"]===void 0)&&(Ce(q.value,t),q.value=t))}function V(){M(()=>{te({width:x.value.offsetWidth,height:x.value.offsetHeight})})}function te(t){if(O.value===void 0||T.value===null)return;const a=t[O.value.container],n=Math.min(T.value[O.value.scroll],Array.prototype.reduce.call(T.value.children,(c,i)=>c+(i[O.value.content]||0),0)),s=a>0&&n>a;_.value=s,s===!0&&D(B),j.value=a<parseInt(e.breakpoint,10)}function Ce(t,a){const n=t!=null&&t!==""?l.find(c=>c.name.value===t):null,s=a!=null&&a!==""?l.find(c=>c.name.value===a):null;if(n&&s){const c=n.tabIndicatorRef.value,i=s.tabIndicatorRef.value;d!==null&&(clearTimeout(d),d=null),c.style.transition="none",c.style.transform="none",i.style.transition="none",i.style.transform="none";const o=c.getBoundingClientRect(),f=i.getBoundingClientRect();i.style.transform=e.vertical===!0?`translate3d(0,${o.top-f.top}px,0) scale3d(1,${f.height?o.height/f.height:1},1)`:`translate3d(${o.left-f.left}px,0,0) scale3d(${f.width?o.width/f.width:1},1,1)`,W(()=>{d=setTimeout(()=>{d=null,i.style.transition="transform .25s cubic-bezier(.4, 0, .2, 1)",i.style.transform="none"},70)})}s&&_.value===!0&&$(s.rootRef.value)}function $(t){const{left:a,width:n,top:s,height:c}=T.value.getBoundingClientRect(),i=t.getBoundingClientRect();let o=e.vertical===!0?i.top-s:i.left-a;if(o<0){T.value[e.vertical===!0?"scrollTop":"scrollLeft"]+=Math.floor(o),B();return}o+=e.vertical===!0?i.height-c:i.width-n,o>0&&(T.value[e.vertical===!0?"scrollTop":"scrollLeft"]+=Math.ceil(o),B())}function B(){const t=T.value;if(t===null)return;const a=t.getBoundingClientRect(),n=e.vertical===!0?t.scrollTop:Math.abs(t.scrollLeft);K.value===!0?(E.value=Math.ceil(n+a.width)<t.scrollWidth-1,A.value=n>0):(E.value=n>0,A.value=e.vertical===!0?Math.ceil(n+a.height)<t.scrollHeight:Math.ceil(n+a.width)<t.scrollWidth)}function ae(t){C!==null&&clearInterval(C),C=setInterval(()=>{ke(t)===!0&&S()},5)}function ne(){ae(X.value===!0?Number.MAX_SAFE_INTEGER:0)}function le(){ae(X.value===!0?0:Number.MAX_SAFE_INTEGER)}function S(){C!==null&&(clearInterval(C),C=null)}function qe(t,a){const n=Array.prototype.filter.call(T.value.children,f=>f===a||f.matches&&f.matches(".q-tab.q-focusable")===!0),s=n.length;if(s===0)return;if(t===36)return $(n[0]),n[0].focus(),!0;if(t===35)return $(n[s-1]),n[s-1].focus(),!0;const c=t===(e.vertical===!0?38:37),i=t===(e.vertical===!0?40:39),o=c===!0?-1:i===!0?1:void 0;if(o!==void 0){const f=K.value===!0?-1:1,k=n.indexOf(a)+o*f;return k>=0&&k<s&&($(n[k]),n[k].focus({preventScroll:!0})),!0}}const Re=v(()=>X.value===!0?{get:t=>Math.abs(t.scrollLeft),set:(t,a)=>{t.scrollLeft=-a}}:e.vertical===!0?{get:t=>t.scrollTop,set:(t,a)=>{t.scrollTop=a}}:{get:t=>t.scrollLeft,set:(t,a)=>{t.scrollLeft=a}});function ke(t){const a=T.value,{get:n,set:s}=Re.value;let c=!1,i=n(a);const o=t<i?-1:1;return i+=o*5,i<0?(c=!0,i=0):(o===-1&&i<=t||o===1&&i>=t)&&(c=!0,i=t),s(a,i),B(),c}function oe(t,a){for(const n in t)if(t[n]!==a[n])return!1;return!0}function _e(){let t=null,a={matchedLen:0,queryDiff:9999,hrefLen:0};const n=l.filter(o=>o.routeData!==void 0&&o.routeData.hasRouterLink.value===!0),{hash:s,query:c}=u.$route,i=Object.keys(c).length;for(const o of n){const f=o.routeData.exact.value===!0;if(o.routeData[f===!0?"linkIsExactActive":"linkIsActive"].value!==!0)continue;const{hash:k,query:Y,matched:Ie,href:Ae}=o.routeData.resolvedLink.value,Z=Object.keys(Y).length;if(f===!0){if(k!==s||Z!==i||oe(c,Y)===!1)continue;t=o.name.value;break}if(k!==""&&k!==s||Z!==0&&oe(Y,c)===!1)continue;const P={matchedLen:Ie.length,queryDiff:i-Z,hrefLen:Ae.length-k.length};if(P.matchedLen>a.matchedLen){t=o.name.value,a=P;continue}else if(P.matchedLen!==a.matchedLen)continue;if(P.queryDiff<a.queryDiff)t=o.name.value,a=P;else if(P.queryDiff!==a.queryDiff)continue;P.hrefLen>a.hrefLen&&(t=o.name.value,a=P)}t===null&&l.some(o=>o.routeData===void 0&&o.name.value===q.value)===!0||G({name:t,setCurrent:!0})}function Le(t){if(H(),w.value!==!0&&x.value!==null&&t.target&&typeof t.target.closest=="function"){const a=t.target.closest(".q-tab");a&&x.value.contains(a)===!0&&(w.value=!0,_.value===!0&&$(a))}}function Se(){F(()=>{w.value=!1},30)}function N(){ie.avoidRouteWatcher===!1?I(_e):U()}function re(){if(R===void 0){const t=Q(()=>u.$route.fullPath,N);R=()=>{t(),R=void 0}}}function Pe(t){l.push(t),h.value++,V(),t.routeData===void 0||u.$route===void 0?I(()=>{if(_.value===!0){const a=q.value,n=a!=null&&a!==""?l.find(s=>s.name.value===a):null;n&&$(n.rootRef.value)}}):(re(),t.routeData.hasRouterLink.value===!0&&N())}function xe(t){l.splice(l.indexOf(t),1),h.value--,V(),R!==void 0&&t.routeData!==void 0&&(l.every(a=>a.routeData===void 0)===!0&&R(),N())}const ie={currentModel:q,tabProps:L,hasFocus:w,hasActiveTab:me,registerTab:Pe,unregisterTab:xe,verifyRouteModel:N,updateModel:G,onKbdNavigate:qe,avoidRouteWatcher:!1};Ve(fe,ie);function ue(){d!==null&&clearTimeout(d),S(),R!==void 0&&R()}let se;return be(ue),Ne(()=>{se=R!==void 0,ue()}),ze(()=>{se===!0&&re(),V()}),()=>b("div",{ref:x,class:we.value,role:"tablist",onFocusin:Le,onFocusout:Se},[b(He,{onResize:te}),b("div",{ref:T,class:ye.value,onScroll:B},de(g.default)),b(z,{class:"q-tabs__arrow q-tabs__arrow--left absolute q-tab__icon"+(E.value===!0?"":" q-tabs__arrow--faded"),name:e.leftIcon||r.iconSet.tabs[e.vertical===!0?"up":"left"],onMousedownPassive:ne,onTouchstartPassive:ne,onMouseupPassive:S,onMouseleavePassive:S,onTouchendPassive:S}),b(z,{class:"q-tabs__arrow q-tabs__arrow--right absolute q-tab__icon"+(A.value===!0?"":" q-tabs__arrow--faded"),name:e.rightIcon||r.iconSet.tabs[e.vertical===!0?"down":"right"],onMousedownPassive:le,onTouchstartPassive:le,onMouseupPassive:S,onMouseleavePassive:S,onTouchendPassive:S})])}});export{tt as Q,nt as a,at as b};