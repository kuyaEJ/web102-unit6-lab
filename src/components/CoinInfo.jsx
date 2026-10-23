import '../App.css'
import { Link } from 'react-router'
const CoinInfo = ({id, index, image, name, symbol, price}) => {
  return (
    <>
    {price != null ? (
      <li className="main-list">
        <div className='coinContainer'>
          <img className="coinImage" src={image} alt={`Coin image for ${symbol}`}/>
          <div className="coin">
            <Link to={`/coinDetails/${index}`} className="coinName">{name}</Link>
            <div className="coinSymbol">{symbol}</div>
          </div>
          <div className="coinPrice">${price.toLocaleString()} USD</div>
        </div>
      </li>
      ) : (
        <></>
      )
    }
    </>
  )
}
export default CoinInfo