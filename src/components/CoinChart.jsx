import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts'
const CoinChart = ({market, name}) => {
  const prices = market ? market.prices : [];
  const startTimestamp = market ? prices?.[0]?.[0] : '';
  const midTimestamp = prices[Math.floor(prices.length / 2)]?.[0];
  const endTimestamp = market ? prices?.[prices.length - 1]?.[0] : '';
  const xAxisTicks = prices ? prices.filter((_, index) => index %10===0 || index === prices.length - 1).map(([timestmap]) => timestmap) : [startTimestamp, midTimestamp, endTimestamp];


  const formatLargeNumber = (input) => {
    const num = Number(input)
    if (isNaN(num)) return input;
    return new Intl.NumberFormat('en-US', {
      notation:'compact',
      compactDisplay:'short',
    }).format(num);
  }
  return (
    <div className='CoinChart'>
      <h3>30-Day Price Data For {name}</h3>
      {market ? (
        <LineChart 
          className='LineChart'
          responsive data={market.prices.map(([timestamp, price]) => ({timestamp, price}))}
          margin={{ bottom: 25, left: 40, top: 10, right: 10}}
          >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={true} 
            horizontal={true} 
            stroke="#374151" // Grid line color (dark gray)
            syncWithTicks={true}
          />
          <XAxis dataKey="timestamp" 
                  type='number'
                  domain={['dataMin', 'dataMax']}
                  scale="linear"
                  ticks={xAxisTicks}
                  tickMargin={14}
                  tickFormatter={(value) => new Date(value).toLocaleDateString([], {month: 'numeric', day: 'numeric', year:'numeric'})}
                  label={{ value: 'Dates', position: 'bottom', offset: 10, fill: '#6b7280' }}
          />
          <YAxis domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${formatLargeNumber(value.toFixed(4))}`}
                  label={{ value: 'Prices', angle: -90, position: 'insideLeft', offset: -10, fill: '#6b7280' }}
          />
          <Tooltip 
            shared={true}
            formatter={(value) => [`$${value > 1 ? value.toLocaleString() : value}`, "Price"]}
            labelFormatter={(label) => new Date(label).toLocaleString([], {
              month: 'short',
              day: 'numeric',
            })}
          />
          <Line type="monotone" dataKey="price" stroke='#8884d8' dot={true}/>
        </LineChart>
      ) : (<></>)}
    </div>
  )
};
export default CoinChart