import { useEffect, useState } from 'react'
import './App.css'
import CoinInfo from './components/CoinInfo'

function App() {
  let tries = 0
  const MAX_ATTEMPTS = 1
  const [list, setList] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [filteredResult, setFilteredResult] = useState([])
  const API_KEY = import.meta.env.VITE_APP_API_KEY
  // localStorage.clear()
  useEffect(() => {
    const fetchTopCoins = async() => {
      const response = await fetch("/api/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1", {
        headers: {
          'x-cg-demo-api-key': API_KEY
        }
      })
      const data = await response.json();

      localStorage.setItem("data", JSON.stringify(data));
      setList(data);
    }
    const storedString = localStorage.getItem("data")
    const localData = JSON.parse(storedString)
    if (localData != null) {
      setList(localData)
    } else {
      if (tries <= MAX_ATTEMPTS) fetchTopCoins().catch((console.errors));
      tries += 1
    }
  }, []);

  const searchItems = (event) => {
    let foundCoins = []
    const searchValue = event.target.value.toLowerCase()
    setSearchInput(searchValue)
    const isAlphaNumeric = (str) => /^[a-z0-9]+$/i.test(str);
    if (!list) return;
    if (searchValue == null || 
        searchValue == "" || 
        !isAlphaNumeric(searchValue)) {
      setFilteredResult([])
      return;
    }

    for (const coin of list) {
      const symbol = coin.symbol ? String(coin.symbol).toLowerCase().trim() : ''
      const name = coin.name ? String(coin.name).toLowerCase().trim() : ''
      const id = coin.id ? String(coin.id).toLowerCase().trim() : ''
      const names = [symbol, name, id]
      const coinMatches = names.some(item => item.includes(searchValue))
      if (coinMatches){
        foundCoins[foundCoins.length] = coin
      }
    }
    setFilteredResult(foundCoins)
  }

  return (
    <div className='whole-page'>
      <h1>Top Coins by Market Cap</h1>
      <input placeholder='Search...' onChange={searchItems}/>
        {filteredResult.length > 0 ? 
        (
          filteredResult && filteredResult?.map((coin, index) => (
            <CoinInfo
            index={index}
            key={coin.id}
            id={coin.id}
            image={coin.image}
            name={coin.name}
            symbol={coin.symbol}
            price={coin.current_price}
            />
          ))
        ) : 
        (
          list && list?.map((coin, index) => (
            <CoinInfo
            index={index}
            key={coin.id}
            id={coin.id}
            image={coin.image}
            name={coin.name}
            symbol={coin.symbol}
            price={coin.current_price}
            />
          ))
        )
        }
    </div>
  )
}

export default App
