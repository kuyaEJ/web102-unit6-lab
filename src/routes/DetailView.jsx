import {useParams} from 'react-router'
import CoinDetail from '../components/CoinDetail'
import {useState} from 'react'
const DetailView = ({coins}) => {
  const [] = useState(null)
  let params = useParams()

  try {
    if (params.id > coins.length) {
      return (<h3>Index out of bounds</h3>)
    }
  } catch (error) {
    console.error(error)
    return (<h3>Coin cannot be retrieved</h3>)
  }
  
  const coin = coins[params.id]
  return (
    <div className='DetailView'>
      <CoinDetail coin={coin}/>
    </div>
  )
};
export default DetailView