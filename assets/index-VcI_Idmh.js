(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(t){if(t.ep)return;t.ep=!0;const n=a(t);fetch(t.href,n)}})();function te(e,i){if(localStorage.getItem("weatherApiKey")){i();return}e.innerHTML=`
    <div class="modal active" id="apiKeyModal">
      <div class="modal-content">
        <h2>Enter OpenWeatherMap API Key</h2>
        <p>
          PipeSafe requires an OpenWeatherMap API key to fetch weather data. You can obtain a free key by signing up at
          <a href="https://home.openweathermap.org" target="_blank" rel="noopener">OpenWeatherMap</a>.
        </p>
        <input type="password" id="api-key-input" placeholder="Enter API Key" />
        <button id="save-api-key">Save</button>
      </div>
    </div>
  `;const s=e.querySelector("#save-api-key"),t=e.querySelector("#api-key-input");s.addEventListener("click",()=>{const n=t.value.trim();n?(localStorage.setItem("weatherApiKey",n),e.innerHTML="",i()):(t.placeholder="API Key cannot be empty",t.value="")})}function ne(e,i){if(localStorage.getItem("waiverAccepted")==="true"){i();return}e.innerHTML=`
    <div class="modal active" id="waiverModal">
      <div class="modal-content">
        <h2>PipeSafe Disclaimer</h2>
        <p>
          PipeSafe is designed to help you assess whether it's safe to leave pipes, tobacco, or cigars in your car based on weather conditions. However, weather data and safety estimates are not guaranteed to be accurate. By using PipeSafe, you accept all risks associated with its use and agree not to hold the creators liable for any damages, including to your property (e.g., pipes, tobacco, or cigars). Do you agree to these terms?
        </p>
        <button id="accept-waiver">Accept</button>
        <button id="decline-waiver">Decline</button>
      </div>
    </div>
  `;const s=e.querySelector("#accept-waiver"),t=e.querySelector("#decline-waiver");s.addEventListener("click",()=>{localStorage.setItem("waiverAccepted","true"),e.innerHTML="",i()}),t.addEventListener("click",()=>{e.innerHTML="<p>You must accept the disclaimer to use PipeSafe.</p>"})}const O=50,ie=78,_=80,A=86400;function q(e,i,a,s){if(!Number.isFinite(e)||!Number.isFinite(i)||!Number.isFinite(a))return!1;const t=i,n=a;if(!(n>t))return!1;if(!Number.isFinite(s)){const f=Math.floor((e-t)/A),v=t+f*A,g=n+f*A;return e>=v&&e<g}const o=f=>{const v=(f+s)%A;return v<0?v+A:v},c=o(t),l=o(n),r=o(e);return c===l?!1:c<l?r>=c&&r<l:r>=c||r<l}function U(e,i,a){if(!a||i!=="open")return 0;const s=Number.isFinite(e)?e:0;return s>0?s:0}function ae(e){if(!Number.isFinite(e))return{status:"not-safe",reason:"Invalid data"};const i=Math.round(e);return i<O?{status:"not-safe",reason:`Too cold: estimated interior ${i}°F`}:i>_?{status:"not-safe",reason:`Too hot: estimated interior ${i}°F`}:i>=ie?{status:"warning",reason:`Estimated interior ${i}°F is near the 80°F tobacco limit`}:{status:"safe",reason:"Conditions ideal"}}function se(e){if(!Number.isFinite(e))return"#888888";const i=Math.round(e);return`hsl(${200-(Math.min(Math.max(i,O),_)-O)/(_-O)*200}, 70%, 60%)`}function x(e,i,a=!0){const s=Number.isFinite(i)?i:-new Date().getTimezoneOffset()*60,t=new Date((e+s)*1e3);let n=t.getUTCHours();const o=t.getUTCMinutes(),c=n>=12?"PM":"AM";return n=n%12,n===0&&(n=12),a?`${n}:${o.toString().padStart(2,"0")} ${c}`:`${n} ${c}`}function oe(e,i,a,s,t){if(t(e))return"Not safe to leave in the car now";const n=s(a),o=i.find(c=>c.at>a&&s(c.at)!==n&&t(c.interior));return o?`Safe until ${s(o.at)}`:"Safe for 12+ hours"}function re(e,i,a,s,t){let n=c(),o="not-safe";console.log("WeatherDisplay: Loaded settings:",n);function c(){const d=localStorage.getItem("pipeSafeSettings");return d?JSON.parse(d):{humidityThreshold:80,carTempIncrease:0}}const l=d=>ae(d),r=d=>Number.isFinite(d)?Math.round(d).toString().padStart(2,"0"):"N/A",f=d=>se(d),v=d=>{if(!Number.isFinite(d))return"#888888";const h=Math.round(d),p=Number.isFinite(n.humidityThreshold)?n.humidityThreshold:80,m=Math.min(Math.max(h,50),p),w=30+(m-50)/(p-50)*40,T=80-(m-50)/(p-50)*40;return`hsl(200, ${w}%, ${T}%)`},g=(d="Not Safe")=>{console.log("WeatherDisplay: Updating weather, scenario:",d),s.fetchWeatherData().then(([h])=>{if(console.log("WeatherDisplay: Current:",h),String(h.cod)!=="200"){e.innerHTML="<p>Error: Invalid API response.</p>";return}const p=a.getParkingCondition(),m=Number.isFinite(h.dt)?h.dt:Math.floor(Date.now()/1e3),w=h.sys?.sunrise,T=h.sys?.sunset,y=h.timezone,b=q(m,w,T,y),I=U(n.carTempIncrease,p,b),S=h.main?.temp,M=Number.isFinite(S)?S+I:NaN;console.log("WeatherDisplay: outside",S,"sunOffset",I,"daytime",b,"local",x(m,y)),document.dispatchEvent(new CustomEvent("solar-updated",{detail:{sunrise:w,sunset:T,timezone:y}}));const L=Number.isFinite(h.main?.humidity)?h.main.humidity:NaN,{status:P,reason:D}=l(M);o=P;const C=f(M),B=v(L),$=P==="safe"?"/pipe-safe/safe.svg":P==="warning"?"/pipe-safe/warning.svg":D==="Invalid data"?"/pipe-safe/error.svg":"/pipe-safe/not-safe.svg",H=P==="safe"||P==="warning";e.innerHTML=`
          
          <div class="current-weather">
            <div class="weather-item">
              <span class="label">Est. car interior</span>
              <span class="value" style="color: ${C};"><i class="fa-solid fa-temperature-quarter"></i> ${r(M)}°F${I>0?`<span class="sun-offset">(+${I}°F sun)</span>`:""}</span>
            </div>
            <div class="weather-item">
              <span class="label">Humidity</span>
              <span class="value" style="color: ${B};"><i class="fa-solid fa-droplet"></i> ${r(L)}%</span>
            </div>
          </div>
          <img class="safety-image" src="${$}" alt="${P}">
          <p class="reason">Reason: ${D}</p>
        `,t.updateForecast(M,L,H,o)}).catch(h=>{console.error("WeatherDisplay: Fetch error:",h),e.innerHTML="<p>Error fetching weather data.</p>"})};return document.addEventListener("parking-changed",d=>{console.log("WeatherDisplay: Parking changed event received:",d.detail.parkingCondition),g(localStorage.getItem("testScenario")||"Not Safe")}),document.addEventListener("settings-changed",d=>{n=d.detail.settings,console.log("WeatherDisplay: Settings changed, new settings:",n),g(localStorage.getItem("testScenario")||"Not Safe")}),g(),{checkSafety:l,getTempColor:f,getHumidityColor:v,get currentStatus(){return o}}}function z(e){e.innerHTML=`
    <button class="info-button"><i class="fa-solid fa-info"></i></button>
    <div class="modal" id="infoModal">
      <div class="modal-content">
        <h1>About PipeSafe</h1>
        <p class="info-text">PipeSafe helps you determine if it’s safe to leave pipes, tobacco, or cigars in your car for up to 12 hours based on temperature.</p>
        
        <h2>Temperature</h2>
        <p class="info-text">Pipes, pipe tobacco, and cigars are sensitive to temperature extremes. Ideally, keep them between 60-75°F to maintain quality, though pipes are more resilient. Below are the safe ranges and risks for each item:</p>
        
        <h3>Pipes</h3>
        <p class="info-text"><b>(50-90°F, ideally 65-75°F):</b> Made of briar wood, pipes can tolerate a wide range but thrive at room temperature. <b>Above 90°F:</b> Risk of warping, cracking, or bleaching (especially in sunlight). <b>Below 50°F:</b> Potential brittleness or cracking. Avoid rapid temperature changes to prevent damage.</p>
        
        <h3>Pipe Tobacco</h3>
        <p class="info-text"><b>(50-80°F, ideally 60-70°F):</b> Store in airtight containers to maintain moisture and flavor. <b>Above 80°F:</b> Drying out, flavor loss, or faster spoilage. <b>Below 50°F:</b> Excessive drying, reduced quality.</p>

        <h3>Cigars</h3>
        <p class="info-text"><b>(50-75°F, ideally 65-70°F):</b> Require precise conditions to avoid damage. <b>Above 75°F:</b> Drying, flavor loss, or cigar beetle hatching. <b>Below 50°F:</b> Drying, wrapper cracking. Use a travel humidor for best results.</p>
        
        <h2>Humidity</h2>
        <p class="info-text">Humidity is not a major concern for short-term car storage (up to 12 hours) and is not factored into PipeSafe’s safety calculations. For long-term storage, consider humidity to prevent drying or excess moisture.</p>
        
        <h2>Car</h2>
        <p class="info-text">Full sun can raise a closed cabin about 20–40°F above the outside temperature. Shade stays much closer to the outside air. The Car Temperature setting (+0, +10, +20, or +40°F) is a sun offset: it is added only in daytime when the car is In Open. After sunset that offset is not applied. Park in the shade or use a sunshade, and use a sturdy vented container so warm air does not build pressure.</p>
        
        <button id="close-info">Close</button>
      </div>
    </div>
  `;const i=e.querySelector(".modal"),a=e.querySelector(".info-button"),s=e.querySelector("#close-info"),t=()=>{i.classList.remove("active")};a.addEventListener("click",()=>{i.classList.add("active")}),s.addEventListener("click",t),document.addEventListener("keydown",n=>{n.key==="Escape"&&i.classList.contains("active")&&t()}),i.addEventListener("click",n=>{n.target===i&&t()})}function R(e){const i=localStorage.getItem("pipeSafeSettings"),a=i?JSON.parse(i):{carTempIncrease:0};console.log("SettingsModal: Loaded settings:",a),e.innerHTML=`
    <button class="settings-button"><i class="fa-solid fa-gear"></i></button>
    <div class="modal" id="settingsModal">
        <div class="modal-content">
            <h2>Settings</h2>
            <div class="settings-group">
                <h3>Car Temperature</h3>
                <p class="settings-note">Sun offset for daytime In Open only. Not added in shade or at night.</p>
                <div class="radio-group">
                    <label><input type="radio" name="car-temp-increase" value="0" ${a.carTempIncrease===0?"checked":""}> +0°F</label>
                    <label><input type="radio" name="car-temp-increase" value="10" ${a.carTempIncrease===10?"checked":""}> +10°F</label>
                    <label><input type="radio" name="car-temp-increase" value="20" ${a.carTempIncrease===20?"checked":""}> +20°F</label>
                    <label><input type="radio" name="car-temp-increase" value="40" ${a.carTempIncrease===40?"checked":""}> +40°F</label> <!-- New option -->
                </div>
            </div>
            <button id="save-settings">Save</button>
            <button id="close-settings">Close</button>
        </div>
    </div>
  `;const s=e.querySelector(".modal"),t=e.querySelector(".settings-button"),n=e.querySelector("#close-settings"),o=e.querySelector("#save-settings"),c=()=>{s.classList.remove("active")};t.addEventListener("click",()=>{s.classList.add("active")}),n.addEventListener("click",c),document.addEventListener("keydown",l=>{l.key==="Escape"&&s.classList.contains("active")&&c()}),s.addEventListener("click",l=>{l.target===s&&c()}),o.addEventListener("click",()=>{const r={carTempIncrease:parseInt(e.querySelector('input[name="car-temp-increase"]:checked')?.value||"0")};console.log("SettingsModal: Saving settings:",r),localStorage.setItem("pipeSafeSettings",JSON.stringify(r));const f=new CustomEvent("settings-changed",{detail:{settings:r}});document.dispatchEvent(f),console.log("SettingsModal: Dispatched settings-changed"),c()})}function ce(e){if(!e)throw console.error("ParkingToggle: Container not found!"),new Error("Parking toggle container not found");let a=localStorage.getItem("parkingStorageItem")==="shade"?"shade":"open",s=n(),t={};function n(){const r=localStorage.getItem("pipeSafeSettings");return r?JSON.parse(r):{carTempIncrease:0}}const o=()=>q(Math.floor(Date.now()/1e3),t.sunrise,t.sunset,t.timezone),c=()=>o()?a==="open"?`Est. interior includes +${U(s.carTempIncrease,"open",!0)}°F sun offset.`:"In shade, the estimate uses the outside temperature.":"Nighttime — no direct sun.",l=()=>{const r=o(),f=r&&a==="open",v=c();e.innerHTML=`
      <h2>Where Did You Park?</h2>
      <div class='parking-toggle-well'>
        <div class='parking-toggle-container${r?"":" night"}'>
          <div class='parking-option shade ${f?"":"active"}'>
            <i class='fa-solid fa-umbrella-beach'></i>
            <span>In Shade</span>
          </div>
          <div class='parking-toggle'>
            <input type='checkbox' id='parking-toggle' ${f?"checked":""} ${r?"":"disabled"}>
            <label for='parking-toggle'><i class='fa-solid fa-car-side'></i></label>
          </div>
          <div class='parking-option open ${f?"active":""}'>
            <i class='fa-solid fa-sun'></i>
            <span>In Open</span>
          </div>
        </div>
      </div>
      <p class="car-warning${r?"":" night"}">${v}</p>
    `;const g=e.querySelector("#parking-toggle"),d=e.querySelector(".parking-toggle-container");d&&g?d.addEventListener("click",h=>{h.preventDefault(),o()&&(g.checked=!g.checked,a=g.checked?"open":"shade",console.log("ParkingToggle: Changed to:",a),localStorage.setItem("parkingStorageItem",a),l(),document.dispatchEvent(new CustomEvent("parking-changed",{detail:{parkingCondition:a}})))}):console.error("ParkingToggle: Toggle input or container not found!")};return document.addEventListener("settings-changed",r=>{s=r.detail.settings,console.log("ParkingToggle: Settings changed, new settings:",s),l()}),document.addEventListener("solar-updated",r=>{t=r.detail??{},l()}),l(),{getParkingCondition:()=>(console.log("ParkingToggle: getParkingCondition called, returning:",a),a)}}function le(e,i){const a="pipeSafeWeatherCache";return{fetchWeatherData:async()=>{const n=localStorage.getItem(a);if(n){const o=JSON.parse(n);if(Date.now()-o.timestamp<6e5)return console.log("Using cached weather data:",o),[o.current,o.forecast]}try{const o=await new Promise((g,d)=>{navigator.geolocation.getCurrentPosition(g,d)}),c=o.coords.latitude,l=o.coords.longitude,[r,f]=await Promise.all([fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${c}&lon=${l}&appid=${e}&units=imperial`).then(g=>g.json()),fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${c}&lon=${l}&appid=${e}&units=imperial`).then(g=>g.json())]),v={current:r,forecast:f,timestamp:Date.now()};return localStorage.setItem(a,JSON.stringify(v)),console.log("Fetched and cached new weather data:",v),[r,f]}catch(o){throw console.error("Fetch error:",o),o}}}}function de(e,i,a,s,t,n){let o=a,c=s,l=t,r=f();function f(){const p=localStorage.getItem("pipeSafeSettings");return p?JSON.parse(p):{humidityThreshold:80,carTempIncrease:0}}const v=(p,m,w,T,y)=>{if(!Number.isFinite(m)||!Number.isFinite(T)||w>=y)return Number.isFinite(m)?m:T;const b=(p-w)/(y-w);return m+(T-m)*b},g=(p,m,w,T,y)=>{if(!p||p.length===0)return Math.random()<.5?'<i class="fa-solid fa-meteor"></i>':'<i class="fa-solid fa-dragon"></i>';const b=p[0],I=b.id,S=b.main.toLowerCase();return I===800?q(m,w,T,y)?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>':I>=801&&I<=804?'<i class="fa-solid fa-cloud"></i>':S.includes("rain")?'<i class="fa-solid fa-cloud-showers-heavy"></i>':S.includes("snow")?'<i class="fa-solid fa-snowflake"></i>':S.includes("thunderstorm")||S.includes("lightning")?'<i class="fa-solid fa-bolt-lightning"></i>':S.includes("wind")?'<i class="fa-solid fa-wind"></i>':S.includes("tornado")||S.includes("tsunami")?'<i class="fa-solid fa-tornado"></i>':S.includes("hurricane")?'<i class="fa-solid fa-hurricane"></i>':'<i class="fa-solid fa-cloud"></i>'},d=p=>Number.isFinite(p)?Math.round(p).toString().padStart(2,"0"):"N/A",h=(p,m,w,T)=>{console.log("WeatherForecast: Updating forecast, currentTemp:",p),i.fetchWeatherData().then(([y,b])=>{if(console.log("WeatherForecast: Forecast fetched:",b),String(b.cod)!=="200"){e.innerHTML="<p>Error: Invalid forecast response.</p>";return}console.log("WeatherForecast: Loaded settings:",r);const I=n.getParkingCondition(),S=y.sys?.sunrise??b.city?.sunrise,M=y.sys?.sunset??b.city?.sunset,L=y.timezone??b.city?.timezone,P=u=>x(u,L,!1),D=u=>x(u,L,!0),C=Math.floor(Date.now()/1e3),B=C+12*3600,$=[{time:"Now",temp:p,humidity:m,weatherIcon:g(y.weather||[],y.dt??C,S,M,L)}],H=(b.list||[]).filter(u=>u.dt<=B+3600&&Number.isFinite(u.main?.temp)&&Number.isFinite(u.main?.humidity)),j=H.filter(u=>u.dt<C).slice(-1),Y=H.filter(u=>u.dt>=C).slice(0,8),N=[...j,...Y];if(N.length<1){e.innerHTML="<p>Error: No valid forecast data.</p>";return}for(let u=1;u<=12;u++){const k=C+u*3600,F=N.slice().reverse().find(K=>K.dt<=k)||N[0],E=N.find(K=>K.dt>=k)||N[N.length-1],X=F.dt===k||Math.abs(F.dt-k)<300?F.main.temp:v(k,F.main.temp,F.dt,E.main.temp,E.dt),Z=F.dt===k||Math.abs(F.dt-k)<300?F.main.humidity:v(k,F.main.humidity,F.dt,E.main.humidity,E.dt),V=q(k,S,M,L),ee=X+U(r.carTempIncrease,I,V);$.push({time:P(k),temp:ee,humidity:Z,weatherIcon:g(F.weather||E.weather||[],k,S,M,L)})}const G=$.slice(1).map((u,k)=>({at:C+(k+1)*3600,interior:u.temp})),Q=oe(p,G,C,D,u=>o(u).status==="not-safe");e.innerHTML=`
          <p class="forecast-summary">${Q}</p>
          <div class="forecast-well">
            ${$.map(u=>`
                <div class="forecast-box">
                  <span class="time">${u.time}</span>
                  <span class="weather-icon">${u.weatherIcon}</span>
                  <span class="temp" style="color: ${c(u.temp)};"><i class="fa-solid fa-temperature-quarter"></i> ${d(u.temp)}°F</span>
                  <span class="humidity" style="color: ${l(u.humidity)};"><i class="fa-solid fa-droplet"></i> ${d(u.humidity)}%</span>
                </div>
              `).join("")}
          </div>
        `}).catch(y=>{console.error("WeatherForecast: Fetch error:",y),e.innerHTML="<p>Error fetching forecast data.</p>"})};return document.addEventListener("settings-changed",p=>{r=p.detail.settings,console.log("WeatherForecast: Settings changed, new settings:",r)}),{updateForecast:h,setSafetyFns(p,m,w){o=p,c=m,l=w}}}"serviceWorker"in navigator&&navigator.serviceWorker.register("/pipe-safe/sw.js").then(e=>{console.log("Service Worker registered with scope:",e.scope)}).catch(e=>{console.error("Service Worker registration failed:",e)});const W=document.querySelector("#app"),J=()=>{const e=localStorage.getItem("weatherApiKey"),i=localStorage.getItem("waiverAccepted");if(console.log("main.ts: renderApp called, apiKey:",!!e,"waiverAccepted:",i),e&&i==="true"){W.innerHTML=`
      <div>
        <h1>PipeSafe</h1>
        <div id='settings-container'></div>
        <div id='info-container'></div>
        <div id='api-key-container'></div>
        <div class="main-content">
          <div id='weather-container'></div>
          <div id='parking-toggle-container'></div>
          <div id='weather-forecast-container'></div>
        </div>
      </div>
    `,R(document.querySelector("#settings-container")),z(document.querySelector("#info-container")),document.querySelector("#api-key-container").innerHTML="";const a=document.querySelector("#parking-toggle-container");let s;try{console.log("main.ts: Initializing parking toggle"),s=ce(a)}catch(r){console.error("main.ts: Failed to initialize parking toggle:",r),W.innerHTML="<p>Error: Unable to initialize parking toggle.</p>";return}const t=le(e),n=document.querySelector("#weather-container"),o=document.querySelector("#weather-forecast-container");console.log("main.ts: Initializing weather forecast");const c=de(o,t,r=>({status:"not-safe",reason:"Placeholder"}),r=>"#888888",r=>"#888888",s);console.log("main.ts: Initializing weather display");const l=re(n,e,s,t,c);c.setSafetyFns(l.checkSafety,l.getTempColor,l.getHumidityColor)}else W.innerHTML=`
      <div>
        <h1>PipeSafe</h1>
        <div id='settings-container'></div>
        <div id='info-container'></div>
        <div id='api-key-container'></div>
        <div class="main-content">
          <div id='weather-container'><p>Please set API key and accept disclaimer to use PipeSafe.</p></div>
          <div id='parking-toggle-container'></div>
          <div id='weather-forecast-container'></div>
        </div>
      </div>
    `,R(document.querySelector("#settings-container")),z(document.querySelector("#info-container")),e?document.querySelector("#api-key-container").innerHTML="":te(document.querySelector("#api-key-container"),J)};ne(W,J);
