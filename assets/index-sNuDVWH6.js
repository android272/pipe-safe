(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const m of i.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&o(m)}).observe(document,{childList:!0,subtree:!0});function a(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(t){if(t.ep)return;t.ep=!0;const i=a(t);fetch(t.href,i)}})();function _(e,r){if(localStorage.getItem("weatherApiKey")){r();return}e.innerHTML=`
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
  `;const o=e.querySelector("#save-api-key"),t=e.querySelector("#api-key-input");o.addEventListener("click",()=>{const i=t.value.trim();i?(localStorage.setItem("weatherApiKey",i),e.innerHTML="",r()):(t.placeholder="API Key cannot be empty",t.value="")})}function K(e,r){if(localStorage.getItem("waiverAccepted")==="true"){r();return}e.innerHTML=`
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
  `;const o=e.querySelector("#accept-waiver"),t=e.querySelector("#decline-waiver");o.addEventListener("click",()=>{localStorage.setItem("waiverAccepted","true"),e.innerHTML="",r()}),t.addEventListener("click",()=>{e.innerHTML="<p>You must accept the disclaimer to use PipeSafe.</p>"})}function O(e,r,a,o,t){let i=p(),m="not-safe";console.log("WeatherDisplay: Loaded settings:",i);function p(){const d=localStorage.getItem("pipeSafeSettings");return d?JSON.parse(d):{humidityThreshold:80,carTempIncrease:0}}const u=(d,h)=>{if(!Number.isFinite(d)||!Number.isFinite(h))return{status:"not-safe",reason:"Invalid data"};const n=Math.round(d),s=Math.round(h),c=i.humidityThreshold;return n<50?{status:"not-safe",reason:`Too cold: ${n}°F`}:n>=85?{status:"not-safe",reason:`Too hot: ${n}°F`}:s<50?{status:"not-safe",reason:`Too dry: ${s}%`}:s>c?{status:"not-safe",reason:`Too humid: ${s}%`}:n>=83&&n<85||n>=50&&n<=52||s>=c-2&&s<=c||s>=50&&s<=52?{status:"warning",reason:"Conditions near unsafe thresholds"}:{status:"safe",reason:"Conditions ideal"}},g=d=>Number.isFinite(d)?Math.round(d).toString().padStart(2,"0"):"N/A",f=d=>{if(!Number.isFinite(d))return"#888888";const h=Math.round(d);return`hsl(${200-(Math.min(Math.max(h,50),85)-50)/35*200}, 70%, 60%)`},w=d=>{if(!Number.isFinite(d))return"#888888";const h=Math.round(d),n=Math.min(Math.max(h,50),i.humidityThreshold),s=30+(n-50)/(i.humidityThreshold-50)*40,c=80-(n-50)/(i.humidityThreshold-50)*40;return`hsl(200, ${s}%, ${c}%)`},D=(d="Not Safe")=>{console.log("WeatherDisplay: Updating weather, scenario:",d),o.fetchWeatherData().then(([h])=>{if(console.log("WeatherDisplay: Current:",h),h.cod!==200){e.innerHTML="<p>Error: Invalid API response.</p>";return}const n=a.getParkingCondition();console.log("WeatherDisplay: Applying parking condition:",n);let s=i.carTempIncrease;n==="shade"&&(s-=5),console.log("WeatherDisplay: Temperature adjustment:",s);const c=Number.isFinite(h.main?.temp)?h.main.temp+s:NaN,v=Number.isFinite(h.main?.humidity)?h.main.humidity:NaN;console.log("WeatherDisplay: Current temp after adjustment:",c);const{status:k,reason:N}=u(c,v);m=k;const F=f(c),T=w(v),W=k==="safe"?"/pipe-safe/safe.svg":k==="warning"?"/pipe-safe/warning.svg":N==="Invalid data"?"/pipe-safe/error.svg":"/pipe-safe/not-safe.svg",L=k==="safe"||k==="warning";e.innerHTML=`
          
          <div class="current-weather">
            <div class="weather-item">
              <span class="label">Temperature</span>
              <span class="value" style="color: ${F};"><i class="fa-solid fa-temperature-quarter"></i> ${g(c)}°F</span>
            </div>
            <div class="weather-item">
              <span class="label">Humidity</span>
              <span class="value" style="color: ${T};"><i class="fa-solid fa-droplet"></i> ${g(v)}%</span>
            </div>
          </div>
          <img class="safety-image" src="${W}" alt="${k}">
          <p class="reason">Reason: ${N}</p>
        `,t.updateForecast(c,v,L,m)}).catch(h=>{console.error("WeatherDisplay: Fetch error:",h),e.innerHTML="<p>Error fetching weather data.</p>"})};return document.addEventListener("parking-changed",d=>{console.log("WeatherDisplay: Parking changed event received:",d.detail.parkingCondition),D(localStorage.getItem("testScenario")||"Not Safe")}),document.addEventListener("settings-changed",d=>{i=d.detail.settings,console.log("WeatherDisplay: Settings changed, new settings:",i),D(localStorage.getItem("testScenario")||"Not Safe")}),D(),{checkSafety:u,getTempColor:f,getHumidityColor:w,get currentStatus(){return m}}}function E(e){e.innerHTML=`
    <button class="info-button"><i class="fa-solid fa-info"></i></button>
    <div class="modal" id="infoModal">
      <div class="modal-content">
        <h1>About PipeSafe</h1>
        <p class="info-text">PipeSafe helps you determine if it's safe to leave pipes, tobacco, or cigars in your car based on weather conditions.</p>
        <h2>Temperature</h2>
        <p class="info-text">When too high, temperature can cause heat damage or cracking in pipes and dry out or burn tobacco. When too low, it may lead to brittleness or cracking in pipes and make tobacco excessively dry.</p>
        <h2>Humidity</h2>
        <p class="info-text">When too high, humidity promotes mold growth or material degradation, such as wood swelling in pipes. When too low, it can dry out tobacco or pipe materials, resulting in fragility or cracking.</p>
        <h2>Car</h2>
        <p class="info-text">Cars heat up fast, temps may rise 10-20°F inside. So Park in the shade if you can.</p>
        <button id="close-info">Close</button>
      </div>
    </div>
  `;const r=e.querySelector(".modal"),a=e.querySelector(".info-button"),o=e.querySelector("#close-info"),t=()=>{r.classList.remove("active")};a.addEventListener("click",()=>{r.classList.add("active")}),o.addEventListener("click",t),document.addEventListener("keydown",i=>{i.key==="Escape"&&r.classList.contains("active")&&t()}),r.addEventListener("click",i=>{i.target===r&&t()})}function H(e){const r=localStorage.getItem("pipeSafeSettings"),a=r?JSON.parse(r):{humidityThreshold:80,carTempIncrease:0};console.log("SettingsModal: Loaded settings:",a),e.innerHTML=`
    <button class="settings-button"><i class="fa-solid fa-gear"></i></button>
    <div class="modal" id="settingsModal">
      <div class="modal-content">
        <h2>Settings</h2>
        <div class="settings-group">
          <h3>Humidity Threshold</h3>
          <div class="radio-group">
            <label><input type="radio" name="humidity-threshold" value="80" ${a.humidityThreshold===80?"checked":""}> 80%</label>
            <label><input type="radio" name="humidity-threshold" value="85" ${a.humidityThreshold===85?"checked":""}> 85%</label>
            <label><input type="radio" name="humidity-threshold" value="90" ${a.humidityThreshold===90?"checked":""}> 90%</label>
            <label><input type="radio" name="humidity-threshold" value="95" ${a.humidityThreshold===95?"checked":""}> 95%</label>
          </div>
        </div>
        <div class="settings-group">
          <h3>Car Temperature</h3>
          <div class="radio-group">
            <label><input type="radio" name="car-temp-increase" value="0" ${a.carTempIncrease===0?"checked":""}> +0°F</label>
            <label><input type="radio" name="car-temp-increase" value="10" ${a.carTempIncrease===10?"checked":""}> +10°F</label>
            <label><input type="radio" name="car-temp-increase" value="20" ${a.carTempIncrease===20?"checked":""}> +20°F</label>
          </div>
        </div>
        <button id="save-settings">Save</button>
        <button id="close-settings">Close</button>
      </div>
    </div>
  `;const o=e.querySelector(".modal"),t=e.querySelector(".settings-button"),i=e.querySelector("#close-settings"),m=e.querySelector("#save-settings"),p=()=>{o.classList.remove("active")};t.addEventListener("click",()=>{o.classList.add("active")}),i.addEventListener("click",p),document.addEventListener("keydown",u=>{u.key==="Escape"&&o.classList.contains("active")&&p()}),o.addEventListener("click",u=>{u.target===o&&p()}),m.addEventListener("click",()=>{const u=parseInt(e.querySelector('input[name="humidity-threshold"]:checked')?.value||"80"),g=parseInt(e.querySelector('input[name="car-temp-increase"]:checked')?.value||"0"),f={humidityThreshold:u,carTempIncrease:g};console.log("SettingsModal: Saving settings:",f),localStorage.setItem("pipeSafeSettings",JSON.stringify(f));const w=new CustomEvent("settings-changed",{detail:{settings:f}});document.dispatchEvent(w),console.log("SettingsModal: Dispatched settings-changed"),p()})}function B(e){if(!e)throw console.error("ParkingToggle: Container not found!"),new Error("Parking toggle container not found");let a=localStorage.getItem("parkingStorageItem")||"open",o=t();function t(){const p=localStorage.getItem("pipeSafeSettings");return p?JSON.parse(p):{carTempIncrease:0}}const i=()=>o.carTempIncrease===0?a==="shade"?"Temperature Adjusted for Shade (-5°F)":"Cars heat up fast, temps may rise 10-20°F inside.":`Temperature Estimated for Car (${a==="shade"?`+${o.carTempIncrease-5}°F`:`+${o.carTempIncrease}°F`})`,m=()=>{const p=i();e.innerHTML=`
      <h2>Where Did You Park?</h2>
      <div class='parking-toggle-well'>
        <div class='parking-toggle-container'>
          <div class='parking-option shade ${a==="shade"?"active":""}'>
            <i class='fa-solid fa-umbrella-beach'></i>
            <span>In Shade</span>
          </div>
          <div class='parking-toggle'>
            <input type='checkbox' id='parking-toggle' ${a==="open"?"checked":""}>
            <label for='parking-toggle'><i class='fa-solid fa-car-side'></i></label>
          </div>
          <div class='parking-option open ${a==="open"?"active":""}'>
            <i class='fa-solid fa-sun'></i>
            <span>In Open</span>
          </div>
        </div>
      </div>
      <p class="car-warning">${p}</p>
    `;const u=e.querySelector("#parking-toggle"),g=e.querySelector(".parking-toggle-container");g&&u?g.addEventListener("click",f=>{f.preventDefault(),u.checked=!u.checked,a=u.checked?"open":"shade",console.log("ParkingToggle: Changed to:",a),localStorage.setItem("parkingStorageItem",a),m();const w=new CustomEvent("parking-changed",{detail:{parkingCondition:a}});console.log("ParkingToggle: Dispatching parking-changed event:",w),document.dispatchEvent(w)}):console.error("ParkingToggle: Toggle input or container not found!")};return document.addEventListener("settings-changed",p=>{o=p.detail.settings,console.log("ParkingToggle: Settings changed, new settings:",o),m()}),m(),{getParkingCondition:()=>(console.log("ParkingToggle: getParkingCondition called, returning:",a),a)}}const j={Safe:{current:{cod:200,main:{temp:65,humidity:50}},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:76,humidity:69},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:77,humidity:68},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:78,humidity:67},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:84,humidity:78},dt_txt:""}]}},Warning:{current:{cod:200,main:{temp:83,humidity:78}},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:84,humidity:79},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:85,humidity:80},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:75,humidity:70},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:74,humidity:69},dt_txt:""}]}},"Not Safe":{current:{cod:200,main:{temp:77,humidity:86}},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:78,humidity:85},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:79,humidity:84},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:80,humidity:83},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:75,humidity:70},dt_txt:""}]}},"All Safe":{current:{cod:200,main:{temp:70,humidity:65}},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:71,humidity:64},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:72,humidity:63},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:73,humidity:62},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:74,humidity:61},dt_txt:""}]}},"All Not Safe":{current:{cod:200,main:{temp:90,humidity:90}},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:91,humidity:89},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:92,humidity:88},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:93,humidity:87},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:94,humidity:86},dt_txt:""}]}},"Invalid Data":{current:{cod:200,main:{temp:NaN,humidity:NaN}},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:NaN,humidity:NaN},dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:75,humidity:70},dt_txt:""}]}}};function z(e,r){return{fetchWeatherData:async()=>{{const o=localStorage.getItem("testScenario")||"Not Safe";console.log("Fetching test scenario:",o);const t=j[o];return t?Promise.resolve([t.current,t.forecast]):(console.error("Invalid test scenario:",o),Promise.reject(new Error("Invalid test scenario")))}}}}function q(e,r,a,o,t,i){let m=0,p=0,u=!1,g="not-safe",f=w();function w(){const n=localStorage.getItem("pipeSafeSettings");return n?JSON.parse(n):{humidityThreshold:80,carTempIncrease:0}}const D=(n,s,c)=>{if(!Number.isFinite(s.temp)||!Number.isFinite(c.temp)||!Number.isFinite(s.humidity)||!Number.isFinite(c.humidity)||s.dt>=c.dt)return{time:new Date(n*1e3).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),temp:s.temp||c.temp||0,humidity:s.humidity||c.humidity||0};const v=(n-s.dt)/(c.dt-s.dt);return{time:new Date(n*1e3).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),temp:Math.round(s.temp+(c.temp-s.temp)*v),humidity:Math.round(s.humidity+(c.humidity-s.humidity)*v)}},d=n=>Number.isFinite(n)?Math.round(n).toString().padStart(2,"0"):"N/A",h=(n,s,c,v)=>{m=n,p=s,u=c,g=v,console.log("WeatherForecast: Updating forecast, currentTemp:",n),r.fetchWeatherData().then(([k,N])=>{console.log("WeatherForecast: Forecast fetched:",N),console.log("WeatherForecast: Loaded settings:",f);const F=i.getParkingCondition();console.log("WeatherForecast: Applying parking condition:",F);let T=f.carTempIncrease;F==="shade"&&(T-=5),console.log("WeatherForecast: Temperature adjustment:",T);const L=Math.floor(new Date().getTime()/1e3),A=L+12*3600,M=[{time:"Now</br></br>",temp:n,humidity:s}],I=(N.list||[]).filter(l=>l.dt>=L&&l.dt<=A+3600&&Number.isFinite(l.main?.temp)&&Number.isFinite(l.main?.humidity)).slice(0,7);if(I.length<1){e.innerHTML="<p>Error: No valid forecast data.</p>";return}for(let l=1;l<=12;l++){const S=L+l*3600,y=I.slice().reverse().find(b=>b.dt<=S)||I[0],P=I.find(b=>b.dt>=S)||I[I.length-1];if(!y||!P){M.push({time:new Date(S*1e3).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),temp:n,humidity:s});continue}if(y.dt===S||Math.abs(y.dt-S)<300)M.push({time:new Date(y.dt*1e3).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),temp:y.main.temp+T,humidity:y.main.humidity});else{const b=D(S,{dt:y.dt,temp:y.main.temp+T,humidity:y.main.humidity},{dt:P.dt,temp:P.main.temp+T,humidity:P.main.humidity});M.push(b)}}let $="";if(M.slice(1).every(l=>a(l.temp,l.humidity).status===(c?v:"not-safe")))$=c?"Safe all day!":"Not safe all day!";else for(let l=1;l<M.length;l++){const S=M[l],y=a(S.temp,S.humidity).status;if((y==="safe"||y==="warning")!==c){const b=new Date(L*1e3+l*3600);$=c?`Safe until ${b.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`:`Not safe until ${b.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`;break}}e.innerHTML=`
          <p class="forecast-summary">${$}</p>
          <div class="forecast-well">
            ${M.map(l=>`
                <div class="forecast-box">
                  <span class="time">${l.time}</span>
                  <span class="temp" style="color: ${o(l.temp)};"><i class="fa-solid fa-temperature-quarter"></i> ${d(l.temp)}°F</span>
                  <span class="humidity" style="color: ${t(l.humidity)};"><i class="fa-solid fa-droplet"></i> ${d(l.humidity)}%</span>
                </div>
              `).join("")}
          </div>
        `}).catch(k=>{console.error("WeatherForecast: Fetch error:",k),e.innerHTML="<p>Error fetching forecast data.</p>"})};return document.addEventListener("parking-changed",n=>{console.log("WeatherForecast: Parking changed event received:",n.detail.parkingCondition),h(m,p,u,g)}),document.addEventListener("settings-changed",n=>{f=n.detail.settings,console.log("WeatherForecast: Settings changed, new settings:",f),h(m,p,u,g)}),{updateForecast:h}}const C=document.querySelector("#app"),x=()=>{const e=localStorage.getItem("weatherApiKey"),r=localStorage.getItem("waiverAccepted");if(console.log("main.ts: renderApp called, apiKey:",!!e,"waiverAccepted:",r),e&&r==="true"){C.innerHTML=`
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
    `,H(document.querySelector("#settings-container")),E(document.querySelector("#info-container")),document.querySelector("#api-key-container").innerHTML="";const a=document.querySelector("#parking-toggle-container");let o;try{console.log("main.ts: Initializing parking toggle"),o=B(a)}catch(g){console.error("main.ts: Failed to initialize parking toggle:",g),C.innerHTML="<p>Error: Unable to initialize parking toggle.</p>";return}const t=z(),i=document.querySelector("#weather-container"),m=document.querySelector("#weather-forecast-container");console.log("main.ts: Initializing weather forecast");const p=q(m,t,(g,f)=>({status:"not-safe",reason:"Placeholder"}),g=>"#888888",g=>"#888888",o);console.log("main.ts: Initializing weather display");const u=O(i,e,o,t,p);console.log("main.ts: Updating weather forecast with display functions"),q(m,t,u.checkSafety,u.getTempColor,u.getHumidityColor,o)}else C.innerHTML=`
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
    `,H(document.querySelector("#settings-container")),E(document.querySelector("#info-container")),e?document.querySelector("#api-key-container").innerHTML="":_(document.querySelector("#api-key-container"),x)};K(C,x);
