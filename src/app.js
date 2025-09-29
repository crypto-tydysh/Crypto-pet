import React, { useState, useEffect } from 'react';

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";

const defaultCoins = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" }
];

function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({});
  const [coin, setCoin] = useState(defaultCoins[0].id);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const ids = portfolio.length
      ? portfolio.map(c => c.id).join(",")
      : defaultCoins.map(c => c.id).join(",");
    fetch(`${COINGECKO_API}?ids=${ids}&vs_currencies=usd`)
      .then(res => res.json())
      .then(setPrices);
  }, [portfolio]);

  const handleAdd = e => {
    e.preventDefault();
    const exists = portfolio.find(c => c.id === coin);
    if (exists) return;
    const coinObj = defaultCoins.find(c => c.id === coin);
    setPortfolio([...portfolio, { ...coinObj, amount: parseFloat(amount) }]);
    setAmount("");
  };

  const total = portfolio.reduce((sum, c) => {
    const price = prices[c.id]?.usd || 0;
    return sum + price * c.amount;
  }, 0);

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Crypto Portfolio Tracker</h2>
      <form onSubmit={handleAdd}>
        <select value={coin} onChange={e => setCoin(e.target.value)}>
          {defaultCoins.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Количество"
          min="0"
          step="any"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <button type="submit">Добавить</button>
      </form>

      <h3>Ваш портфель</h3>
      <table width="100%" border="1" cellPadding="4">
        <thead>
          <tr>
            <th>Монета</th>
            <th>Кол-во</th>
            <th>Цена, $</th>
            <th>Сумма, $</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map(c => (
            <tr key={c.id}>
              <td>{c.name} ({c.symbol})</td>
              <td>{c.amount}</td>
              <td>{prices[c.id]?.usd ?? '...'}</td>
              <td>{((prices[c.id]?.usd || 0) * c.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Общая стоимость: ${total.toFixed(2)}</h3>
      <p style={{ fontSize: 12, color: "#888" }}>
        Курсы подтягиваются с <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer">Coingecko</a>
      </p>
    </div>
  );
}

export default App;
