document.getElementById("scan")
.addEventListener("click",async()=>{

let [tab]=await chrome.tabs.query({

active:true,
currentWindow:true

});

let url=tab.url;

document.getElementById(
"url"
).innerText=url;


let score=0;

let reasons=[];



let suspiciousWords=[

"login",
"verify",
"free",
"bank",
"gift",
"bonus",
"secure",
"update",
"password",
"wallet",
"crypto",
"win"

];

suspiciousWords.forEach(word=>{

if(
url.toLowerCase()
.includes(word)
){

score+=10;

reasons.push(
"⚠ Found keyword: "
+word
);

}

});



let shorteners=[

"bit.ly",
"tinyurl",
"shorturl",
"goo.gl"

];

shorteners.forEach(site=>{

if(
url.includes(site)
){

score+=25;

reasons.push(
"⚠ URL shortener detected"
);

}

});



if(url.includes("@")){

score+=30;

reasons.push(
"⚠ @ symbol found"
);

}



let ipPattern=
/(\d{1,3}\.){3}\d{1,3}/;

if(
ipPattern.test(url)
){

score+=30;

reasons.push(
"⚠ IP URL detected"
);

}



if(
url.startsWith(
"http://"
)
){

score+=25;

reasons.push(
"⚠ No HTTPS"
);

}



if(
url.length>75
){

score+=20;

reasons.push(
"⚠ Long URL"
);

}



let result=
document.getElementById(
"result"
);

let status=
document.getElementById(
"status"
);

let emoji=
document.getElementById(
"emoji"
);

let trust=
document.getElementById(
"trust"
);



if(score<30){

emoji.innerText="🟢";

result.style.color="green";

result.innerText=
"Risk Score: "
+score+"/100";

status.innerText=
"SAFE\n\n"+
reasons.join("\n");

trust.innerText=
"Trust Score: High";

}



else if(score<70){

emoji.innerText="🟠";

result.style.color="orange";

result.innerText=
"Risk Score: "
+score+"/100";

status.innerText=
"SUSPICIOUS\n\n"+
reasons.join("\n");

trust.innerText=
"Trust Score: Medium";

}



else{

emoji.innerText="🔴";

result.style.color="red";

result.innerText=
"Risk Score: "
+score+"/100";

status.innerText=
"PHISHING RISK\n\n"+
reasons.join("\n");

trust.innerText=
"Trust Score: Low";

}



document.getElementById(
"time"
).innerText=

"Scanned: "
+
new Date()
.toLocaleTimeString();



if(reasons.length==0){

status.innerText=
"No suspicious indicators found"

}

try{

let response=
await fetch(

"https://www.virustotal.com/api/v3/urls",

{

method:"POST",

headers:{

"x-apikey":API_KEY,

"Content-Type":
"application/x-www-form-urlencoded"

},

body:"url="+encodeURIComponent(url)

}

);

let data=
await response.json();

reasons.push(
"🌐 VirusTotal checked"
);

}catch{

reasons.push(
"VirusTotal unavailable"
);

}

});