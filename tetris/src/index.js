import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore, applyMiddleware } from "redux"; //Add
import { Provider } from "react-redux"; //Add
import { composeWithDevTools } from 'redux-devtools-extension'; //리덕스 크롬 개발자도구 사용하기 위한 라이브러리
import reducers from './reducers'; //Add
import thunk from "redux-thunk";

const root = ReactDOM.createRoot(document.getElementById("root"));

//스토어(createStore)를 만들고 리덕스 크롬 개발자도구(composeWithDevTools) 사용
const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();