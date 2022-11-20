import './css/styles.css';
import {fetchCountries} from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 500;
const debounce = require('lodash.debounce');
let searchQuery;

const refs = {
    searchInp:document.querySelector('#search-box'),
    countryList:document.querySelector('.country-list'),
    countryInfo:document.querySelector('.country-info'),
}

refs.searchInp.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY))

function onInput(e){

    searchQuery = e.target.value.trim();
    if(!searchQuery){
        Notify.info('Enter the country name');
        refs.countryList.innerHTML='';
        refs.countryInfo.innerHTML='';
        return;
    }

    fetchCountries(searchQuery).then(data => {
        checkCountriesArray(data)
              
    }).catch(err =>Notify.warning('Oops, there is no country with that name'))
}

function checkCountriesArray(data){
    if(data.some(item=>item.name.toLowerCase()===searchQuery.toLowerCase())){
   
        refs.countryList.innerHTML='';
        createMarkupCountryInfo(...data)

    } else if(data.length>10)
    {
        Notify.info('Too many matches found. Please enter a more specific name.');

       } else if(data.length>=2 && data.length<=10){
    createMarkupCountryList(data) 

        } else if (data.length===1){
        refs.countryList.innerHTML='';
        createMarkupCountryInfo(...data)
    } 
}

function createMarkupCountryList(arr){
    const markup = arr.map(item =>
     `<li><img src="${item.flags.svg }" alt="${item.name}" width="40px"><span>${item.name}</span></li>`).join('')
     refs.countryList.innerHTML=markup;
}

function createMarkupCountryInfo(data){
    // const country = arr[0];
    const listOfLanguages = data.languages.map(item =>item.name).join(', ')
    const markup = `<img src="${data.flags.svg}" alt="${data.name}" width="30px"><span class="js-country-name">${data.name}</span>
    <p><span class="js-property-name">Capital: </span>${data.capital}</p>
    <p><span class="js-property-name">Population: </span>${data.population}</p>
    <p><span class="js-property-name">Languages: </span>${listOfLanguages}</p>` 
   
    refs.countryInfo.innerHTML = markup
}