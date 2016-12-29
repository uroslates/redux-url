import { IAction, IListener, IReducer, IUnsubscription } from './iredux';
import { Redux, Store } from './redux';
import { expect } from 'chai';

describe('Redux', () => {
  let incReducer: IReducer = (state = 0, action: IAction) => {
        switch (action.type) {
          case 'INCREMENT':
            return state + 1;
          case 'DECREMENT':
            return state - 1;
          default:
            return state;
        }
      };

  it('should expose correct interface', () => {
    expect(Redux).not.to.be.undefined;
    expect(Redux.createStore).not.to.be.undefined;
  });

  describe('Redux.createStore(reducerFunction)', () => {

    it('should create new Store instance', () => {
      let store: Store = Redux.createStore();
      // assert interface
      expect(store.dispatch).not.to.be.undefined;
      expect(store.subscribe).not.to.be.undefined;
      expect(store.getState).not.to.be.undefined;
      expect((<any> store).state).to.be.undefined;
      // expect((<any> store).reducer).to.be.undefined;
    });

    it('should create store with default reducer (doing nothing)', () => {
      let store: Store = Redux.createStore();
      expect(store.getState()).to.deep.equal({});
    });

    it('should create store with default state set what reducer set as default', () => {
      let defaultState: any = { value: 1 };
      let reducer = (store: Store = defaultState, action: IAction) => store;
      let store = Redux.createStore(reducer);
      expect(store.getState()).to.equal(defaultState);
    });

  });

  describe('Store.dispatch() and Store.subscribe()', () => {
    let store: Store;
    let incrementAction = { type: 'INCREMENT' };
    let subscriber1;
    let subscriber2;
    let subscribers: IListener[];

    beforeEach(() => {
      subscriber1 = sinon.spy();
      subscriber2 = sinon.spy();
      subscribers = [subscriber1, subscriber2];
    });

    describe('with default reducer function', () => {

      beforeEach(() => {
        store = Redux.createStore();
      });

      it('should dispatch the action by notifying subscribers', () => {
        // test default store
        subscribers.forEach((subscriber) => store.subscribe(subscriber));
        store.dispatch(incrementAction);
        expect(subscriber1.called).to.be.true;
        expect(subscriber1.calledWith({})).to.be.true;
        expect(subscriber2.called).to.be.true;
        expect(subscriber2.calledWith({})).to.be.true;
      });

      it('should stop calling subscriber once unsubscribed', () => {
        let unsubscriptions: IUnsubscription[] = subscribers
          .map((subscriber) => store.subscribe(subscriber));
        store.dispatch(incrementAction);
        expect(subscriber1.called).to.be.true;
        expect(subscriber1.calledWith({})).to.be.true;
        expect(subscriber2.called).to.be.true;
        expect(subscriber2.calledWith({})).to.be.true;

        // Test unsubscriptions
        subscriber1.reset();
        unsubscriptions[0]();
        subscriber2.reset();
        unsubscriptions[1]();
        store.dispatch(incrementAction);
        expect(subscriber1.called).not.to.be.true;
        expect(subscriber2.called).not.to.be.true;
      });

    });

    describe('with custom reducer function', () => {

      beforeEach(() => {
        store = Redux.createStore(incReducer);
      });

      it('should dispatch the action by notifying subscribers', () => {
        // test non-default store
        subscribers.forEach((subscriber) => store.subscribe(subscriber));
        store.dispatch(incrementAction);
        expect(subscriber1.called).to.be.true;
        expect(subscriber1.calledWith(1)).to.be.true;
        expect(subscriber2.called).to.be.true;
        expect(subscriber2.calledWith(1)).to.be.true;
      });

      it('should stop calling subscriber once unsubscribed', () => {
        let unsubscriptions: IUnsubscription[] = subscribers
          .map((subscriber) => store.subscribe(subscriber));
        store.dispatch(incrementAction);
        expect(subscriber1.called).to.be.true;
        expect(subscriber1.calledWith(1)).to.be.true;
        expect(subscriber2.called).to.be.true;
        expect(subscriber2.calledWith(1)).to.be.true;

        // Test unsubscriptions
        subscriber1.reset();
        unsubscriptions[0]();
        subscriber2.reset();
        unsubscriptions[1]();
        store.dispatch(incrementAction);
        expect(subscriber1.called).not.to.be.true;
        expect(subscriber2.called).not.to.be.true;
      });

    });

  });

  describe('Store.getStore()', () => {
    let store: Store;

    beforeEach(() => {
      store = Redux.createStore(incReducer);
    });

    it('should return store\'s current state', () => {
      expect(store.getState()).to.equal(0);
    });

    /* tslint:disable */
    // it('should return immutable object that does not change store internally when edited', () => {
    // });
    /* tslint:enable */

  });

});
