import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts'
const CoinChart = ({market, name}) => {
  const prices = market ? market.prices : [];
  const startTimestamp = market ? prices?.[0]?.[0] : '';
  const midTimestamp = prices[Math.floor(prices.length / 2)]?.[0];
  const endTimestamp = market ? prices?.[prices.length - 1]?.[0] : '';
  const xAxisTicks = prices ? prices.filter((_, index) => index %7===0 || index === prices.length - 1).map(([timestmap]) => timestmap) : [startTimestamp, midTimestamp, endTimestamp];

  return (
    <div className='CoinChart'>
    <h3>30-Day Price Data For {name}</h3>
    {market ? (
      <LineChart 
        responsive data={market.prices.map(([timestamp, price]) => ({timestamp, price}))}
        style={{
          minWidth:0, 
          height:'400px',
          width: '100%',
          maxWidth: 600 
        }}
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
                tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
                label={{ value: 'Prices', angle: -90, position: 'insideLeft', offset: -25, fill: '#6b7280' }}
        />
        <Tooltip 
          shared={true}
          formatter={(value) => [`$${Math.round(value).toLocaleString()}`, "Price"]}
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