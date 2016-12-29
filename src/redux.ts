import { IAction, IListener, IReducer, IUnsubscription } from './iredux';

let emptyReducer: IReducer = (state: any = {}, action: IAction): any => {
    return state;
  };

export class Store {
  private store: any;
  private listeners: Function[] = [];

  constructor(private reducer: IReducer = emptyReducer) {
    // set initial store to what might be specified in reducer defaults
    this.store = this.reducer(this.store, { type: undefined });
  }

  public dispatch(action: IAction): void {
    this.store = this.reducer(this.store, action);
    // TODO: immutable
    this.listeners.forEach((listenerFn) => listenerFn(this.store));
  }

  /**
   * Subscribe method allowing store actions dispatching to be observed.
   * Provides a means of reacting to store changes, whenever each one of them happens.
   * @param {IListener} listenerFunction function to be executed whenever store changes
   * @returns {IUnsubscription} unsubscripion function reference used for unsubscribing 
   *    from store changes observation
   * @memberOf Store
   */
  public subscribe(listenerFunction: IListener): IUnsubscription {
    this.listeners.push(listenerFunction);
    // Return unsubscripion function removing listener from registered listeners when invoked
    return () => this.listeners = this.listeners.filter(listener => listener !== listenerFunction);
  }

  public getState(): any {
    return this.store;
  }
};

class ReduxClass {
  public createStore(reducerFunction?: IReducer) {
    return new Store(reducerFunction);
  }
};

export const Redux = new ReduxClass();
