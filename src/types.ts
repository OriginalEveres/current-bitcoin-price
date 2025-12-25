export type Ok<T> = {
  success: true;
  value: T;
};

export type Err<T> = {
  success: false;
  error: T;
};

export type Result<T, E> = Ok<T> | Err<E>;

export type Trend = 'up' | 'down' | 'stable';

export enum FIAT {
  USD = 'usd',
  EUR = 'eur',
}
