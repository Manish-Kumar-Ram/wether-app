// const Search_btn=document.getElementById('Search-btn');
// let search=document.querySelector('#search');
// // const Search_input=document.getElementById('search');
// // const resultDiv=document.getElementById('resdiv')
// // const 
// const cityname=document.getElementById('cityname');
// const citytime=document.getElementById('citytime');
// const cityTempratuire=document.getElementById('cityTemp')
// async function getDataFromapi(cityname){
//     const  fetchdata= await fetch(`http://api.weatherapi.com/v1/current.json?key=930971becfa941f882053344220412&q=${cityname}&aqi=yes`)
// return await fetchdata.json();
// }
// Search_btn.addEventListener('click', async ()=>{
//     // let url='https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q='+search+'&key=AI'
//     const values=search.value;
//   const result=  await getDataFromapi(values)
//   cityname.innerText=`${result.location.name},${result.location.region} -${result.location.country}`
// citytime.innerText=result.location.localtime;
// cityTempratuire.innerText=`${result.current.temp_c}°C`
//   console.log(result);


// })

const apikey = 'a6f2ecb21bab1f26f7216448a4f7ff49';
const forms = document.querySelector('form');
const searchbox = document.querySelector('#search');
const weather = document.querySelector('#weather');
const getbtn = document.getElementById('long');

// Predefined list of country codes and their full names
const countries = {
  "US": "United States",
  "CA": "Canada",
  "IN": "India",
  "GB": "United Kingdom",
  // Add more countries as needed
};

const getWeather = async (city, lat = null, lon = null) => {
  weather.innerHTML = '<h2>Loading ...</h2>';
  let url;

  if (lat !== null && lon !== null) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    return showWeather(data);
  } catch (error) {
    alert(error.message);
    weather.innerHTML = ''; // Clear loading message on error
  }
};

const showWeather = (data) => {
  console.log(data);
  if (data.cod === '404') {
    weather.innerHTML = '<h2> City not found </h2>';
    return;
  }

  const countryFullName = countries[data.sys.country] || data.sys.country;

  weather.innerHTML = `
    <div>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
    </div>
    <div>
      <h1 id="cityname">${data.name}, ${countryFullName}</h1>
      <h2>${data.main.temp} °C</h2>
      <h4>${data.weather[0].description}</h4>
    </div>`;
};

async function gotLocation(position) {
  const { latitude, longitude } = position.coords;
  await getWeather(null, latitude, longitude);
}

function failedToLoad() {
  alert('Unable to get your location');
}

getbtn.addEventListener('click', (event) => {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(gotLocation, failedToLoad);
});

forms.addEventListener('submit', function (event) {
  event.preventDefault();
  const city = searchbox.value.trim();
  if (!city) {
    alert("Please enter a valid City");
    return;
  }
  getWeather(city);
  searchbox.value = '';
});
