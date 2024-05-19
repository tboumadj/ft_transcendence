import{_ as D,az as F,l as c,x as T,n as I,o as f,$ as E,d as a,a0 as d,a as s,a4 as h,w as m,aW as k,c as _,a1 as j,aC as N,a6 as C,aX as b}from"./index.dfe8dbd2.js";import{Q as x}from"./QImg.202e5004.js";const B={setup(){const u=F(),o=c(u.params.id),w=c(!1),t=c({}),n=c(!1),r=T("bus"),i=async()=>{try{const e=localStorage.getItem("jwtToken");if(e){const l=await(await fetch(`http://${window.location.hostname}:3000/api/auth/profile/friend?userId=${o.value}`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},credentials:"include"})).json();t.value=l}}catch(e){console.log("error",e)}},v=async()=>{try{const e=localStorage.getItem("jwtToken");e&&((await(await fetch(`http://${window.location.hostname}:3000/api/update/addFriend`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},credentials:"include",body:JSON.stringify({friend:o.value})})).json()).success==!0?(console.log("FRIEND FOR LIFE"),n.value=!0,r.emit("freshFriend")):console.log("NOT FRIEND FOR LIFE"))}catch(e){console.error("BUG WITH ADDING FRIEND",e)}},y=async()=>{try{const e=localStorage.getItem("jwtToken");e&&((await(await fetch(`http://${window.location.hostname}:3000/api/update/deleteFriend`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},credentials:"include",body:JSON.stringify({friend:o.value})})).json()).success==!0?(console.log("FRIEND DELETED"),n.value=!1,r.emit("freshFriend")):console.log("FRIEND Not DELETE"))}catch(e){console.error("BUG WITH DELETING FRIEND",e)}},g=async()=>{try{const e=localStorage.getItem("jwtToken");e&&((await(await fetch(`http://${window.location.hostname}:3000/api/auth/profile`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},credentials:"include"})).json()).friends.includes(+o.value)===!0&&(n.value=!0),console.log("friendvalue",n.value))}catch{console.log("error")}};return I(()=>{i(),g(),r.emit("inOnSet")}),{friendId:o,card:w,profileData:t,addFriend:v,deleteFriend:y,areWeFriend:g,friend:n}},data(){return{message:"000000",baseUrl:"http://"+window.location.hostname+":3000/",localIp:window.location.hostname}}},S={class:"page-container"},P={class:"flex-container"},R={class:"row no-wrap items-center"},U={class:"col text-h6 ellipsis"},A={class:"text-caption text-grey"},Q={class:"text-subtitle1"},G={class:"flex-container2"},O={class:"button-container"};function z(u,o,w,t,n,r){return f(),E(j,null,[a("div",S,[a("h2",null,d(t.profileData.pseudo),1)]),a("div",P,[s(h,{label:"Info",color:"primary",onClick:o[0]||(o[0]=i=>t.card=!0)}),s(k,{modelValue:t.card,"onUpdate:modelValue":o[1]||(o[1]=i=>t.card=i)},{default:m(()=>[s(N,{class:"my-card"},{default:m(()=>[s(x,{src:`${n.baseUrl}api/uploadAvatar/${t.profileData.avatar}`,crossorigin:u.credentials?"use-credentials":"anonymous"},null,8,["src","crossorigin"]),a("div",R,[a("div",U,d(t.profileData.pseudo),1)]),a("div",A," Username: ( "+d(t.profileData.username)+" ) ",1),s(C),s(b,{class:"q-pt-none"},{default:m(()=>[a("div",Q,d(t.profileData.email),1)]),_:1})]),_:1})]),_:1},8,["modelValue"])]),a("div",G,[a("div",O,[t.friend===!0?(f(),_(h,{key:0,label:"Delete",color:"negative",onClick:t.deleteFriend},null,8,["onClick"])):(f(),_(h,{key:1,label:"Add",color:"primary",onClick:t.addFriend},null,8,["onClick"]))])])],64)}var W=D(B,[["render",z]]);export{W as default};