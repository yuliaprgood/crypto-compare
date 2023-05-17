import React, {useCallback, useEffect, useState} from "react";
import {getMultiCoins, getSingleCoin} from "../../api";
import {CurrencyInfo} from "../currency-info";

const DEFAULT_COIN = 'DOGECOIN';

export type CoinResponse = {USD: number};
export type CoinsResponse = {[key: string]: CoinResponse };

const getDynamics = (price?: number, prevPrice?: number) => {
    if(!price || !prevPrice) return;

    if(price > prevPrice) return 'up';
    if(price < prevPrice) return 'down';
}

export const Crypto = () => {

    const [currentPrice, setCurrentPrice] = useState<CoinsResponse>({[DEFAULT_COIN]: {USD: 0}});
    const [prevPrice, setPrevPrice] = useState<CoinsResponse>({});
    const [error, setError] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [coins, setCoins] = useState([DEFAULT_COIN]);

    const getData = useCallback( async () => {
        await getMultiCoins(coins).then((data: CoinsResponse) => {
            setPrevPrice(currentPrice);
            setCurrentPrice(data);
        })
    }, [currentPrice, coins]);

    const handleSearch = () => {
        if(!coins.includes(inputValue.toUpperCase()) && inputValue) {
            getSingleCoin(inputValue).then((data) => {
                if(data.Response) {
                    setError(`Coin ${inputValue.toUpperCase()} not found`);
                } else {
                    setInputValue('');
                    setError('');
                    setCoins([...coins, inputValue.toUpperCase() ])
                    setCurrentPrice(prevState => {
                        return {...prevState, [inputValue.toUpperCase()]: data}
                    }   )
                }
            });
        }
    };

    const handleDelete = (coin: string) => {
        const filteredCoins = coins.filter((item) => item !== coin);
        setCoins(filteredCoins);

        setCurrentPrice(prevState => {
            const copy = prevState;
            delete copy[coin];
            return copy;
        })
    }

    const handleInputChange = (value: string) => {
        setInputValue(value.toUpperCase());
        setError('');
    }

    useEffect(() => {
        getData();
        const interval = setInterval(() => {
            if(coins.length > 0) {
                getData();
            }
        }, 5000);

        return () =>  clearInterval(interval);
    }, [coins]);

    return (
        <div className="board">
            <h1>Crypto Compare</h1>
            <input type="text"
                   className="search"
                   placeholder={'Type coin name...'}
                   value={inputValue.toUpperCase()}
                   onChange={(e) => handleInputChange(e.target.value)}
            />
            <button type="button" onClick={() => handleSearch()}>Search</button>
            <div className={'error'}>{error && error}</div>
            <div className={'content'}>
                {coins.map((coin) => {

                    const price = currentPrice[coin] ? currentPrice[coin].USD : 0;
                    const prePrice = prevPrice[coin] ? prevPrice[coin].USD : undefined;

                    const dynamics = getDynamics(price, prePrice);
                    return <CurrencyInfo
                        key={coin}
                        name={coin}
                        price={currentPrice[coin]}
                        dynamics={dynamics}
                        onDelete={handleDelete} />;
                } )}
            </div>
        </div>
    );
}
