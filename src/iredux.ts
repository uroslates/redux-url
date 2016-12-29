export interface IAction {
  type: string;
};

export interface IListener {
  (state: any): void;
}

export interface IUnsubscription {
  (): void;
}

export interface IReducer {
    (state: any, action: IAction): any;
}
