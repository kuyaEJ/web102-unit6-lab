import {useEffect, useState} from 'react'
import '../App.css'
import CoinChart from './CoinChart'

const CoinDetail = ({coin}) => {
  if (!coin.id) return (<p>Coin data couldn't load</p>);
  const [currCoin, setCoin] = useState(null);
  const [market, setMarket] = useState(null);

  useEffect(() => {
    let controllerId = new AbortController();
    let controllerMarket = new AbortController();
    const API_KEY = import.meta.env.VITE_APP_API_KEY
    let tries = 0
    const MAX_ATTEMPTS = 1

    const fetchJson = async (url, controller) => {
      const signal = controller.signal
      try {
        const API_START = "/api"
        const response = await fetch(`${API_START}/${url}`, {
            method: "GET",
            headers: {
              "x-cg-demo-api-key": API_KEY,
            },
            signal: signal,
          })
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
          return await response.json()
      } catch (error ) {
        if (error.name == "AbortError") {
          console.log("Do nothing for abort error")
          return;
        }
        console.error(error)
      }
    }

    // Named params and defaults
    const updateState = async({url, localStorageName=coin.id, setState, controller}) => {
      const fetchMethod = fetchJson(`${url}`, controller).catch((console.error))
      const data = await fetchMethod
      let stringData;
      if (data) {
        stringData = JSON.stringify(data)
        localStorage.setItem(localStorageName, stringData)
        setState(JSON.parse(stringData))
      }
      return data
    }

    const getCurrentDate = () => {
      const unixSeconds = Math.floor(Date.now() / 1000);
      return unixSeconds
    }

    const get30DayAgo = () => {
      const date = new Date();
      date.setDate(date.getDate()-30);
      const unixSeconds = Math.floor(date.getTime() / 1000);
      return unixSeconds
    }

    const fetchMarketChartById = async(id=coin.id) => {
      const params = new URLSearchParams({
        vs_currency: "usd",
        from: get30DayAgo(),
        to: getCurrentDate(),
        interval: 'daily',
        precision: 2
      })

      const data = await updateState({
        url: `${id}/market_chart/range?${params.toString()}`, 
        localStorageName: id+"-market", 
        setState: setMarket,
        controller: controllerMarket
      })
      
      console.log(data)
      console.log("fetching")
    }
    
    const fetchCoinsById = async(id=coin.id) => {
      const data = await updateState({
        url: id, 
        setState: setCoin,
        controller: controllerId
      })
      console.log("fetching")
    }

    const testFetch = ({localStorageName=coin.id, setState, fetchFunc}) => {
      const storedString = localStorage.getItem(localStorageName);

      let localData;
      if (storedString) localData = JSON.parse(storedString)
      
      if (localData != null) {
        setState(localData)
      } else {
        if (tries <= MAX_ATTEMPTS) fetchFunc()
        tries += 1
      }
    }

    testFetch({
      setState: setCoin,
      fetchFunc: fetchCoinsById
    })
    
    testFetch({
      localStorageName: `${String(coin.id) + "market"}`,
      setState: setMarket,
      fetchFunc: fetchMarketChartById
    })
    
    return () => {controllerId.abort("Cancelled fetch"); controllerMarket.abort("Cancelled fetch");}
  }, [coin.id])

  const convertToDateFormat = (dateString) => {
    const [year, month, day] = dateString.split('-')
    const date = new Date(Date.UTC(year, month - 1, day))

    const weekDay = new Intl.DateTimeFormat('en-US', {weekday:'long', timeZone:'UTC'}).format(date)
    const monthName = new Intl.DateTimeFormat('en-US', {month:'long', timeZone:'UTC'}).format(date)

    return `${weekDay} - ${monthName} ${day}, ${year}`
  }

  const infoTable = currCoin ? {
    "Launch Date": currCoin.genesis_date ? convertToDateFormat(currCoin.genesis_date) : "",
    "Website": currCoin.links ? <a className="Link" href={currCoin.links.homepage[0]}>{currCoin.links.homepage[0]}</a> : "",
    "Monetary Symbol": currCoin.symbol ? currCoin.symbol.toString().toUpperCase() : "",
    "Volume": currCoin.market_data ? currCoin.market_data.total_volume.usd.toLocaleString() : "",
    "Current Price": currCoin.market_data ? `$${currCoin.market_data.current_price.usd.toLocaleString()}` : "",
    "Highest Price (24h)":currCoin.market_data ? `$${currCoin.market_data.high_24h.usd.toLocaleString()}` : "",
    "Lowest Price (24h)":currCoin.market_data ? `$${currCoin.market_data.low_24h.usd.toLocaleString()}`: "",
    "Change from Previous Day":currCoin.market_data ? `$${Number(parseFloat(currCoin.market_data.price_change_24h)).toFixed(2).toLocaleString()}${Number(parseFloat(currCoin.market_data.market_cap_change_percentage_24h.toLocaleString())).toFixed(2)}%` : "",
    "Market Cap":currCoin.market_data ? `$${currCoin.market_data.market_cap.usd.toLocaleString()}` : "",
  } : {};

  return (
    <div className='CoinDetail'>
      {currCoin ? (
        <>
          <h1>{currCoin.name}</h1>
          <div className='coinContainer2'>
            {currCoin.image ? <img className="coinImage" src={currCoin.image.large} alt={`Coin image for ${coin.symbol}`}/> : ""}
          </div>
          <p className='desc'>
            {currCoin.description ? currCoin.description.en : ""}
          </p>

          <p className="Note">
            The coin was built with the algorithm:
            {currCoin.hashing_algorithm ? (
              <strong> {currCoin.hashing_algorithm}</strong>
              ) : ""}
          </p>
          
          <div className='listTable'>
            {Object.entries(infoTable).map((item, index) => (
              item ? (
                <div className="tableRow" key={index}>
                  <div className='tableLeft'>{item[0]}</div>
                  <div className='tableRight'>{item[1]}</div>
                </div>
              ) : (<p></p>)
            ))}
          </div>

          <CoinChart market={market} name={coin.name}/>
        </>
        
      ) : (
        <>
          <p>Loading coin...</p>
        </>
      )}
    </div>
  )
};
export default CoinDetail