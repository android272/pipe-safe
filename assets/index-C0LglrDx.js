(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const h of o.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&n(h)}).observe(document,{childList:!0,subtree:!0});function a(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(t){if(t.ep)return;t.ep=!0;const o=a(t);fetch(t.href,o)}})();function O(e,l){if(localStorage.getItem("weatherApiKey")){l();return}e.innerHTML=`
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
  `;const n=e.querySelector("#save-api-key"),t=e.querySelector("#api-key-input");n.addEventListener("click",()=>{const o=t.value.trim();o?(localStorage.setItem("weatherApiKey",o),e.innerHTML="",l()):(t.placeholder="API Key cannot be empty",t.value="")})}function j(e,l){if(localStorage.getItem("waiverAccepted")==="true"){l();return}e.innerHTML=`
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
  `;const n=e.querySelector("#accept-waiver"),t=e.querySelector("#decline-waiver");n.addEventListener("click",()=>{localStorage.setItem("waiverAccepted","true"),e.innerHTML="",l()}),t.addEventListener("click",()=>{e.innerHTML="<p>You must accept the disclaimer to use PipeSafe.</p>"})}function B(e,l,a,n,t){let o=p(),h="not-safe";console.log("WeatherDisplay: Loaded settings:",o);function p(){const s=localStorage.getItem("pipeSafeSettings");return s?JSON.parse(s):{humidityThreshold:80,carTempIncrease:0}}const m=s=>{if(!Number.isFinite(s))return{status:"not-safe",reason:"Invalid data"};const u=Math.round(s);return u<50?{status:"not-safe",reason:`Too cold: ${u}°F`}:u>=85?{status:"not-safe",reason:`Too hot: ${u}°F`}:u>=83&&u<85?{status:"warning",reason:"Temperature near unsafe threshold"}:u>=50&&u<=52?{status:"warning",reason:"Temperature near unsafe threshold"}:{status:"safe",reason:"Conditions ideal"}},y=s=>Number.isFinite(s)?Math.round(s).toString().padStart(2,"0"):"N/A",w=s=>{if(console.log("getTempColor input:",s,"isFinite:",Number.isFinite(s)),!Number.isFinite(s))return"#888888";const u=Math.round(s);return`hsl(${200-(Math.min(Math.max(u,50),85)-50)/35*200}, 70%, 60%)`},M=s=>{if(console.log("getHumidityColor input:",s,"isFinite:",Number.isFinite(s)),!Number.isFinite(s))return"#888888";const u=Math.round(s),k=Math.min(Math.max(u,50),o.humidityThreshold),r=30+(k-50)/(o.humidityThreshold-50)*40,i=80-(k-50)/(o.humidityThreshold-50)*40;return`hsl(200, ${r}%, ${i}%)`},N=(s="Not Safe")=>{console.log("WeatherDisplay: Updating weather, scenario:",s),n.fetchWeatherData().then(([u])=>{if(console.log("WeatherDisplay: Current:",u),u.cod!==200){e.innerHTML="<p>Error: Invalid API response.</p>";return}const k=a.getParkingCondition();console.log("WeatherDisplay: Applying parking condition:",k);let r=o.carTempIncrease;k==="shade"&&(r-=5),console.log("WeatherDisplay: Temperature adjustment:",r);const i=Number.isFinite(u.main?.temp)?u.main.temp+r:NaN,c=Number.isFinite(u.main?.humidity)?u.main.humidity:NaN;console.log("WeatherDisplay: Current temp after adjustment:",i);const{status:v,reason:g}=m(i);h=v;const C=w(i),b=M(c),T=v==="safe"?"/pipe-safe/safe.svg":v==="warning"?"/pipe-safe/warning.svg":g==="Invalid data"?"/pipe-safe/error.svg":"/pipe-safe/not-safe.svg",E=v==="safe"||v==="warning";e.innerHTML=`
          
          <div class="current-weather">
            <div class="weather-item">
              <span class="label">Temperature</span>
              <span class="value" style="color: ${C};"><i class="fa-solid fa-temperature-quarter"></i> ${y(i)}°F</span>
            </div>
            <div class="weather-item">
              <span class="label">Humidity</span>
              <span class="value" style="color: ${b};"><i class="fa-solid fa-droplet"></i> ${y(c)}%</span>
            </div>
          </div>
          <img class="safety-image" src="${T}" alt="${v}">
          <p class="reason">Reason: ${g}</p>
        `,t.updateForecast(i,c,E,h)}).catch(u=>{console.error("WeatherDisplay: Fetch error:",u),e.innerHTML="<p>Error fetching weather data.</p>"})};return document.addEventListener("parking-changed",s=>{console.log("WeatherDisplay: Parking changed event received:",s.detail.parkingCondition),N(localStorage.getItem("testScenario")||"Not Safe")}),document.addEventListener("settings-changed",s=>{o=s.detail.settings,console.log("WeatherDisplay: Settings changed, new settings:",o),N(localStorage.getItem("testScenario")||"Not Safe")}),N(),{checkSafety:m,getTempColor:w,getHumidityColor:M,get currentStatus(){return h}}}function H(e){e.innerHTML=`
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
  `;const l=e.querySelector(".modal"),a=e.querySelector(".info-button"),n=e.querySelector("#close-info"),t=()=>{l.classList.remove("active")};a.addEventListener("click",()=>{l.classList.add("active")}),n.addEventListener("click",t),document.addEventListener("keydown",o=>{o.key==="Escape"&&l.classList.contains("active")&&t()}),l.addEventListener("click",o=>{o.target===l&&t()})}function q(e){const l=localStorage.getItem("pipeSafeSettings"),a=l?JSON.parse(l):{humidityThreshold:80,carTempIncrease:0};console.log("SettingsModal: Loaded settings:",a),e.innerHTML=`
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
  `;const n=e.querySelector(".modal"),t=e.querySelector(".settings-button"),o=e.querySelector("#close-settings"),h=e.querySelector("#save-settings"),p=()=>{n.classList.remove("active")};t.addEventListener("click",()=>{n.classList.add("active")}),o.addEventListener("click",p),document.addEventListener("keydown",m=>{m.key==="Escape"&&n.classList.contains("active")&&p()}),n.addEventListener("click",m=>{m.target===n&&p()}),h.addEventListener("click",()=>{const m=parseInt(e.querySelector('input[name="humidity-threshold"]:checked')?.value||"80"),y=parseInt(e.querySelector('input[name="car-temp-increase"]:checked')?.value||"0"),w={humidityThreshold:m,carTempIncrease:y};console.log("SettingsModal: Saving settings:",w),localStorage.setItem("pipeSafeSettings",JSON.stringify(w));const M=new CustomEvent("settings-changed",{detail:{settings:w}});document.dispatchEvent(M),console.log("SettingsModal: Dispatched settings-changed"),p()})}function U(e){if(!e)throw console.error("ParkingToggle: Container not found!"),new Error("Parking toggle container not found");let a=localStorage.getItem("parkingStorageItem")||"open",n=t();function t(){const p=localStorage.getItem("pipeSafeSettings");return p?JSON.parse(p):{carTempIncrease:0}}const o=()=>n.carTempIncrease===0?a==="shade"?"Temperature Adjusted for Shade (-5°F)":"Cars heat up fast, temps may rise 10-20°F inside.":`Temperature Estimated for Car (${a==="shade"?`+${n.carTempIncrease-5}°F`:`+${n.carTempIncrease}°F`})`,h=()=>{const p=o();e.innerHTML=`
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
    `;const m=e.querySelector("#parking-toggle"),y=e.querySelector(".parking-toggle-container");y&&m?y.addEventListener("click",w=>{w.preventDefault(),m.checked=!m.checked,a=m.checked?"open":"shade",console.log("ParkingToggle: Changed to:",a),localStorage.setItem("parkingStorageItem",a),h();const M=new CustomEvent("parking-changed",{detail:{parkingCondition:a}});console.log("ParkingToggle: Dispatching parking-changed event:",M),document.dispatchEvent(M)}):console.error("ParkingToggle: Toggle input or container not found!")};return document.addEventListener("settings-changed",p=>{n=p.detail.settings,console.log("ParkingToggle: Settings changed, new settings:",n),h()}),h(),{getParkingCondition:()=>(console.log("ParkingToggle: getParkingCondition called, returning:",a),a)}}const z={Safe:{current:{cod:200,main:{temp:65,humidity:50},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:76,humidity:69},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:77,humidity:68},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:78,humidity:67},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:84,humidity:78},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},Warning:{current:{cod:200,main:{temp:83,humidity:78},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:84,humidity:79},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:85,humidity:80},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:75,humidity:70},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:74,humidity:69},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"Not Safe":{current:{cod:200,main:{temp:77,humidity:86},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:78,humidity:85},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:79,humidity:84},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:80,humidity:83},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:75,humidity:70},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"All Safe":{current:{cod:200,main:{temp:70,humidity:65},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:71,humidity:64},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:72,humidity:63},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:73,humidity:62},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:74,humidity:61},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"All Not Safe":{current:{cod:200,main:{temp:90,humidity:90},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:91,humidity:89},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:92,humidity:88},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+10800,main:{temp:93,humidity:87},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+14400,main:{temp:94,humidity:86},weather:[{id:800,main:"Clear"}],dt_txt:""}]}},"Invalid Data":{current:{cod:200,main:{temp:NaN,humidity:NaN},weather:[{id:800,main:"Clear"}]},forecast:{cod:"200",list:[{dt:Math.floor(Date.now()/1e3)+3600,main:{temp:NaN,humidity:NaN},weather:[{id:800,main:"Clear"}],dt_txt:""},{dt:Math.floor(Date.now()/1e3)+7200,main:{temp:75,humidity:70},weather:[{id:800,main:"Clear"}],dt_txt:""}]}}};function J(e,l){return{fetchWeatherData:async()=>{{const n=localStorage.getItem("testScenario")||"Not Safe";console.log("Fetching test scenario:",n);const t=z[n];return t?Promise.resolve([t.current,t.forecast]):(console.error("Invalid test scenario:",n),Promise.reject(new Error("Invalid test scenario")))}}}}function A(e,l,a,n,t,o){let h=0,p=0,m=!1,y="not-safe",w=M();function M(){const r=localStorage.getItem("pipeSafeSettings");return r?JSON.parse(r):{humidityThreshold:80,carTempIncrease:0}}const N=(r,i,c,v,g)=>{if(console.log("interpolateHour - targetTime:",r,"prev:",{dt:i.dt,temp:i.temp,humidity:i.humidity},"next:",{dt:c.dt,temp:c.temp,humidity:c.humidity}),!Number.isFinite(i.temp)||!Number.isFinite(c.temp)||!Number.isFinite(i.humidity)||!Number.isFinite(c.humidity)||i.dt>=c.dt)return console.warn("interpolateHour: Invalid input - prev.temp:",i.temp,"next.temp:",c.temp,"prev.humidity:",i.humidity,"next.humidity:",c.humidity,"prev.dt >= next.dt:",i.dt>=c.dt),{time:new Date(r*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:Number.isFinite(i.temp)?i.temp:Number.isFinite(c.temp)?c.temp:v,humidity:Number.isFinite(i.humidity)?i.humidity:Number.isFinite(c.humidity)?c.humidity:g,weatherIcon:s(i.weather||[],r)};const C=(r-i.dt)/(c.dt-i.dt),b=Math.round(i.temp+(c.temp-i.temp)*C),T=Math.round(i.humidity+(c.humidity-i.humidity)*C);return console.log("interpolateHour result - temp:",b,"humidity:",T),{time:new Date(r*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:b,humidity:T,weatherIcon:s(i.weather||[],r)}},s=(r,i)=>{if(!r||r.length===0)return Math.random()<.5?'<i class="fa-solid fa-meteor"></i>':'<i class="fa-solid fa-dragon"></i>';const c=r[0],v=c.id,g=c.main.toLowerCase(),b=new Date(i*1e3).getUTCHours();return v===800?b>=20||b<10?'<i class="fa-solid fa-moon"></i>':'<i class="fa-solid fa-sun"></i>':v>=801&&v<=804?'<i class="fa-solid fa-cloud"></i>':g.includes("rain")?'<i class="fa-solid fa-cloud-showers-heavy"></i>':g.includes("snow")?'<i class="fa-solid fa-snowflake"></i>':g.includes("thunderstorm")||g.includes("lightning")?'<i class="fa-solid fa-bolt-lightning"></i>':g.includes("wind")?'<i class="fa-solid fa-wind"></i>':g.includes("tornado")||g.includes("tsunami")?'<i class="fa-solid fa-tornado"></i>':g.includes("hurricane")?'<i class="fa-solid fa-hurricane"></i>':'<i class="fa-solid fa-cloud"></i>'},u=r=>Number.isFinite(r)?Math.round(r).toString().padStart(2,"0"):"N/A",k=(r,i,c,v)=>{h=r,p=i,m=c,y=v,console.log("WeatherForecast: Updating forecast, currentTemp:",r),l.fetchWeatherData().then(([g,C])=>{console.log("WeatherForecast: Forecast fetched:",C),console.log("WeatherForecast: Loaded settings:",w);const b=o.getParkingCondition();console.log("WeatherForecast: Applying parking condition:",b);let T=w.carTempIncrease;b==="shade"&&(T-=5),console.log("WeatherForecast: Temperature adjustment:",T);const P=Math.floor(new Date().getTime()/1e3),_=P+12*3600,I=[{time:"Now",temp:r,humidity:i,weatherIcon:s(g.weather||[],P)}],D=(C.list||[]).filter(d=>d.dt>=P&&d.dt<=_+3600&&Number.isFinite(d.main?.temp)&&Number.isFinite(d.main?.humidity)).sort((d,S)=>d.dt-S.dt).slice(0,7);console.log("apiPoints:",D);for(let d=1;d<=12;d++){const S=P+d*3600,f=D.find(L=>L.dt<=S)||D[0],F=D.find((L,K)=>L.dt>S&&K>D.indexOf(f))||D[D.length-1];if(!f||!F){I.push({time:new Date(S*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:r,humidity:i,weatherIcon:s(f?.weather||[],S)});continue}if(f.dt===S||Math.abs(f.dt-S)<300)I.push({time:new Date(f.dt*1e3).toLocaleTimeString([],{hour:"numeric",hour12:!0}),temp:f.main.temp+T,humidity:f.main.humidity,weatherIcon:s(f.weather||[],f.dt)});else{const L=N(S,{dt:f.dt,temp:f.main.temp+T,humidity:f.main.humidity,weather:f.weather},{dt:F.dt,temp:F.main.temp+T,humidity:F.main.humidity,weather:F.weather},r,i);I.push(L)}}let W="";if(I.slice(1).every(d=>a(d.temp).status===(c?v:"not-safe")))W=c?"Safe all day!":"Not safe all day!";else for(let d=1;d<I.length;d++){const S=I[d],f=a(S.temp).status;if((f==="safe"||f==="warning")!==c){const L=new Date(P*1e3+d*3600);W=c?`Safe until ${L.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`:`Not safe until ${L.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`;break}}I.forEach(d=>{console.log(`Temp: ${d.temp}, Color: ${n(d.temp)}`),console.log(`Humidity: ${d.humidity}, Color: ${t(d.humidity)}`)}),e.innerHTML=`
          <p class="forecast-summary">${W}</p>
          <div class="forecast-well">
            ${I.map(d=>`
                <div class="forecast-box">
                  <span class="time">${d.time}</span>
                  <span class="weather-icon">${d.weatherIcon}</span>
                  <span class="temp" style="color: ${n(d.temp)};"><i class="fa-solid fa-temperature-quarter"></i> ${u(d.temp)}°F</span>
                  <span class="humidity" style="color: ${t(d.humidity)};"><i class="fa-solid fa-droplet"></i> ${u(d.humidity)}%</span>
                </div>
              `).join("")}
          </div>
        `}).catch(g=>{console.error("WeatherForecast: Fetch error:",g),e.innerHTML="<p>Error fetching forecast data.</p>"})};return document.addEventListener("parking-changed",r=>{console.log("WeatherForecast: Parking changed event received:",r.detail.parkingCondition),k(h,p,m,y)}),document.addEventListener("settings-changed",r=>{w=r.detail.settings,console.log("WeatherForecast: Settings changed, new settings:",w),k(h,p,m,y)}),{updateForecast:k}}"serviceWorker"in navigator&&navigator.serviceWorker.register("/pipe-safe/sw.js").then(e=>{console.log("Service Worker registered with scope:",e.scope)}).catch(e=>{console.error("Service Worker registration failed:",e)});const $=document.querySelector("#app"),x=()=>{const e=localStorage.getItem("weatherApiKey"),l=localStorage.getItem("waiverAccepted");if(console.log("main.ts: renderApp called, apiKey:",!!e,"waiverAccepted:",l),e&&l==="true"){$.innerHTML=`
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
    `,q(document.querySelector("#settings-container")),H(document.querySelector("#info-container")),document.querySelector("#api-key-container").innerHTML="";const a=document.querySelector("#parking-toggle-container");let n;try{console.log("main.ts: Initializing parking toggle"),n=U(a)}catch(y){console.error("main.ts: Failed to initialize parking toggle:",y),$.innerHTML="<p>Error: Unable to initialize parking toggle.</p>";return}const t=J(),o=document.querySelector("#weather-container"),h=document.querySelector("#weather-forecast-container");console.log("main.ts: Initializing weather forecast");const p=A(h,t,y=>({status:"not-safe",reason:"Placeholder"}),y=>"#888888",y=>"#888888",n);console.log("main.ts: Initializing weather display");const m=B(o,e,n,t,p);console.log("main.ts: Updating weather forecast with display functions"),A(h,t,m.checkSafety,m.getTempColor,m.getHumidityColor,n)}else $.innerHTML=`
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
    `,q(document.querySelector("#settings-container")),H(document.querySelector("#info-container")),e?document.querySelector("#api-key-container").innerHTML="":O(document.querySelector("#api-key-container"),x)};j($,x);
