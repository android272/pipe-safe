(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const t of n)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const t={};return n.integrity&&(t.integrity=n.integrity),n.referrerPolicy&&(t.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?t.credentials="include":n.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(n){if(n.ep)return;n.ep=!0;const t=s(n);fetch(n.href,t)}})();function ue(e,i){if(localStorage.getItem("weatherApiKey")){i();return}e.innerHTML=`
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
  `;const a=e.querySelector("#save-api-key"),n=e.querySelector("#api-key-input");a.addEventListener("click",()=>{const t=n.value.trim();t?(localStorage.setItem("weatherApiKey",t),e.innerHTML="",i()):(n.placeholder="API Key cannot be empty",n.value="")})}function pe(e,i){if(localStorage.getItem("waiverAccepted")==="true"){i();return}e.innerHTML=`
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
  `;const a=e.querySelector("#accept-waiver"),n=e.querySelector("#decline-waiver");a.addEventListener("click",()=>{localStorage.setItem("waiverAccepted","true"),e.innerHTML="",i()}),n.addEventListener("click",()=>{e.innerHTML="<p>You must accept the disclaimer to use PipeSafe.</p>"})}const z=50,ge=78,Q=80,H=86400;function _(e,i,s,a){if(!Number.isFinite(e)||!Number.isFinite(i)||!Number.isFinite(s))return!1;const n=i,t=s;if(!(t>n))return!1;if(!Number.isFinite(a)){const m=Math.floor((e-n)/H),v=n+m*H,S=t+m*H;return e>=v&&e<S}const c=m=>{const v=(m+a)%H;return v<0?v+H:v},o=c(n),l=c(t),r=c(e);return o===l?!1:o<l?r>=o&&r<l:r>=o||r<l}function V(e,i,s){if(!s||i!=="open")return 0;const a=Number.isFinite(e)?e:0;return a>0?a:0}function he(e){if(!Number.isFinite(e))return{status:"not-safe",reason:"Invalid data"};const i=Math.round(e);return i<z?{status:"not-safe",reason:`Too cold: estimated interior ${i}°F`}:i>Q?{status:"not-safe",reason:`Too hot: estimated interior ${i}°F`}:i>=ge?{status:"warning",reason:`Estimated interior ${i}°F is near the 80°F tobacco limit`}:{status:"safe",reason:"Conditions ideal"}}function fe(e){if(!Number.isFinite(e))return"#888888";const i=Math.round(e);return`hsl(${200-(Math.min(Math.max(i,z),Q)-z)/(Q-z)*200}, 70%, 60%)`}function X(e,i,s=!0){const a=Number.isFinite(i)?i:-new Date().getTimezoneOffset()*60,n=new Date((e+a)*1e3);let t=n.getUTCHours();const c=n.getUTCMinutes(),o=t>=12?"PM":"AM";return t=t%12,t===0&&(t=12),s?`${t}:${c.toString().padStart(2,"0")} ${o}`:`${t} ${o}`}function me(e,i,s,a,n){if(n(e))return"Not safe to leave in the car now";const t=a(s),c=i.find(o=>o.at>s&&a(o.at)!==t&&n(o.interior));return c?`Safe until ${a(c.at)}`:"Safe for 12+ hours"}const Z=["easy","breezy","windy","poor"],ve={easy:"Easy to light",breezy:"Breezy — cup the flame",windy:"Windy — matches will fight you",poor:"Poor lighting conditions"};function A(e){return typeof e=="number"&&Number.isFinite(e)?e:void 0}function ye(e,i){if(!Number.isFinite(e))return null;const s=e,a=A(i),n=a??s;let t;return n<=7?t="easy":n<=12?t="breezy":n<=18?t="windy":t="poor",a!=null&&a-s>=8&&(t=Z[Math.min(Z.indexOf(t)+1,Z.length-1)]),{level:t,speed:s,gust:a,effective:n}}function we(e){switch(e){case"easy":return"Lighting: Easy to light";case"breezy":return"Lighting: Breezy, cup the flame";case"windy":return"Lighting: Windy, matches will fight you";case"poor":return"Lighting: Poor lighting conditions"}}function be(e){if(e.level!=="windy"&&e.level!=="poor")return null;const i=e.gust!=null?Math.round(e.gust):null;return e.level==="windy"?i!=null?`Gusts ${i} mph. Shield the bowl.`:"Expect to shield the bowl. Soft flame will struggle.":i!=null?`${i} mph gusts. Zippo, torch, or a windbreak.`:"Strong wind. Use a Zippo/torch or find a windbreak."}function Se(e,i){const s=`Wind ${Math.round(e)} miles per hour`;return i!=null&&Number.isFinite(i)&&i>e?`${s}, gusts ${Math.round(i)}`:s}function ke(e,i){if(!Number.isFinite(e))return{text:"—",aria:"Wind unavailable"};const s=Math.round(e),a=A(i),n=a!=null?Math.round(a):void 0,t=a!=null&&a>=e+5&&n!=null&&n>s,c=t?n:s,o=t?`${s}–${n}`:`${s}`,l=t?`Wind ${s} to ${n} miles per hour`:`Wind ${s} miles per hour`;return{text:o,high:c,aria:l}}function Fe(e){return e==null||!Number.isFinite(e)?null:e>=19?"strong":e>=13?"amber":null}function Te(e,i,s,a,n){let t=o(),c="not-safe";console.log("WeatherDisplay: Loaded settings:",t);function o(){const d=localStorage.getItem("pipeSafeSettings");return d?JSON.parse(d):{humidityThreshold:80,carTempIncrease:0}}const l=d=>he(d),r=d=>Number.isFinite(d)?Math.round(d).toString().padStart(2,"0"):"N/A",m=d=>fe(d),v=d=>{if(!Number.isFinite(d))return"#888888";const g=Math.round(d),N=Number.isFinite(t.humidityThreshold)?t.humidityThreshold:80,P=Math.min(Math.max(g,50),N),u=30+(P-50)/(N-50)*40,y=80-(P-50)/(N-50)*40;return`hsl(200, ${u}%, ${y}%)`},S=(d="Not Safe")=>{console.log("WeatherDisplay: Updating weather, scenario:",d),a.fetchWeatherData().then(([g])=>{if(console.log("WeatherDisplay: Current:",g),String(g.cod)!=="200"){e.innerHTML="<p>Error: Invalid API response.</p>";return}const N=s.getParkingCondition(),P=Number.isFinite(g.dt)?g.dt:Math.floor(Date.now()/1e3),u=g.sys?.sunrise,y=g.sys?.sunset,k=g.timezone,$=_(P,u,y,k),f=V(t.carTempIncrease,N,$),T=g.main?.temp,L=Number.isFinite(T)?T+f:NaN;console.log("WeatherDisplay: outside",T,"sunOffset",f,"daytime",$,"local",X(P,k)),document.dispatchEvent(new CustomEvent("solar-updated",{detail:{sunrise:u,sunset:y,timezone:k}}));const F=Number.isFinite(g.main?.humidity)?g.main.humidity:NaN,{status:I,reason:C}=l(L);c=I;const U=m(L),R=v(F),h=ye(A(g.wind?.speed),A(g.wind?.gust)),O=h?be(h):null,q=h?`
            <div class="weather-item wind-item">
              <span class="sr-only">${Se(h.speed,h.gust)}</span>
              <span class="label" aria-hidden="true">Wind</span>
              <span class="value lighting-${h.level}" aria-hidden="true">
                <span class="wind-line"><i class="fa-solid fa-wind"></i> ${Math.round(h.speed)} mph</span>
                ${h.gust!=null&&h.gust>h.speed?`<span class="wind-gust">gusts ${Math.round(h.gust)}</span>`:""}
              </span>
            </div>`:"",D=h?`
          <p class="lighting lighting-${h.level}">
            <span class="sr-only">${we(h.level)}</span>
            <span aria-hidden="true">Lighting: ${ve[h.level]}</span>
            ${O?`<span class="lighting-detail" aria-hidden="true">${O}</span>`:""}
          </p>`:"",x=I==="safe"?"/pipe-safe/safe.svg":I==="warning"?"/pipe-safe/warning.svg":C==="Invalid data"?"/pipe-safe/error.svg":"/pipe-safe/not-safe.svg",J=I==="safe"||I==="warning";e.innerHTML=`
          
          <div class="current-weather">
            <div class="weather-item">
              <span class="label">Est. car interior</span>
              <span class="value" style="color: ${U};"><i class="fa-solid fa-temperature-quarter"></i> ${r(L)}°F${f>0?`<span class="sun-offset">(+${f}°F sun)</span>`:""}</span>
            </div>
            <div class="weather-item">
              <span class="label">Humidity</span>
              <span class="value" style="color: ${R};"><i class="fa-solid fa-droplet"></i> ${r(F)}%</span>
            </div>
            ${q}
          </div>
          <img class="safety-image" src="${x}" alt="${I}">
          <p class="reason">Reason: ${C}</p>
          ${D}
        `,n.updateForecast(L,F,J,c)}).catch(g=>{console.error("WeatherDisplay: Fetch error:",g),e.innerHTML="<p>Error fetching weather data.</p>"})};return document.addEventListener("parking-changed",d=>{console.log("WeatherDisplay: Parking changed event received:",d.detail.parkingCondition),S(localStorage.getItem("testScenario")||"Not Safe")}),document.addEventListener("settings-changed",d=>{t=d.detail.settings,console.log("WeatherDisplay: Settings changed, new settings:",t),S(localStorage.getItem("testScenario")||"Not Safe")}),S(),{checkSafety:l,getTempColor:m,getHumidityColor:v,get currentStatus(){return c}}}function ee(e){e.innerHTML=`
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

        <h2>Wind</h2>
        <p class="info-text">Wind does not affect PipeSafe’s car-storage calculation. It is shown so you can judge lighting conditions. Matches and soft-flame lighters get difficult around 8–12 mph and are often impractical above about 15–18 mph, especially with gusts. A Zippo with a pipe insert, a torch used carefully, or a wall/car as a windbreak works better. Strong wind also makes a lit bowl burn hotter and faster.</p>
        
        <h2>Car</h2>
        <p class="info-text">Full sun can raise a closed cabin about 20–40°F above the outside temperature. Shade stays much closer to the outside air. The Car Temperature setting (+0, +10, +20, or +40°F) is a sun offset: it is added only in daytime when the car is In Open. After sunset that offset is not applied. Park in the shade or use a sunshade, and use a sturdy vented container so warm air does not build pressure.</p>
        
        <button id="close-info">Close</button>
      </div>
    </div>
  `;const i=e.querySelector(".modal"),s=e.querySelector(".info-button"),a=e.querySelector("#close-info"),n=()=>{i.classList.remove("active")};s.addEventListener("click",()=>{i.classList.add("active")}),a.addEventListener("click",n),document.addEventListener("keydown",t=>{t.key==="Escape"&&i.classList.contains("active")&&n()}),i.addEventListener("click",t=>{t.target===i&&n()})}function te(e){const i=localStorage.getItem("pipeSafeSettings"),s=i?JSON.parse(i):{carTempIncrease:0};console.log("SettingsModal: Loaded settings:",s),e.innerHTML=`
    <button class="settings-button"><i class="fa-solid fa-gear"></i></button>
    <div class="modal" id="settingsModal">
        <div class="modal-content">
            <h2>Settings</h2>
            <div class="settings-group">
                <h3>Car Temperature</h3>
                <p class="settings-note">Sun offset for daytime In Open only. Not added in shade or at night.</p>
                <div class="radio-group">
                    <label><input type="radio" name="car-temp-increase" value="0" ${s.carTempIncrease===0?"checked":""}> +0°F</label>
                    <label><input type="radio" name="car-temp-increase" value="10" ${s.carTempIncrease===10?"checked":""}> +10°F</label>
                    <label><input type="radio" name="car-temp-increase" value="20" ${s.carTempIncrease===20?"checked":""}> +20°F</label>
                    <label><input type="radio" name="car-temp-increase" value="40" ${s.carTempIncrease===40?"checked":""}> +40°F</label> <!-- New option -->
                </div>
            </div>
            <button id="save-settings">Save</button>
            <button id="close-settings">Close</button>
        </div>
    </div>
  `;const a=e.querySelector(".modal"),n=e.querySelector(".settings-button"),t=e.querySelector("#close-settings"),c=e.querySelector("#save-settings"),o=()=>{a.classList.remove("active")};n.addEventListener("click",()=>{a.classList.add("active")}),t.addEventListener("click",o),document.addEventListener("keydown",l=>{l.key==="Escape"&&a.classList.contains("active")&&o()}),a.addEventListener("click",l=>{l.target===a&&o()}),c.addEventListener("click",()=>{const r={carTempIncrease:parseInt(e.querySelector('input[name="car-temp-increase"]:checked')?.value||"0")};console.log("SettingsModal: Saving settings:",r),localStorage.setItem("pipeSafeSettings",JSON.stringify(r));const m=new CustomEvent("settings-changed",{detail:{settings:r}});document.dispatchEvent(m),console.log("SettingsModal: Dispatched settings-changed"),o()})}function $e(e){if(!e)throw console.error("ParkingToggle: Container not found!"),new Error("Parking toggle container not found");let s=localStorage.getItem("parkingStorageItem")==="shade"?"shade":"open",a=t(),n={};function t(){const r=localStorage.getItem("pipeSafeSettings");return r?JSON.parse(r):{carTempIncrease:0}}const c=()=>_(Math.floor(Date.now()/1e3),n.sunrise,n.sunset,n.timezone),o=()=>c()?s==="open"?`Est. interior includes +${V(a.carTempIncrease,"open",!0)}°F sun offset.`:"In shade, the estimate uses the outside temperature.":"Nighttime — no direct sun.",l=()=>{const r=c(),m=r&&s==="open",v=o();e.innerHTML=`
      <h2>Where Did You Park?</h2>
      <div class='parking-toggle-well'>
        <div class='parking-toggle-container${r?"":" night"}'>
          <div class='parking-option shade ${m?"":"active"}'>
            <i class='fa-solid fa-umbrella-beach'></i>
            <span>In Shade</span>
          </div>
          <div class='parking-toggle'>
            <input type='checkbox' id='parking-toggle' ${m?"checked":""} ${r?"":"disabled"}>
            <label for='parking-toggle'><i class='fa-solid fa-car-side'></i></label>
          </div>
          <div class='parking-option open ${m?"active":""}'>
            <i class='fa-solid fa-sun'></i>
            <span>In Open</span>
          </div>
        </div>
      </div>
      <p class="car-warning${r?"":" night"}">${v}</p>
    `;const S=e.querySelector("#parking-toggle"),d=e.querySelector(".parking-toggle-container");d&&S?d.addEventListener("click",g=>{g.preventDefault(),c()&&(S.checked=!S.checked,s=S.checked?"open":"shade",console.log("ParkingToggle: Changed to:",s),localStorage.setItem("parkingStorageItem",s),l(),document.dispatchEvent(new CustomEvent("parking-changed",{detail:{parkingCondition:s}})))}):console.error("ParkingToggle: Toggle input or container not found!")};return document.addEventListener("settings-changed",r=>{a=r.detail.settings,console.log("ParkingToggle: Settings changed, new settings:",a),l()}),document.addEventListener("solar-updated",r=>{n=r.detail??{},l()}),l(),{getParkingCondition:()=>(console.log("ParkingToggle: getParkingCondition called, returning:",s),s)}}function Le(e,i){const s="pipeSafeWeatherCache";return{fetchWeatherData:async()=>{let t=null;const c=localStorage.getItem(s);if(c){const o=JSON.parse(c);if(Date.now()-o.timestamp<6e5)return console.log("Using cached weather data:",o),[o.current,o.forecast];t=o}try{const o=await new Promise((d,g)=>{navigator.geolocation.getCurrentPosition(d,g)}),l=o.coords.latitude,r=o.coords.longitude,[m,v]=await Promise.all([fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${l}&lon=${r}&appid=${e}&units=imperial`).then(d=>d.json()),fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${l}&lon=${r}&appid=${e}&units=imperial`).then(d=>d.json())]),S={current:m,forecast:v,timestamp:Date.now()};return localStorage.setItem(s,JSON.stringify(S)),console.log("Fetched and cached new weather data:",S),[m,v]}catch(o){if(t)return console.log("Fetch failed, using last cached weather:",t),[t.current,t.forecast];throw console.error("Fetch error:",o),o}}}}function Ie(e,i,s,a,n,t){let c=s,o=a,l=n,r=m();function m(){const u=localStorage.getItem("pipeSafeSettings");return u?JSON.parse(u):{humidityThreshold:80,carTempIncrease:0}}const v=(u,y,k,$,f)=>{if(!Number.isFinite(y)||!Number.isFinite($)||k>=f)return Number.isFinite(y)?y:$;const T=(u-k)/(f-k);return y+($-y)*T},S=(u,y,k,$,f)=>{if(!u||u.length===0)return Math.random()<.5?'<i class="fa-solid fa-meteor"></i>':'<i class="fa-solid fa-dragon"></i>';const T=u[0],L=T.id,F=T.main.toLowerCase();return L===800?_(y,k,$,f)?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>':L>=801&&L<=804?'<i class="fa-solid fa-cloud"></i>':F.includes("rain")?'<i class="fa-solid fa-cloud-showers-heavy"></i>':F.includes("snow")?'<i class="fa-solid fa-snowflake"></i>':F.includes("thunderstorm")||F.includes("lightning")?'<i class="fa-solid fa-bolt-lightning"></i>':F.includes("wind")?'<i class="fa-solid fa-wind"></i>':F.includes("tornado")||F.includes("tsunami")?'<i class="fa-solid fa-tornado"></i>':F.includes("hurricane")?'<i class="fa-solid fa-hurricane"></i>':'<i class="fa-solid fa-cloud"></i>'},d=u=>Number.isFinite(u)?Math.round(u).toString().padStart(2,"0"):"N/A",g=u=>({speed:A(u?.wind?.speed),gust:A(u?.wind?.gust)}),N=(u,y)=>{const k=ke(u,y),$=Fe(k.high);return`<span class="wind${$==="strong"?" wind-strong":$==="amber"?" wind-amber":""}" aria-label="${k.aria}">
                    <span class="wind-line" aria-hidden="true"><i class="fa-solid fa-wind"></i> ${k.text}</span>
                </span>`},P=(u,y,k,$)=>{console.log("WeatherForecast: Updating forecast, currentTemp:",u),i.fetchWeatherData().then(([f,T])=>{if(console.log("WeatherForecast: Forecast fetched:",T),String(T.cod)!=="200"){e.innerHTML="<p>Error: Invalid forecast response.</p>";return}console.log("WeatherForecast: Loaded settings:",r);const L=t.getParkingCondition(),F=f.sys?.sunrise??T.city?.sunrise,I=f.sys?.sunset??T.city?.sunset,C=f.timezone??T.city?.timezone,U=p=>X(p,C,!1),R=p=>X(p,C,!0),h=Math.floor(Date.now()/1e3),O=h+12*3600,q=g(f),D=[{time:"Now",temp:u,humidity:y,weatherIcon:S(f.weather||[],f.dt??h,F,I,C),windSpeed:q.speed,windGust:q.gust}],x=(T.list||[]).filter(p=>p.dt<=O+3600&&Number.isFinite(p.main?.temp)&&Number.isFinite(p.main?.humidity)),J=x.filter(p=>p.dt<h).slice(-1),ie=x.filter(p=>p.dt>=h).slice(0,8),E=[...J,...ie];if(E.length<1){e.innerHTML="<p>Error: No valid forecast data.</p>";return}for(let p=1;p<=12;p++){const w=h+p*3600,b=E.slice().reverse().find(Y=>Y.dt<=w)||E[0],M=E.find(Y=>Y.dt>=w)||E[E.length-1],oe=b.dt===w||Math.abs(b.dt-w)<300?b.main.temp:v(w,b.main.temp,b.dt,M.main.temp,M.dt),re=b.dt===w||Math.abs(b.dt-w)<300?b.main.humidity:v(w,b.main.humidity,b.dt,M.main.humidity,M.dt),ce=_(w,F,I,C),le=oe+V(r.carTempIncrease,L,ce),de=b.dt===w||Math.abs(b.dt-w)<300,W=g(b),B=g(M);let j,G;de||b.dt>=M.dt?(j=W.speed,G=W.gust):W.speed!=null&&B.speed!=null&&(j=v(w,W.speed,b.dt,B.speed,M.dt),W.gust!=null&&B.gust!=null&&(G=v(w,W.gust,b.dt,B.gust,M.dt))),D.push({time:U(w),temp:le,humidity:re,weatherIcon:S(b.weather||M.weather||[],w,F,I,C),windSpeed:j,windGust:G})}const se=D.slice(1).map((p,w)=>({at:h+(w+1)*3600,interior:p.temp})),ae=me(u,se,h,R,p=>c(p).status==="not-safe");e.innerHTML=`
          <p class="forecast-summary">${ae}</p>
          <div class="forecast-well">
            ${D.map(p=>`
                <div class="forecast-box">
                  <span class="time">${p.time}</span>
                  <span class="weather-icon">${p.weatherIcon}</span>
                  <span class="temp" style="color: ${o(p.temp)};"><i class="fa-solid fa-temperature-quarter"></i> ${d(p.temp)}°F</span>
                  <span class="humidity" style="color: ${l(p.humidity)};"><i class="fa-solid fa-droplet"></i> ${d(p.humidity)}%</span>
                  ${N(p.windSpeed,p.windGust)}
                </div>
              `).join("")}
          </div>
        `}).catch(f=>{console.error("WeatherForecast: Fetch error:",f),e.innerHTML="<p>Error fetching forecast data.</p>"})};return document.addEventListener("settings-changed",u=>{r=u.detail.settings,console.log("WeatherForecast: Settings changed, new settings:",r)}),{updateForecast:P,setSafetyFns(u,y,k){c=u,o=y,l=k}}}"serviceWorker"in navigator&&navigator.serviceWorker.register("/pipe-safe/sw.js").then(e=>{console.log("Service Worker registered with scope:",e.scope)}).catch(e=>{console.error("Service Worker registration failed:",e)});const K=document.querySelector("#app"),ne=()=>{const e=localStorage.getItem("weatherApiKey"),i=localStorage.getItem("waiverAccepted");if(console.log("main.ts: renderApp called, apiKey:",!!e,"waiverAccepted:",i),e&&i==="true"){K.innerHTML=`
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
    `,te(document.querySelector("#settings-container")),ee(document.querySelector("#info-container")),document.querySelector("#api-key-container").innerHTML="";const s=document.querySelector("#parking-toggle-container");let a;try{console.log("main.ts: Initializing parking toggle"),a=$e(s)}catch(r){console.error("main.ts: Failed to initialize parking toggle:",r),K.innerHTML="<p>Error: Unable to initialize parking toggle.</p>";return}const n=Le(e),t=document.querySelector("#weather-container"),c=document.querySelector("#weather-forecast-container");console.log("main.ts: Initializing weather forecast");const o=Ie(c,n,r=>({status:"not-safe",reason:"Placeholder"}),r=>"#888888",r=>"#888888",a);console.log("main.ts: Initializing weather display");const l=Te(t,e,a,n,o);o.setSafetyFns(l.checkSafety,l.getTempColor,l.getHumidityColor)}else K.innerHTML=`
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
    `,te(document.querySelector("#settings-container")),ee(document.querySelector("#info-container")),e?document.querySelector("#api-key-container").innerHTML="":ue(document.querySelector("#api-key-container"),ne)};pe(K,ne);
