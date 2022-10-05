// Variables
const api_key = "cb2b126345ed88be7a0616fb56721a9d";
const search_bar_el = document.getElementById("search_bar");
const search_btn_el = document.getElementById("submit_btn");

const city_name_el = document.getElementById("city_name");
const time_el = document.getElementById("time");
const day_el = document.getElementById("day");
const date_el = document.getElementById("date");
const weather_img_el = document.getElementById("weather_img");
const temperature_el = document.getElementById("temperature");
const weather_type_el = document.getElementById("weather_type");
const feels_like_el = document.getElementById("feels_like");
let is_One_Digit_Date;
let is_One_Digit_Month;
let date_int;
let month_int;
let year_int;
let new_hours;
let new_minutes;
let new_day;
let new_time_str;
let clearRunningInterval;
let time_zone;
let country_code;

// Chaning Time/Day/Date
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


// Navigator 
navigator.geolocation.getCurrentPosition((position) => {
    console.log("Navigator Function Started");
    const lati = position.coords.latitude;
    const longi = position.coords.longitude;
    
    async function geocodingFunction() {
        const getGeocodingApi = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${longi},${lati}`);
        const getGeocodingApiData = await getGeocodingApi.json();
        // const getGeocodingApiData = await getGeocodingApi.json();
        initialCity = getGeocodingApiData.address.City;
        weatherData(initialCity);
    }
    geocodingFunction();
    console.log("Navigator Function Ended");
});


// API CALL: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=cb2b126345ed88be7a0616fb56721a9d

// Searching from Search Bar
search_btn_el.addEventListener("click", function(event) {
    console.log("Search Button was clicked.")
    city_searched = search_bar_el.value;
    // Searching for City Data
    weatherData(city_searched); 
    
    // Preventing Page
    event.preventDefault();
});


// Weather Data Function -> [All DOM Manipulation Here]
// First API [Gets Data by City Name]
async function weatherData(city_searched) {
    console.log("Weather Data function started.")
    const api_fetched = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_searched}&units=metric&appid=${api_key}`)
    const data = await api_fetched.json()
    console.log("API 1 Fetched! Data Below")
    console.log(data);
    
    // Creating Variables from Fetched Data
    const temperature = (data.main.temp).toFixed(1);
    const weather_type = data.weather[0].main;
    const id = data.weather[0].id;
    const feels_like_fetched = (data.main.feels_like).toFixed(1); 
    
    // Changing City Name
    city_name_el.innerHTML = data.name;
    
    // Changing temperature
    temperature_el.innerHTML = temperature +" \u00B0C";
    feels_like_el.innerHTML = `Feels like ${feels_like_fetched} \u00B0C`

    // Chaning Weather Type
    weather_type_el.innerHTML = weather_type;
    
    // Changing Weather Icon 
    
    if (weather_type == "Thunderstorm") {
        weather_img_el.src = "images/thunderstorm.png";
    } else if (weather_type == "Drizzle") {
        weather_img_el.src = "images/drizzle.png";
    } else if (weather_type == "Rain") {
        weather_img_el.src = "images/rain.png";
    } else if (weather_type == "Snow") {
        weather_img_el.src = "images/snow.png";
    } else if (weather_type == "Haze") {
        weather_img_el.src = "images/haze.png";
    } else if (weather_type == "Fog") {
        weather_img_el.src = "images/fog.png";
    } else if (weather_type == "Clear") {
        weather_img_el.src = "images/clear.png";
    } else if (weather_type == "Clouds") {
        weather_img_el.src = "images/clouds.png";
    } else if (weather_type == "Smoke") {
        weather_img_el.src = "images/smoke.png";
    } 
    
    
    // Getting Country Code
    country_code = data.sys.country;
    console.log("Country Code -> " + country_code);
    
    // Daily Forecast
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    
    // Getting Data From Second API
    // For Daily Forecast
    console.log("Weather Data was ended.")
    getNewAPI(lat, lon, country_code);
};

// Second API [Gets Data by Latitude and Longitude]
async function getNewAPI(lat, lon, country_code) {
    console.log("getNewAPI function started")
    // const s_api_key = "977e8bc88c659aaa96ea308845c38993";
    const second_api = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`);
    const s_data = await second_api.json();
    console.log("2nd API Fecthed! Data Below:");
    console.log(s_data);
    
    // Setting Time zone
    time_zone = s_data.timezone;
    console.log("Timezone -> " + time_zone);
    
    console.log("getNewAPI function was ended");
    // Calling getRegionTime() to get Time and Date of Searched Region
    getRegionTime();
}

function getRegionTime() {
    // console.log("getRegionTime function started")
    
    // time_zone and country_code here are Global Variables
    new_time_str = new Date().toLocaleString(`en-${country_code}`, {timeZone:time_zone, timeZoneName: "short"});
    
    // console.log("Locale String: " + new_time_str)
    // Splitting new_time_str and storing its parts in an ARRAY(time_split)
    const time_split = new_time_str.split(" ");
    // console.log(time_split);
    
    // Getting the Time Part
    const time_str = time_split[1];
    // console.log(time_str);
    
    // Getting the Year, Months, Date, Part
    const yr_mon_date = time_split[0];
    yr_mon_date_arr = yr_mon_date.split("");
    // console.log(yr_mon_date_arr);
    
    // Splitting Time Part to get HOUR AND MINUTES in STRING TYPE
    const time_str_arr = time_str.split(":");
    
    // Date True False Conditions
    if ((yr_mon_date_arr.slice(1,2)[0] == "/") && (yr_mon_date_arr.slice(3,4)[0] == "/")) {
        is_One_Digit_Date = true;
        is_One_Digit_Month = true;
    } else if ((yr_mon_date_arr.slice(1,2)[0] == "/") && (yr_mon_date_arr.slice(4,5)[0] == "/")) {
        is_One_Digit_Date = true;
        is_One_Digit_Month = false;
    } else if ((yr_mon_date_arr.slice(2,3)[0] == "/") && (yr_mon_date_arr.slice(4,5)[0] == "/")) {
        is_One_Digit_Date = false;
        is_One_Digit_Month = true;
    } else if ((yr_mon_date_arr.slice(2,3)[0] == "/") && (yr_mon_date_arr.slice(5,6)[0] == "/")) {
        is_One_Digit_Date = false;
        is_One_Digit_Month = false;
    }
    
    // New Year, New Month and New Date Digit Conditions 
    if ((is_One_Digit_Date === true) && (is_One_Digit_Month === true)) {
        date_int = parseInt(yr_mon_date_arr.slice(0,1)[0]);
        month_int = parseInt(yr_mon_date_arr.slice(2,3)[0]);
        year_int = parseInt((yr_mon_date_arr.slice(4,8)).join(''));
    } else if ((is_One_Digit_Date === true) && (is_One_Digit_Month === false)) {
        date_int = parseInt(yr_mon_date_arr.slice(0,1)[0]);
        month_int = parseInt((yr_mon_date_arr.slice(2,4)).join(''));
        year_int = parseInt((yr_mon_date_arr.slice(5,9)).join(''));
    } else if ((is_One_Digit_Date === false) && (is_One_Digit_Month === true)) {
        date_int = parseInt((yr_mon_date_arr.slice(0,2)).join(''));
        month_int = parseInt(yr_mon_date_arr.slice(3,4)[0]);
        year_int = parseInt((yr_mon_date_arr.slice(5,9)).join(''));
    } else if ((is_One_Digit_Date === false) && (is_One_Digit_Month === false)) {
        date_int = parseInt((yr_mon_date_arr.slice(0,2)).join(''));
        month_int = parseInt((yr_mon_date_arr.slice(3,5)).join(''));
        year_int = parseInt((yr_mon_date_arr.slice(6,10)).join(''));
    }
    // Chaning DOM
    date_el.innerHTML = months[month_int - 1] + " " + date_int;
    

    // INITIALIZING New Timings in INT TYPE
    new_hours = parseInt(time_str_arr[0]);
    new_minutes = parseInt(time_str_arr[1]);
    
    new_day = getDayName(year_int, month_int, date_int, new_hours, new_minutes);
    
    runSetInterval();
}
function getDayName(year, month, date, hours, minutes) {
    const get_day = new Date(year, month-1, date, hours, minutes);
    // console.log(get_day.getDay());
    return get_day.getDay();
}


function runSetInterval() {
    clearRunningInterval = setInterval(() => {
        const new_am_pm = (new_hours >= 12) ? "PM" : "AM";
        new_proper_minutes = (new_minutes<10)? "0" + new_minutes : new_minutes;
        
        // Changing DOM
        time_el.innerHTML = new_hours + ":" + new_proper_minutes + " " + new_am_pm;
        day_el.innerHTML = days[new_day];
    
        getRegionTime();
        // console.log(time_el.innerHTML);
    }, 1000);
}
