import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Infobox from "./components/infobox/Infobox";
import Map from "./components/map/Map";
import Table from "./components/table/Table";
import "leaflet/dist/leaflet.css";
import LineGraph from "./components/linegraph/LineGraph";

const RETRIEVE_COUNTRIES_URL = "https://disease.sh/v3/covid-19/countries";
const ALL_COUNTRIES_STATS_URL = "https://disease.sh/v3/covid-19/all";
const INDIVIDUAL_COUNTRY_STATS_URL = "https://disease.sh/v3/covid-19/countries/";
const CASES_TYPES = {
  cases: 'cases',
  recovered: 'recovered',
  deaths: 'deaths'
};

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountryStats, setSelectedCountryStats] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const mapZoom = useRef(3);
  const mapCountries = useRef([]);
  const [casesType, setCasesType] = useState(CASES_TYPES.cases);

  //Retrieve the list of all the Countries.
  useEffect(() => {
    //Async code to fetch the list of countries.
    (async () => {
        await fetch(RETRIEVE_COUNTRIES_URL)
              .then(res => res.json())
              .then(data => {
                setTableData(data);
                setCountries(data.map(country => ({
                  name: country.country,
                  value: country.countryInfo.iso2
                })));
                mapCountries.current = data;
              })
              .catch(err => {
                console.log(err);
              });
    })();
  }, []);

  //Retrieve the stats of all the countries, for the initial render.
  useEffect(() => {
    (async () => {
        await fetch(ALL_COUNTRIES_STATS_URL)
              .then(res => res.json())
              .then(data => {
                setSelectedCountryStats(data);
              });
    })();
  }, []);

  //Update the selected country's value
  const updateSelectedCountry = async (event) => {
    const countryCode = (event.target.firstElementChild || {getAttribute: () => ""}).getAttribute("value");
    //Retrieve the stats for the selected country.
    const URL = countryCode ? INDIVIDUAL_COUNTRY_STATS_URL + countryCode : ALL_COUNTRIES_STATS_URL;
    await fetch(URL)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            setSelectedCountryStats(data);
            setMapCenter([((data.countryInfo || {}).lat) || 0, ((data.countryInfo || {}).long) || 0]);
            mapZoom.current = 5;
          })
          .catch(err => {
            console.log(err);
          });
  };

  /**
   * Update the type of cases to be highlighted.
   */
  const updateCasesType = (event) => {
    const type =event.currentTarget.getAttribute("casestype");
    setCasesType(CASES_TYPES[type] || CASES_TYPES.cases);
  };

  /**
   * Utility to sort the tableData by the cases.
   * @asc -> Ascending order
   */
  const sortTableDataByCases = (asc = false) => {
      setTableData(tableData.sort((x, y) => {
        if(asc) {
          if(x.cases > y.cases) return 1;
          return -1;
        }
        else {
          if(x.cases > y.cases) return -1;
          return 1;
        }
      }));
  };

  /**
   * Utility to sort the tableData by the name.
   * @asc -> Ascending order.
   */
  const sortTableDataByName = (asc = false) => {
    setTableData(tableData.sort((x, y) => {
      if(asc) {
        if(x.country > y.country) return 1;
        return -1;
      }
      else {
        if(x.country > y.country) return -1;
        return 1;
      }
    }));
  };

  return (
    <div className="App">
        <div className="App-left-panel">
            <div className="App-header">
              <div className="App-header-title">
                <h3>COVID19 TRACKER</h3>
              </div>
              <Autocomplete
                id="combo-box-demo"
                options={countries}
                getOptionLabel={(country) => country.name}
                onChange={updateSelectedCountry}
                style={{ width: 300 }}
                renderOption={option => (<span value={option.value}>{option.name}</span>)}
                renderInput={(params) => <TextField {...params} label="Filter stats by Country" variant="outlined" />}
              />
            </div>
            <div className="App-left-panel-info-boxes-wrapper">
              <Infobox title="Cases" total={selectedCountryStats.cases} today={selectedCountryStats.todayCases} 
                updateCasesType={updateCasesType} casesType="cases" key="cases" active={casesType === CASES_TYPES.cases} />
              <Infobox title="Recovered" total={selectedCountryStats.recovered} today={selectedCountryStats.todayRecovered}
                updateCasesType={updateCasesType} casesType="recovered" key="recovered" active={casesType === CASES_TYPES.recovered} />
              <Infobox title="Deaths" total={selectedCountryStats.deaths} today={selectedCountryStats.todayDeaths}
                updateCasesType={updateCasesType} casesType="deaths" key="deaths" active={casesType === CASES_TYPES.deaths}/>
            </div>
            <Map center={mapCenter} zoom={mapZoom.current} countries={mapCountries.current} casesType={casesType} />
        </div>

        <div className="App-right-panel">
            <Table title="Live Cases by Country" data={tableData} sortDataByName={sortTableDataByName} 
                  sortDataByCases={sortTableDataByCases}/>
            <LineGraph casesType={casesType}/>
        </div>

      </div>
  );
}

export default App;
