(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const p of i.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&n(p)}).observe(document,{childList:!0,subtree:!0});function a(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(t){if(t.ep)return;t.ep=!0;const i=a(t);fetch(t.href,i)}})();function K(e,s){if(localStorage.getItem("weatherApiKey")){s();return}e.innerHTML=`
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
  `;const n=e.querySelector("#save-api-key"),t=e.querySelector("#api-key-input");n.addEventListener("click",()=>{const i=t.value.trim();i?(localStorage.setItem("weatherApiKey",i),e.innerHTML="",s()):(t.placeholder="API Key cannot be empty",t.value="")})}function O(e,s){if(localStorage.getItem("waiverAccepted")==="true"){s();return}e.innerHTML=`
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
  `;const n=e.querySelector("#accept-waiver"),t=e.querySelector("#decline-waiver");n.addEventListener("click",()=>{localStorage.setItem("waiverAccepted","true"),e.innerHTML="",s()}),t.addEventListener("click",()=>{e.innerHTML="<p>You must accept the disclaimer to use PipeSafe.</p>"})}function j(e,s,a,n,t){let i=g(),p="not-safe";console.log("WeatherDisplay: Loaded settings:",i);function g(){const c=localStorage.getItem("pipeSafeSettings");return c?JSON.parse(c):{humidityThreshold:80,carTempIncrease:0}}const m=c=>{if(!Number.isFinite(c))return{status:"not-safe",reason:"Invalid data"};const d=Math.round(c);return d<50?{status:"not-safe",reason:`Too cold: ${d}°F`}:d>=85?{status:"not-safe",reason:`Too hot: ${d}°F`}:d>=83&&d<85?{status:"warning",reason:"Temperature near unsafe threshold"}:d>=50&&d<=52?{status:"warning",reason:"Temperature near unsafe threshold"}:{status:"safe",reason:"Conditions ideal"}},f=c=>Number.isFinite(c)?Math.round(c).toString().padStart(2,"0"):"N/A",v=c=>{if(!Number.isFinite(c))return"#888888";const d=Math.round(c);return`hsl(${200-(Math.min(Math.max(d,50),85)-50)/35*200}, 70%, 60%)`},S=c=>{if(!Number.isFinite(c))return"#888888";const d=Math.round(c),w=Math.min(Math.max(d,50),i.humidityThreshold),o=30+(w-50)/(i.humidityThreshold-50)*40,r=80-(w-50)/(i.humidityThreshold-50)*40;return`hsl(200, ${o}%, ${r}%)`},D=(c="Not Safe")=>{console.log("WeatherDisplay: Updating weather, scenario:",c),n.fetchWeatherData().then(([d])=>{if(console.log("WeatherDisplay: Current:",d),d.cod!==200){e.innerHTML="<p>Error: Invalid API response.</p>";return}const w=a.getParkingCondition();console.log("WeatherDisplay: Applying parking condition:",w);let o=i.carTempIncrease;w==="shade"&&(o-=5),console.log("WeatherDisplay: Temperature adjustment:",o);const r=Number.isFinite(d.main?.temp)?d.main.temp+o:NaN,l=Number.isFinite(d.main?.humidity)?d.main.humidity:NaN;console.log("WeatherDisplay: Current temp after adjustment:",r);const{status:h,reason:C}=m(r);p=h;const P=v(r),F=S(l),T=h==="safe"?"/pipe-safe/safe.svg":h==="warning"?"/pipe-safe/warning.svg":C==="Invalid data"?"/pipe-safe/error.svg":"/pipe-safe/not-safe.svg",E=h==="safe"||h==="warning";e.innerHTML=`
          
          <div class="current-weather">
            <div class="weather-item">
              <span class="label">Temperature</span>
              <span class="value" style="color: ${P};"><i class="fa-solid fa-temperature-quarter"></i> ${f(r)}°F</span>
            </div>
            <div class="weather-item">
              <span class="label">Humidity</span>
              <span class="value" style="color: ${F};"><i class="fa-solid fa-droplet"></i> ${f(l)}%</span>
            </div>
          </div>
          <img class="safety-image" src="${T}" alt="${h}">
          <p class="reason">Reason: ${C}</p>
        `,t.updateForecast(r,l,E,p)}).catch(d=>{console.error("WeatherDisplay: Fetch error:",d),e.innerHTML="<p>Error fetching weather data.</p>"})};return document.addEventListener("parking-changed",c=>{console.log("WeatherDisplay: Parking changed event received:",c.detail.parkingCondition),D(localStorage.getItem("testScenario")||"Not Safe")}),document.addEventListener("settings-changed",c=>{i=c.detail.settings,console.log("WeatherDisplay: Settings changed, new settings:",i),D(localStorage.getItem("testScenario")||"Not Safe")}),D(),{checkSafety:m,getTempColor:v,getHumidityColor:S,get currentStatus(){return p}}}function q(e){e.innerHTML=`
    <button class="info-button"><i class="fa-solid fa-info"></i></button>
    <div class="modal" id="infoModal">
      <div class="modal-content">
        <h1>About PipeSafe</h1>
        <p class="info-text">PipeSafe helps you determine if it’s safe to leave pipes, tobacco, or cigars in your car for up to 12 hours based on temperature.</p>
        <h2>Temperature</h2>
        <p class="info-text">Pipes, pipe tobacco, and cigars are sensitive to temperature extremes. Ideally, keep them between 59-70°F. High temperatures (>70°F) can dry out tobacco and cigars, affecting flavor, or cause pipes to warp or crack. Low temperatures (<59°F) may make pipes brittle or dry out tobacco and cigars, impacting quality.</p>
        <h2>Humidity</h2>
        <p class="info-text">Humidity is not a major concern for short-term car storage (up to 12 hours) and is not factored into PipeSafe’s safety calculations. For long-term storage, consider humidity to prevent drying or excess moisture.</p>
        <h2>Car</h2>
        <p class="info-text">Cars heat up quickly, with interior temperatures rising 20-40°F above outside conditions in sunlight. Park in the shade and use sunshades to keep temperatures closer to safe ranges.</p>
        <button id="close-info">Close</button>
      </div>
    </div>
  `;const s=e.querySelector(".modal"),a=e.querySelector(".info-button"),n=e.querySelector("#close-info"),t=()=>{s.classList.remove("active")};a.addEventListener("click",()=>{s.classList.add("active")}),n.addEventListener("click",t),document.addEventListener("keydown",i=>{i.key==="Escape"&&s.classList.contains("active")&&t()}),s.addEventListener("click",i=>{i.target===s&&t()})}function H(e){const s=localStorage.getItem("pipeSafeSettings"),a=s?JSON.parse(s):{humidityThreshold:80,carTempIncrease:0};console.log("SettingsModal: Loaded settings:",a),e.innerHTML=`
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
  `;const n=e.querySelector(".modal"),t=e.querySelector(".settings-button"),i=e.querySelector("#close-settings"),p=e.querySelector("#save-settings"),g=()=>{n.classList.remove("active")};t.addEventListener("click",()=>{n.classList.add("active")}),i.addEventListener("click",g),document.addEventListener("keydown",m=>{m.key==="Escape"&&n.classList.contains("active")&&g()}),n.addEventListener("click",m=>{m.target===n&&g()}),p.addEventListener("click",()=>{const m=parseInt(e.querySelector('input[name="humidity-threshold"]:checked')?.value||"80"),f=parseInt(e.querySelector('input[name="car-temp-increase"]:checked')?.value||"0"),v={humidityThreshold:m,carTempIncrease:f};console.log("SettingsModal: Saving settings:",v),localStorage.setItem("pipeSafeSettings",JSON.stringify(v));const S=new CustomEvent("settings-changed",{detail:{settings:v}});document.dispatchEvent(S),console.log("SettingsModal: Dispatched settings-changed"),g()})}function B(e){if(!e)throw console.error("ParkingToggle: Container not found!"),new Error("Parking toggle container not found");let a=localStorage.getItem("parkingStorageItem")||"open",n=t();function t(){const g=localStorage.getItem("pipeSafeSettings");return g?JSON.parse(g):{carTempIncrease:0}}const i=()=>n.carTempIncrease===0?a==="shade"?"Temperature Adjusted for Shade (-5°F)":"Cars heat up fast, temps may rise 10-20°F inside.":`Temperature Estimated for Car (${a==="shade"?`+${n.carTempIncrease-5}°F`:`+${n.carTempIncrease}°F`})`,p=()=>{const g=i();e.innerHTML=`
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
      <p class="car-warning">${g}</p>
    `;const m=e.querySelector("#parking-toggle"),f=e.querySelector(".parking-toggle-container");f&&m?f.addEventListener("click",v=>{v.preventDefault(),m.checked=!m.checked,a=m.checked?"open":"shade",console.log("ParkingToggle: Changed to:",a),localStorage.setItem("parkingStorageItem",a),p();const S=new CustomEvent("parking-changed",{detail:{parkingCondition:a}});console.log("ParkingToggle: Dispatching parking-changed event:",S),document.dispatchEvent(S)}):console.error("ParkingToggle: Toggle input or container not found!")};return document.addEventListener("settings-changed",g=>{n=g.detail.settings,console.log("ParkingToggle: Settings changed, new settings:",n),p()}),p(),{getParkingCondition:()=>(console.log("ParkingToggle: getParkingCondition called, returning:",a),a)}}const z={Safe:{current:{cod:200,main:{temp:65,humidity:50},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:76,humidity:69},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:77,humidity:68},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:78,humidity:67},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:84,humidity:78},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},Warning:{current:{cod:200,main:{temp:83,humidity:78},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:84,humidity:79},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:85,humidity:80},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:75,humidity:70},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:74,humidity:69},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"Not Safe":{current:{cod:200,main:{temp:77,humidity:86},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:78,humidity:85},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:79,humidity:84},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:80,humidity:83},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:75,humidity:70},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"All Safe":{current:{cod:200,main:{temp:70,humidity:65},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:71,humidity:64},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:72,humidity:63},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:73,humidity:62},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:74,humidity:61},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"All Not Safe":{current:{cod:200,main:{temp:90,humidity:90},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:91,humidity:89},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:92,humidity:88},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:93,humidity:87},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:94,humidity:86},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"Invalid Data":{current:{cod:200,main:{temp:NaN,humidity:NaN},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:NaN,humidity:NaN},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:75,humidity:70},weather:[{id:800,main:"Clear"}],dt_txt:""}]}}};function J(e,s){return{fetchWeatherData:async()=>{{const n=localStorage.getItem("testScenario")||"Not Safe";console.log("Fetching test scenario:",n);const t=z[n];return t?Promise.resolve([t.current,t.forecast]):(console.error("Invalid test scenario:",n),Promise.reject(new Error("Invalid test scenario")))}}}}function x(e,s,a,n,t,i){let p=0,g=0,m=!1,f="not-safe",v=S();function S(){const o=localStorage.getItem("pipeSafeSettings");return o?JSON.parse(o):{humidityThreshold:80,carTempIncrease:0}}const D=(o,r,l)=>{if(!Number.isFinite(r.temp)||!Number.isFinite(l.temp)||!Number.isFinite(r.humidity)||!Number.isFinite(l.humidity)||r.dt>=l.dt)return{time:new Date(o*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:r.temp||l.temp||0,humidity:r.humidity||l.humidity||0,weatherIcon:c(r.weather||[])};const h=(o-r.dt)/(l.dt-r.dt);return{time:new Date(o*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:Math.round(r.temp+(l.temp-r.temp)*h),humidity:Math.round(r.humidity+(l.humidity-r.humidity)*h),weatherIcon:c(r.weather||[])}},c=o=>{if(!o||o.length===0)return Math.random()<.5?'<i class="fa-solid fa-meteor"></i>':'<i class="fa-solid fa-dragon"></i>';const r=o[0],l=r.id,h=r.main.toLowerCase();return l===800?'<i class="fa-solid fa-sun"></i>':l>=801&&l<=804?'<i class="fa-solid fa-cloud"></i>':h.includes("rain")?'<i class="fa-solid fa-cloud-showers-heavy"></i>':h.includes("snow")?'<i class="fa-solid fa-snowflake"></i>':h.includes("thunderstorm")||h.includes("lightning")?'<i class="fa-solid fa-bolt-lightning"></i>':h.includes("wind")?'<i class="fa-solid fa-wind"></i>':h.includes("tornado")||h.includes("tsunami")?'<i class="fa-solid fa-tornado"></i>':h.includes("hurricane")?'<i class="fa-solid fa-hurricane"></i>':'<i class="fa-solid fa-cloud"></i>'},d=o=>Number.isFinite(o)?Math.round(o).toString().padStart(2,"0"):"N/A",w=(o,r,l,h)=>{p=o,g=r,m=l,f=h,console.log("WeatherForecast: Updating forecast, currentTemp:",o),s.fetchWeatherData().then(([C,P])=>{console.log("WeatherForecast: Forecast fetched:",P),console.log("WeatherForecast: Loaded settings:",v);const F=i.getParkingCondition();console.log("WeatherForecast: Applying parking condition:",F);let T=v.carTempIncrease;F==="shade"&&(T-=5),console.log("WeatherForecast: Temperature adjustment:",T);const N=Math.floor(new Date().getTime()/1e3),_=N+12*3600,M=[{time:"Now",temp:o,humidity:r,weatherIcon:c(C.weather||[])}],I=(P.list||[]).filter(u=>u.dt>=N&&u.dt<=_+3600&&Number.isFinite(u.main?.temp)&&Number.isFinite(u.main?.humidity)).slice(0,7);if(I.length<1){e.innerHTML="<p>Error: No valid forecast data.</p>";return}for(let u=1;u<=12;u++){const k=N+u*3600,y=I.slice().reverse().find(b=>b.dt<=k)||I[0],L=I.find(b=>b.dt>=k)||I[I.length-1];if(!y||!L){M.push({time:new Date(k*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:o,humidity:r,weatherIcon:c(y?.weather||[])});continue}if(y.dt===k||Math.abs(y.dt-k)<300)M.push({time:new Date(y.dt*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:y.main.temp+T,humidity:y.main.humidity,weatherIcon:c(y.weather||[])});else{const b=D(k,{dt:y.dt,temp:y.main.temp+T,humidity:y.main.humidity,weather:y.weather},{dt:L.dt,temp:L.main.temp+T,humidity:L.main.humidity,weather:L.weather});M.push(b)}}let $="";if(M.slice(1).every(u=>a(u.temp).status===(l?h:"not-safe")))$=l?"Safe all day!":"Not safe all day!";else for(let u=1;u<M.length;u++){const k=M[u],y=a(k.temp).status;if((y==="safe"||y==="warning")!==l){const b=new Date(N*1e3+u*3600);$=l?`Safe until ${b.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`:`Not safe until ${b.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`;break}}e.innerHTML=`
          <p class="forecast-summary">${$}</p>
          <div class="forecast-well">
            ${M.map(u=>`
                <div class="forecast-box">
                  <span class="time">${u.time}</span>
                  <span class="weather-icon">${u.weatherIcon}</span>
                  <span class="temp" style="color: ${n(u.temp)};"><i class="fa-solid fa-temperature-quarter"></i> ${d(u.temp)}°F</span>
                  <span class="humidity" style="color: ${t(u.humidity)};"><i class="fa-solid fa-droplet"></i> ${d(u.humidity)}%</span>
                </div>
              `).join("")}
          </div>
        `}).catch(C=>{console.error("WeatherForecast: Fetch error:",C),e.innerHTML="<p>Error fetching forecast data.</p>"})};return document.addEventListener("parking-changed",o=>{console.log("WeatherForecast: Parking changed event received:",o.detail.parkingCondition),w(p,g,m,f)}),document.addEventListener("settings-changed",o=>{v=o.detail.settings,console.log("WeatherForecast: Settings changed, new settings:",v),w(p,g,m,f)}),{updateForecast:w}}"serviceWorker"in navigator&&navigator.serviceWorker.register("/pipe-safe/sw.js").then(e=>{console.log("Service Worker registered with scope:",e.scope)}).catch(e=>{console.error("Service Worker registration failed:",e)});const W=document.querySelector("#app"),A=()=>{const e=localStorage.getItem("weatherApiKey"),s=localStorage.getItem("waiverAccepted");if(console.log("main.ts: renderApp called, apiKey:",!!e,"waiverAccepted:",s),e&&s==="true"){W.innerHTML=`
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
    `,H(document.querySelector("#settings-container")),q(document.querySelector("#info-container")),document.querySelector("#api-key-container").innerHTML="";const a=document.querySelector("#parking-toggle-container");let n;try{console.log("main.ts: Initializing parking toggle"),n=B(a)}catch(f){console.error("main.ts: Failed to initialize parking toggle:",f),W.innerHTML="<p>Error: Unable to initialize parking toggle.</p>";return}const t=J(),i=document.querySelector("#weather-container"),p=document.querySelector("#weather-forecast-container");console.log("main.ts: Initializing weather forecast");const g=x(p,t,f=>({status:"not-safe",reason:"Placeholder"}),f=>"#888888",f=>"#888888",n);console.log("main.ts: Initializing weather display");const m=j(i,e,n,t,g);console.log("main.ts: Updating weather forecast with display functions"),x(p,t,m.checkSafety,m.getTempColor,m.getHumidityColor,n)}else W.innerHTML=`
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
    `,H(document.querySelector("#settings-container")),q(document.querySelector("#info-container")),e?document.querySelector("#api-key-container").innerHTML="":K(document.querySelector("#api-key-container"),A)};O(W,A);
