(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const m of a.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&i(m)}).observe(document,{childList:!0,subtree:!0});function n(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(t){if(t.ep)return;t.ep=!0;const a=n(t);fetch(t.href,a)}})();function K(e,s){if(localStorage.getItem("weatherApiKey")){s();return}e.innerHTML=`
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
  `;const i=e.querySelector("#save-api-key"),t=e.querySelector("#api-key-input");i.addEventListener("click",()=>{const a=t.value.trim();a?(localStorage.setItem("weatherApiKey",a),e.innerHTML="",s()):(t.placeholder="API Key cannot be empty",t.value="")})}function O(e,s){if(localStorage.getItem("waiverAccepted")==="true"){s();return}e.innerHTML=`
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
  `;const i=e.querySelector("#accept-waiver"),t=e.querySelector("#decline-waiver");i.addEventListener("click",()=>{localStorage.setItem("waiverAccepted","true"),e.innerHTML="",s()}),t.addEventListener("click",()=>{e.innerHTML="<p>You must accept the disclaimer to use PipeSafe.</p>"})}function B(e,s,n,i,t){let a=h(),m="not-safe";console.log("WeatherDisplay: Loaded settings:",a);function h(){const c=localStorage.getItem("pipeSafeSettings");return c?JSON.parse(c):{humidityThreshold:80,carTempIncrease:0}}const p=c=>{if(!Number.isFinite(c))return{status:"not-safe",reason:"Invalid data"};const d=Math.round(c);return d<50?{status:"not-safe",reason:`Too cold: ${d}°F`}:d>=90?{status:"not-safe",reason:`Too hot: ${d}°F`}:d>=75&&d<=90?{status:"warning",reason:"Temperature near unsafe threshold"}:d>=50&&d<=65?{status:"warning",reason:"Temperature near unsafe threshold"}:{status:"safe",reason:"Conditions ideal"}},g=c=>Number.isFinite(c)?Math.round(c).toString().padStart(2,"0"):"N/A",w=c=>{if(!Number.isFinite(c))return"#888888";const d=Math.round(c);return`hsl(${200-(Math.min(Math.max(d,50),85)-50)/35*200}, 70%, 60%)`},T=c=>{if(!Number.isFinite(c))return"#888888";const d=Math.round(c),S=Math.min(Math.max(d,50),a.humidityThreshold),o=30+(S-50)/(a.humidityThreshold-50)*40,r=80-(S-50)/(a.humidityThreshold-50)*40;return`hsl(200, ${o}%, ${r}%)`},F=(c="Not Safe")=>{console.log("WeatherDisplay: Updating weather, scenario:",c),i.fetchWeatherData().then(([d])=>{if(console.log("WeatherDisplay: Current:",d),d.cod!==200){e.innerHTML="<p>Error: Invalid API response.</p>";return}const S=n.getParkingCondition();console.log("WeatherDisplay: Applying parking condition:",S);let o=a.carTempIncrease;S==="shade"&&(o-=5),console.log("WeatherDisplay: Temperature adjustment:",o);const r=Number.isFinite(d.main?.temp)?d.main.temp+o:NaN,u=Number.isFinite(d.main?.humidity)?d.main.humidity:NaN;console.log("WeatherDisplay: Current temp after adjustment:",r);const{status:f,reason:v}=p(r);m=f;const P=w(r),M=T(u),C=f==="safe"?"/pipe-safe/safe.svg":f==="warning"?"/pipe-safe/warning.svg":v==="Invalid data"?"/pipe-safe/error.svg":"/pipe-safe/not-safe.svg",$=f==="safe"||f==="warning";e.innerHTML=`
          
          <div class="current-weather">
            <div class="weather-item">
              <span class="label">Temperature</span>
              <span class="value" style="color: ${P};"><i class="fa-solid fa-temperature-quarter"></i> ${g(r)}°F</span>
            </div>
            <div class="weather-item">
              <span class="label">Humidity</span>
              <span class="value" style="color: ${M};"><i class="fa-solid fa-droplet"></i> ${g(u)}%</span>
            </div>
          </div>
          <img class="safety-image" src="${C}" alt="${f}">
          <p class="reason">Reason: ${v}</p>
        `,t.updateForecast(r,u,$,m)}).catch(d=>{console.error("WeatherDisplay: Fetch error:",d),e.innerHTML="<p>Error fetching weather data.</p>"})};return document.addEventListener("parking-changed",c=>{console.log("WeatherDisplay: Parking changed event received:",c.detail.parkingCondition),F(localStorage.getItem("testScenario")||"Not Safe")}),document.addEventListener("settings-changed",c=>{a=c.detail.settings,console.log("WeatherDisplay: Settings changed, new settings:",a),F(localStorage.getItem("testScenario")||"Not Safe")}),F(),{checkSafety:p,getTempColor:w,getHumidityColor:T,get currentStatus(){return m}}}function q(e){e.innerHTML=`
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
        <p class="info-text">Cars heat up quickly, with interior temperatures rising 20-40°F above outside conditions in sunlight. Park in the shade and use sunshades to keep temperatures closer to safe ranges. Use sturdy, vented containers to avoid pressure buildup in warm conditions.</p>
        
        <button id="close-info">Close</button>
      </div>
    </div>
  `;const s=e.querySelector(".modal"),n=e.querySelector(".info-button"),i=e.querySelector("#close-info"),t=()=>{s.classList.remove("active")};n.addEventListener("click",()=>{s.classList.add("active")}),i.addEventListener("click",t),document.addEventListener("keydown",a=>{a.key==="Escape"&&s.classList.contains("active")&&t()}),s.addEventListener("click",a=>{a.target===s&&t()})}function x(e){const s=localStorage.getItem("pipeSafeSettings"),n=s?JSON.parse(s):{carTempIncrease:0};console.log("SettingsModal: Loaded settings:",n),e.innerHTML=`
    <button class="settings-button"><i class="fa-solid fa-gear"></i></button>
    <div class="modal" id="settingsModal">
        <div class="modal-content">
            <h2>Settings</h2>
            <div class="settings-group">
                <h3>Car Temperature</h3>
                <div class="radio-group">
                    <label><input type="radio" name="car-temp-increase" value="0" ${n.carTempIncrease===0?"checked":""}> +0°F</label>
                    <label><input type="radio" name="car-temp-increase" value="10" ${n.carTempIncrease===10?"checked":""}> +10°F</label>
                    <label><input type="radio" name="car-temp-increase" value="20" ${n.carTempIncrease===20?"checked":""}> +20°F</label>
                    <label><input type="radio" name="car-temp-increase" value="40" ${n.carTempIncrease===40?"checked":""}> +40°F</label> <!-- New option -->
                </div>
            </div>
            <button id="save-settings">Save</button>
            <button id="close-settings">Close</button>
        </div>
    </div>
  `;const i=e.querySelector(".modal"),t=e.querySelector(".settings-button"),a=e.querySelector("#close-settings"),m=e.querySelector("#save-settings"),h=()=>{i.classList.remove("active")};t.addEventListener("click",()=>{i.classList.add("active")}),a.addEventListener("click",h),document.addEventListener("keydown",p=>{p.key==="Escape"&&i.classList.contains("active")&&h()}),i.addEventListener("click",p=>{p.target===i&&h()}),m.addEventListener("click",()=>{const g={carTempIncrease:parseInt(e.querySelector('input[name="car-temp-increase"]:checked')?.value||"0")};console.log("SettingsModal: Saving settings:",g),localStorage.setItem("pipeSafeSettings",JSON.stringify(g));const w=new CustomEvent("settings-changed",{detail:{settings:g}});document.dispatchEvent(w),console.log("SettingsModal: Dispatched settings-changed"),h()})}function j(e){if(!e)throw console.error("ParkingToggle: Container not found!"),new Error("Parking toggle container not found");let n=localStorage.getItem("parkingStorageItem")||"open",i=t();function t(){const h=localStorage.getItem("pipeSafeSettings");return h?JSON.parse(h):{carTempIncrease:0}}const a=()=>i.carTempIncrease===0?n==="shade"?"Temperature Adjusted for Shade (-5°F)":"Cars heat up fast, temps may rise 10-20°F inside.":`Temperature Estimated for Car (${n==="shade"?`+${i.carTempIncrease-5}°F`:`+${i.carTempIncrease}°F`})`,m=()=>{const h=a();e.innerHTML=`
      <h2>Where Did You Park?</h2>
      <div class='parking-toggle-well'>
        <div class='parking-toggle-container'>
          <div class='parking-option shade ${n==="shade"?"active":""}'>
            <i class='fa-solid fa-umbrella-beach'></i>
            <span>In Shade</span>
          </div>
          <div class='parking-toggle'>
            <input type='checkbox' id='parking-toggle' ${n==="open"?"checked":""}>
            <label for='parking-toggle'><i class='fa-solid fa-car-side'></i></label>
          </div>
          <div class='parking-option open ${n==="open"?"active":""}'>
            <i class='fa-solid fa-sun'></i>
            <span>In Open</span>
          </div>
        </div>
      </div>
      <p class="car-warning">${h}</p>
    `;const p=e.querySelector("#parking-toggle"),g=e.querySelector(".parking-toggle-container");g&&p?g.addEventListener("click",w=>{w.preventDefault(),p.checked=!p.checked,n=p.checked?"open":"shade",console.log("ParkingToggle: Changed to:",n),localStorage.setItem("parkingStorageItem",n),m();const T=new CustomEvent("parking-changed",{detail:{parkingCondition:n}});console.log("ParkingToggle: Dispatching parking-changed event:",T),document.dispatchEvent(T)}):console.error("ParkingToggle: Toggle input or container not found!")};return document.addEventListener("settings-changed",h=>{i=h.detail.settings,console.log("ParkingToggle: Settings changed, new settings:",i),m()}),m(),{getParkingCondition:()=>(console.log("ParkingToggle: getParkingCondition called, returning:",n),n)}}const U={Safe:{current:{cod:200,main:{temp:65,humidity:50},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:76,humidity:69},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:77,humidity:68},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:78,humidity:67},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:84,humidity:78},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},Warning:{current:{cod:200,main:{temp:83,humidity:78},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:84,humidity:79},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:85,humidity:80},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:75,humidity:70},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:74,humidity:69},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"Not Safe":{current:{cod:200,main:{temp:77,humidity:86},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:78,humidity:85},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:79,humidity:84},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:80,humidity:83},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:75,humidity:70},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"All Safe":{current:{cod:200,main:{temp:70,humidity:65},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:71,humidity:64},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:72,humidity:63},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:73,humidity:62},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:74,humidity:61},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"All Not Safe":{current:{cod:200,main:{temp:90,humidity:90},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:91,humidity:89},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:92,humidity:88},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:93,humidity:87},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:94,humidity:86},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"Invalid Data":{current:{cod:200,main:{temp:NaN,humidity:NaN},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:NaN,humidity:NaN},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:75,humidity:70},weather:[{id:800,main:"Clear"}],dt_txt:""}]}}};function z(e,s){return{fetchWeatherData:async()=>{{const i=localStorage.getItem("testScenario")||"Not Safe";console.log("Fetching test scenario:",i);const t=U[i];return t?Promise.resolve([t.current,t.forecast]):(console.error("Invalid test scenario:",i),Promise.reject(new Error("Invalid test scenario")))}}}}function A(e,s,n,i,t,a){let m=0,h=0,p=!1,g="not-safe",w=T();function T(){const o=localStorage.getItem("pipeSafeSettings");return o?JSON.parse(o):{humidityThreshold:80,carTempIncrease:0}}const F=(o,r,u)=>{if(!Number.isFinite(r.temp)||!Number.isFinite(u.temp)||!Number.isFinite(r.humidity)||!Number.isFinite(u.humidity)||r.dt>=u.dt)return{time:new Date(o*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:r.temp||u.temp||0,humidity:r.humidity||u.humidity||0,weatherIcon:c(r.weather||[],o)};const f=(o-r.dt)/(u.dt-r.dt);return{time:new Date(o*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:Math.round(r.temp+(u.temp-r.temp)*f),humidity:Math.round(r.humidity+(u.humidity-r.humidity)*f),weatherIcon:c(r.weather||[],o)}},c=(o,r)=>{if(!o||o.length===0)return Math.random()<.5?'<i class="fa-solid fa-meteor"></i>':'<i class="fa-solid fa-dragon"></i>';const u=o[0],f=u.id,v=u.main.toLowerCase(),M=new Date(r*1e3).getUTCHours();return f===800?M>=20||M<10?'<i class="fa-solid fa-moon"></i>':'<i class="fa-solid fa-sun"></i>':f>=801&&f<=804?'<i class="fa-solid fa-cloud"></i>':v.includes("rain")?'<i class="fa-solid fa-cloud-showers-heavy"></i>':v.includes("snow")?'<i class="fa-solid fa-snowflake"></i>':v.includes("thunderstorm")||v.includes("lightning")?'<i class="fa-solid fa-bolt-lightning"></i>':v.includes("wind")?'<i class="fa-solid fa-wind"></i>':v.includes("tornado")||v.includes("tsunami")?'<i class="fa-solid fa-tornado"></i>':v.includes("hurricane")?'<i class="fa-solid fa-hurricane"></i>':'<i class="fa-solid fa-cloud"></i>'},d=o=>Number.isFinite(o)?Math.round(o).toString().padStart(2,"0"):"N/A",S=(o,r,u,f)=>{m=o,h=r,p=u,g=f,console.log("WeatherForecast: Updating forecast, currentTemp:",o),s.fetchWeatherData().then(([v,P])=>{console.log("WeatherForecast: Forecast fetched:",P),console.log("WeatherForecast: Loaded settings:",w);const M=a.getParkingCondition();console.log("WeatherForecast: Applying parking condition:",M);let C=w.carTempIncrease;M==="shade"&&(C-=5),console.log("WeatherForecast: Temperature adjustment:",C);const N=Math.floor(new Date().getTime()/1e3),_=N+12*3600,I=[{time:"Now",temp:o,humidity:r,weatherIcon:c(v.weather||[],N)}],L=(P.list||[]).filter(l=>l.dt>=N&&l.dt<=_+3600&&Number.isFinite(l.main?.temp)&&Number.isFinite(l.main?.humidity)).slice(0,7);if(L.length<1){e.innerHTML="<p>Error: No valid forecast data.</p>";return}for(let l=1;l<=12;l++){const b=N+l*3600,y=L.slice().reverse().find(k=>k.dt<=b)||L[0],D=L.find(k=>k.dt>=b)||L[L.length-1];if(!y||!D){I.push({time:new Date(b*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:o,humidity:r,weatherIcon:c(y?.weather||[],b)});continue}if(y.dt===b||Math.abs(y.dt-b)<300)I.push({time:new Date(y.dt*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:y.main.temp+C,humidity:y.main.humidity,weatherIcon:c(y.weather||[],y.dt)});else{const k=F(b,{dt:y.dt,temp:y.main.temp+C,humidity:y.main.humidity,weather:y.weather},{dt:D.dt,temp:D.main.temp+C,humidity:D.main.humidity,weather:D.weather});I.push(k)}}let E="";if(I.slice(1).every(l=>n(l.temp).status===(u?f:"not-safe")))E=u?"Safe all day!":"Not safe all day!";else for(let l=1;l<I.length;l++){const b=I[l],y=n(b.temp).status;if((y==="safe"||y==="warning")!==u){const k=new Date(N*1e3+l*3600);E=u?`Safe until ${k.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`:`Not safe until ${k.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`;break}}e.innerHTML=`
          <p class="forecast-summary">${E}</p>
          <div class="forecast-well">
            ${I.map(l=>`
                <div class="forecast-box">
                  <span class="time">${l.time}</span>
                  <span class="weather-icon">${l.weatherIcon}</span>
                  <span class="temp" style="color: ${i(l.temp)};"><i class="fa-solid fa-temperature-quarter"></i> ${d(l.temp)}°F</span>
                  <span class="humidity" style="color: ${t(l.humidity)};"><i class="fa-solid fa-droplet"></i> ${d(l.humidity)}%</span>
                </div>
              `).join("")}
          </div>
        `}).catch(v=>{console.error("WeatherForecast: Fetch error:",v),e.innerHTML="<p>Error fetching forecast data.</p>"})};return document.addEventListener("parking-changed",o=>{console.log("WeatherForecast: Parking changed event received:",o.detail.parkingCondition),S(m,h,p,g)}),document.addEventListener("settings-changed",o=>{w=o.detail.settings,console.log("WeatherForecast: Settings changed, new settings:",w),S(m,h,p,g)}),{updateForecast:S}}"serviceWorker"in navigator&&navigator.serviceWorker.register("/pipe-safe/sw.js").then(e=>{console.log("Service Worker registered with scope:",e.scope)}).catch(e=>{console.error("Service Worker registration failed:",e)});const W=document.querySelector("#app"),H=()=>{const e=localStorage.getItem("weatherApiKey"),s=localStorage.getItem("waiverAccepted");if(console.log("main.ts: renderApp called, apiKey:",!!e,"waiverAccepted:",s),e&&s==="true"){W.innerHTML=`
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
    `,x(document.querySelector("#settings-container")),q(document.querySelector("#info-container")),document.querySelector("#api-key-container").innerHTML="";const n=document.querySelector("#parking-toggle-container");let i;try{console.log("main.ts: Initializing parking toggle"),i=j(n)}catch(g){console.error("main.ts: Failed to initialize parking toggle:",g),W.innerHTML="<p>Error: Unable to initialize parking toggle.</p>";return}const t=z(),a=document.querySelector("#weather-container"),m=document.querySelector("#weather-forecast-container");console.log("main.ts: Initializing weather forecast");const h=A(m,t,g=>({status:"not-safe",reason:"Placeholder"}),g=>"#888888",g=>"#888888",i);console.log("main.ts: Initializing weather display");const p=B(a,e,i,t,h);console.log("main.ts: Updating weather forecast with display functions"),A(m,t,p.checkSafety,p.getTempColor,p.getHumidityColor,i)}else W.innerHTML=`
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
    `,x(document.querySelector("#settings-container")),q(document.querySelector("#info-container")),e?document.querySelector("#api-key-container").innerHTML="":K(document.querySelector("#api-key-container"),H)};O(W,H);
