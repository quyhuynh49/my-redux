/* ========== MY REDUX ========== */
function createStore(reducer) {
  // state từ reducer, nếu ko truyền params reducer() thì không đọc được properties of undefined (type)
  let state = reducer(undefined, {});
  const subscribers = [];
  return {
    getState() {
      return state;
    },
    dispatch(action) {
      state = reducer(state, action);
      // khi có 1 action vào store thì reducer sẽ lấy state cũ và payload từ action để update lại state
      // toán tử gán = thì nó sẽ chạy reducer(state, action) trước, tức là state trong reducer(state, action) là state cũ là state ngoài là state mới
      subscribers.forEach((subscriber) => subscriber());
    },
    subscribe(subscriber) {
      subscribers.push(subscriber);
    },
  };
}

/* ========== MY APP ========== */
// import { createStore } from "https://cdn.skypack.dev/redux";

const initState = 0;

// reducer
function reducer(state = initState, action) {
  switch (action.type) {
    case "DEPOSIT":
      return state + action.payload;
    case "WITHDRAW":
      return state - action.payload;
    default:
      // trong lần chạy ứng dụng sẽ lấy state return từ default là giá trị khởi tạo nên khởi tạo state ban đầu = 0 thì lần đầu sẽ hiển thị UI là 0
      return state;
  }
}

// store
const store = (window.store = createStore(reducer));
// window.store - giúp log store ở browser
// ta sẽ thấy có dispatch - giúp bắn đi 1 action
// getState - lấy state

// action
function actionDeposit(payload) {
  return {
    type: "DEPOSIT",
    payload,
  };
}

function actionWithdraw(payload) {
  return {
    type: "WITHDRAW",
    payload,
  };
}

// DOM events

const deposit = document.querySelector("#deposit");
const withdraw = document.querySelector("#withdraw");

// event handler
deposit.onclick = function () {
  store.dispatch(actionDeposit(10));
};

withdraw.onclick = function () {
  store.dispatch(actionWithdraw(10));
};

// listener
store.subscribe(() => {
  console.log("store vừa update xong.");
  render();
});

// store.subscribe chỉ là 1 callback và nếu ta subscribe nhiều thì khi store thay đổi, tất cả subscriber sẽ được thông báo/listen tới callback

// render
function render() {
  const output = document.querySelector("#output");
  output.innerHTML = store.getState();
}

render();
