import {useEffect, useState} from 'react'
import '../App.css'

const CoinDetail = ({coin}) => {
  let tries = 0
  const MAX_ATTEMPTS = 1
  const API_KEY = import.meta.env.VITE_APP_API_KEY
  const [currCoin, setCoin] = useState(null);
  
  useEffect(() => {
    const fetchCoinsById = async() => {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`, {
        method: "GET",
        headers: {
          'x-cg-demo-api-key': API_KEY,
        }
      })
      const data = await response.json()
      const stringData = JSON.stringify(data)
      
      localStorage.setItem(data.id, stringData)
      setCoin(JSON.parse(stringData))
    }
    const storedString = localStorage.getItem(coin.id);
    const localData = JSON.parse(storedString)

    if (localData != null) {
      setCoin(localData)
    } else {
      if (tries <= MAX_ATTEMPTS) fetchCoinsById().catch((console.errors))
      tries += 1
    }
  }, [])

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
            {currCoin.hashing_algorithm ? `The coin was built with the algorithm : <strong>${currCoin.hashing_algorithm}</strong>` : ""}
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