import { useParams } from 'react-router';
import CoinDetail from '../components/CoinDetail';
import { useState, useEffect } from 'react';

const DetailView = ({ coins }) => {
  const [loadedCoins, setLoadedCoins] = useState(coins);
  const [loading, setLoading] = useState(!coins);
  let params = useParams();

  useEffect(() => {
    // If coins were already passed via props, use them
    if (coins && coins.length > 0) {
      setLoadedCoins(coins);
      setLoading(false);
      return;
    }

    const fetchCoins = async () => {
      const storedString = localStorage.getItem("data");
      
      if (storedString) {
        const localData = JSON.parse(storedString);
        setLoadedCoins(localData);
        setLoading(false);
      } else {
        try {
          const API_KEY = import.meta.env.VITE_APP_API_KEY;
          const response = await fetch(
            `/api/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1`,
            {
              method: "GET",
              headers: {
                "x-cg-demo-api-key": API_KEY,
              },
            }
          );
          const data = await response.json();
          localStorage.setItem("data", JSON.stringify(data));
          setLoadedCoins(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCoins();
  }, [coins]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!loadedCoins) {
    return <h3>Coin cannot be retrieved</h3>;
  }

  if (params.id >= loadedCoins.length) {
    return <h3>Index out of bounds</h3>;
  }

  const coin = loadedCoins[params.id];

  return (
    <div className='DetailView'>
      <CoinDetail coin={coin} />
    </div>
  );
};

export default DetailView;