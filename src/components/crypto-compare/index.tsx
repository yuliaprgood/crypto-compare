import React from "react";
import {getMultiCoins, getSingleCoin} from "../../api";
import {CurrencyInfo} from "../currency-info";
import {Simulate} from "react-dom/test-utils";

type CryptoCompareProps = {
};

export type CoinResponse = {USD: number};
export type CoinsResponse = {[key: string]: CoinResponse };

type CryptoCompareState = {
    inputValue: string;
    error: string;
    prevPrice: {[key: string]: CoinResponse }
    currentPrice: {[key: string]: CoinResponse }
    intervalId: any;

};

const DEFAULT_COIN = 'DOGECOIN';

export class CryptoCompare extends React.Component<CryptoCompareProps, CryptoCompareState> {
    private interval: any;
    constructor(props: CryptoCompareState) {
        super(props);
        this.state = {
            prevPrice: {},
            currentPrice: {[DEFAULT_COIN]: {USD: 0}},
            inputValue: '',
            error: '',
            intervalId: null,
        };
    }


    async getData() {
        const coins = Object.keys(this.state.currentPrice);
        try {
            getMultiCoins(coins).then((data: CoinsResponse) =>
                this.setState((prevState) => {
                    return {
                        currentPrice: data,
                        prevPrice: prevState.currentPrice,
                    }
                }));
        } catch (error) {
            console.log(error)
        }

    }

    handleSearch() {
        const coins = Object.keys(this.state.currentPrice);
        const value = this.state.inputValue;

        if(!coins.includes(value.toUpperCase()) && value) {
            getSingleCoin(this.state.inputValue).then((data) => {
                if(data.Response) {
                    this.setState({error: `Coin ${this.state.inputValue.toUpperCase()} not found`})
                } else {
                    console.log(data);
                    this.setState((state) => {
                        return {
                            error: '',
                            inputValue: '',
                            currentPrice: {...this.state.currentPrice, [state.inputValue.toUpperCase()]: data}
                        }
                    })
                }
            });
        }

    }

    getDynamics(price?: number, prevPrice?: number) {
        if(!price || !prevPrice) return;

        if(price > prevPrice) return 'up';
        if(price < prevPrice) return 'down';
    }

    handleDelete(coin: string) {
       this.setState(prevState => {

           const copy = prevState.currentPrice;
           delete copy[coin];
           console.log(copy);
           return {
               currentPrice: copy,
           }
       })
    }

    componentDidMount() {
        this.interval =
            setInterval(() => {
                if(Object.keys(this.state.currentPrice).length > 0) {
                    this.getData();
                    console.log('interval');
                }
            }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {

        return (
            <div className="board">
                <h1>Crypto Compare</h1>
                <input type="text"
                       className="search"
                       placeholder={'Type coin name...'}
                       value={this.state.inputValue.toUpperCase()}
                       onChange={(e) =>
                           this.setState({inputValue: e.target.value.toUpperCase(),
                               error: ''
                })} />
                <button type="button" onClick={() => this.handleSearch()}>Search</button>
                <div className={'error'}>{this.state.error && this.state.error}</div>
                <div className={'content'}>
                {Object.keys(this.state.currentPrice).map((coin) => {

                    const price = this.state.currentPrice[coin] ? this.state.currentPrice[coin].USD : 0;
                    const prevPrice = this.state.prevPrice[coin] ? this.state.prevPrice[coin].USD : undefined;

                    const dynamics = this.getDynamics(price, prevPrice);
                    return <CurrencyInfo
                        key={coin}
                        name={coin}
                        price={this.state.currentPrice[coin]}
                        dynamics={dynamics}
                        onDelete={this.handleDelete.bind(this)} />;
                } )}
                </div>
            </div>
        );
    }
}

