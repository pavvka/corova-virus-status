import React from 'react';
import './App.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';


class Settings extends React.Component {
  render(){
    return(
    <div className="row">
      <div className="col-lg-4">
        <div className="dropdown">
          <DropdownButton id="dropdown-basic-button" variant="secondary" title={this.props.sortBy}>
            <Dropdown.Item href="#" onClick={()=>this.props.sortArray("active")}>Active</Dropdown.Item>
            <Dropdown.Item href="#" onClick={()=>this.props.sortArray("critical")}>Critical</Dropdown.Item>
            <Dropdown.Item href="#" onClick={()=>this.props.sortArray("recovered")}>Recovered</Dropdown.Item>
            <Dropdown.Item href="#" onClick={()=>this.props.sortArray("total")}>Total</Dropdown.Item>
            <Dropdown.Item href="#" onClick={()=>this.props.sortArray("deaths")}>Deaths</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      <div className="col-lg-4"></div>
      <div className="col-lg-4">
      <div className="dropdown">
          <DropdownButton id="dropdown-basic-button" variant="secondary" title={this.props.showCountries}>
            <Dropdown.Item href="#" onClick={()=>this.props.changeCountriesAmmount(3)}>3</Dropdown.Item>
            <Dropdown.Item href="#" onClick={()=>this.props.changeCountriesAmmount(6)}>6</Dropdown.Item>
            <Dropdown.Item href="#" onClick={()=>this.props.changeCountriesAmmount(9)}>9</Dropdown.Item>
            <Dropdown.Item href="#" onClick={()=>this.props.changeCountriesAmmount(12)}>12</Dropdown.Item>
            <Dropdown.Item href="#" onClick={()=>this.props.changeCountriesAmmount(15)}>15</Dropdown.Item>
            <Dropdown.Item href="#" onClick={()=>this.props.changeCountriesAmmount(30)}>30</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
    </div>
    )
  }
}

class CountryCard extends React.Component {
  render(){
    var items = []
    const { getCode } = require('country-list');
    const showCountriesAmmount = -this.props.showCountries
    for (let i = 0; i < this.props.api.slice(showCountriesAmmount).length; i++) {
      var countryCode = getCode(this.props.api[i].country);
      if(countryCode === undefined){
        countryCode = this.props.api[i].country.slice(0,2).toUpperCase()
      }
      if(countryCode === "UK"){
        countryCode = "GB"
      }
      items.push(
      <div className="col-lg-4" key={i}>
        <div className="countryCard">
          <h3 className="countryCard__country">{this.props.api[i].country}</h3>
          <div>
            <img src={"https://www.countryflags.io/"+ countryCode +"/flat/64.png"} alt={this.props.api[i].country}></img>
          </div>
          <span>{this.props.sortBy.charAt(0).toUpperCase() + this.props.sortBy.substring(1) + ":"}</span>
          { this.props.sortBy!=="deaths" ? <h1 className="countryCard__title">{this.props.api[i].cases[this.props.sortBy]}</h1> : <h1 className="countryCard__title">{this.props.api[i].deaths.total}</h1>}
          <ul className="countryCard__infoList">
            { this.props.sortBy!=="active" ? <li className="countryCard__infoList__item">Active: {this.props.api[i].cases.active}</li> : ""}
            { this.props.sortBy!=="total" ? <li className="countryCard__infoList__item">Total infected: {this.props.api[i].cases.total}</li> : ""}
            { this.props.sortBy!=="deaths" ? <li className="countryCard__infoList__item">Deaths: {this.props.api[i].deaths.total}</li> : ""}
            { this.props.sortBy!=="recovered" ? <li className="countryCard__infoList__item">Recovered: {this.props.api[i].cases.recovered}</li> : ""}
            { this.props.sortBy!=="critical" ? <li className="countryCard__infoList__item">Critical: {this.props.api[i].cases.critical}</li> : ""}
          </ul>
        </div>
      </div>
      )
    }
    return (
      <div className="row">
        {items}
      </div>
    )
  }
}

class Search extends React.Component{
  constructor(){
    super()
    this.fieldChanged = this.fieldChanged.bind(this)
  }
  fieldChanged(value){
    console.log(value)
  }
  render(){
    return(
      <input onChange={event => this.fieldChanged(event.target.value)}></input>
    )
  }
}

// const CountryCardContainer = (props) =>{

//   return(
//     <div>
      
//     </div>
//   )
// }

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      api : [],
      sortBy: "active",
      showCountries: 3
    }
    this.sortArray = this.sortArray.bind(this)
    this.changeCountriesAmmount = this.changeCountriesAmmount.bind(this)
  }
  async componentDidMount(){
    try{
      const response = await fetch("https://covid-193.p.rapidapi.com/statistics", {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "covid-193.p.rapidapi.com",
          "x-rapidapi-key": "51b20adcd9msh684c652fb4ba30ap193f64jsn1b5bcc62dce8"
        }
      })
      const data = await response.json();
      this.setState({
        api : data.response
      })

    }
    catch(err){
      console.log(err)
    }
    await this.sortArray('active')
  }


  sortArray(param){
    var api = this.state.api
    var sortable = [];
    for (var key in api) {
      sortable.push(api[key]);
    }
    switch (param) {
      case 'active':
        sortable.sort(function(a, b) {
          return b.cases.active - a.cases.active;
        });
        break;
      case 'critical':
          sortable.sort(function(a, b) {
            return b.cases.critical - a.cases.critical;
          });
          break;
      case 'recovered':
          sortable.sort(function(a, b) {
            return b.cases.recovered - a.cases.recovered;
          });
          break;
      case 'total':
          sortable.sort(function(a, b) {
            return b.cases.total - a.cases.total;
          });
          break;
      case 'deaths':
          sortable.sort(function(a, b) {
            return b.deaths.total - a.deaths.total;
          });
          break;
    
      default:
        sortable.sort(function(a, b) {
          return b.cases.active - a.cases.active;
        });
        break;
    }

    this.setState({
      api : sortable,
      sortBy: param
    })
  }

  changeCountriesAmmount(ammount){
    this.setState({
      showCountries : ammount
    })
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <div className="container">
          <div className="row">
            <div className="col-lg-4"></div>
            <div className="col-lg-4"><h1>COVID-19 STATUS</h1></div>
            <div className="col-lg-4"></div>
          </div>
            <Search api={this.state.api} />
            <Settings sortArray={this.sortArray} sortBy={this.state.sortBy} changeCountriesAmmount={this.changeCountriesAmmount} showCountries={this.state.showCountries} />
            <CountryCard api={this.state.api} showCountries={this.state.showCountries} sortBy={this.state.sortBy} />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
