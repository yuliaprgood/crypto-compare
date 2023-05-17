export const API_KEY = '0ddc6fa72018e82b2ca075e7fe3ecb7342bb484fc387908d37bd562174ee0737';

// может отдать ошибку, если такой валюты не существует
export const getSingleCoin = async (coin: string) => {
    const SINGLE_COIN_URL = `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD&api_key=${API_KEY}`;
    const res = await fetch(SINGLE_COIN_URL);
    const data = await res.json();
    return data;
}

// просто отдает список данных тех валют, которые нашлись
export const getMultiCoins = async (coins: string[]) => {
    const MULTI_COIN_URL = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins.join(',')}&tsyms=USD&api_key=${API_KEY}`;
    const res = await fetch(MULTI_COIN_URL);
    const data = await res.json();
    return data;
}
