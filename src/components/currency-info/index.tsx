import React from "react";
import clsx from "clsx";
import {CoinResponse} from "../crypto-compare";

type CurrencyInfoProps = {
    name: string;
    price?: CoinResponse;
    dynamics?: string;
    onDelete: (coin: string) => void;
}

export function CurrencyInfo({name, price, dynamics, onDelete}: CurrencyInfoProps) {

    return (
        <div className={clsx('row', dynamics === 'down' && 'down', dynamics === 'up' && 'up')}>
            <div>
                {`${name}     $${price ? price.USD : 'loading'}`}
            </div>
            <button type="button" onClick={() => onDelete(name)}>Delete</button>
        </div>
    );
}
