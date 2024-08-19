import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import AddWordCard from './components/addWordCard';
import ViewTestingCard from './components/viewTestingCard';
import Modal from './components/modalQuestioning';
import InitiateApp from './components/simpleOperations'

function App() {
  const [state, setState] = useState('none');
  const [data, setData] = useState(JSON.parse(localStorage.getItem("englishWords")||'[]'));
  const confirmed = useRef(JSON.parse(localStorage.getItem("newConfirmedEng")||'false'));
  const [status, setStatus] = useState({isActive : false, msg : null, change : null});
  const testStatus = JSON.parse(localStorage.getItem("testStatus"))||{correct: 0, total:0};
  const firstMount = useRef(true);
  const main = useRef(null);

  useEffect(() => {
    if (!firstMount.current) {
      setStatus({isActive : true, msg : 'Успешно добавленно слово', change : 'none'});
    } 
  }, [data]);

  useEffect(() => {
    if (!status.isActive && status.change) {
      setState(status.change);
      setStatus(old => ({...old, change : null}))
    }
  }, [status]);

  // do something when user interferes current state
  const checkState = (opt) => {
    if (state !== 'none' && state !== opt) {
      let msg = state === 'testing' ? 'Добавление нового слова, закроет тест!' : 'Старт теста, закроет добавление слова!'
      setStatus({isActive : true, msg : msg, change : opt});
      // let answer = prompt(msg);
      return false
    }
    if (state === 'none') {
      return true;
    }
    return false;
  }

  const addWord = () => {
    const currentDay = getFormattedDate();
    const index = data.length - 1;
    if (data[index].date === currentDay  && data[index].wordsDict.length === 20) {
      setStatus({isActive : true, msg : '20 слов предел, на сегодня достаточно!', change : state});
      // alert('20 слов предел, на сегодня достаточно!');
      return;
    }
    if (checkState('pressed')) {
      setState('pressed');
      console.log('beep')
    } 
    return;
  }

  const formatDate = useCallback((date) => {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
  }, []);

  const getFormattedDate = useCallback(() => {
    console.log('new data');
    const date = new Date();
    return formatDate(date);
  }, [formatDate]);

  const updateData = useCallback((wordTuple) => {
    console.log('updateData');
    const currentDay = getFormattedDate();
    const newData = [...data];
    const index = newData.length - 1;
    if (newData[index].date === currentDay) {
      newData[index].wordsDict.push(wordTuple);
    } else {
      newData.push({
        wordsDict : [wordTuple],
        date : currentDay
      })
    }
    localStorage.setItem('englishWords', JSON.stringify(newData));
    firstMount.current = false;
    setData(newData);
  }, [data, getFormattedDate])

  const startTest = () => {
    if (checkState('testing')) {
      setState('testing');
    }
    return;
  }

  const provideStatistics = () => {
    const currentDay = getFormattedDate();
    return (<>
      <h5>Statistics of data length : {data.length}</h5>
      <h5>Last elem : {JSON.stringify(data.length > 0 ? data[data.length - 1].wordsDict : 'data is empty')}</h5>
      <h5>Last access date : {JSON.stringify(data.length > 0 ? data[data.length - 1].date : 'date is empty')}</h5>
      <h5>Todays date : {JSON.stringify(currentDay)}</h5>
      <h5>Current State : {state}</h5>
    </>)
  }

  return (
    <div className="App">
      <InitiateApp confirmed={confirmed} data={data} setData={setData}></InitiateApp>
      {status.isActive && <Modal setStatus={setStatus} status={status} />}
      <div className="buttons">
        <button onClick={() => addWord()}> Добавить Слово </button>
        <button onClick={() => startTest()}> Начать подготовку </button>
      </div>
      <main ref = {main}>
        {state === 'none'? 
          <>
            {provideStatistics()}
            {/* <h1>Добро пожаловать</h1> 
            <div className='ending'>
              <p>Результаты последнего теста</p>
              <h3>{testStatus.correct} / {testStatus.total}</h3>
              <p>Количество правильных слов: {testStatus.correct}</p>
              <p>Количество всех слов {testStatus.total}</p>
            </div> */}
          </>
        : null}
        {state === 'pressed' ? <AddWordCard updateData={updateData} setStatus={setStatus}/> : null}
        {state === 'testing' ? <ViewTestingCard data={data} formatDate={formatDate} setState={setState} main={main}/> : null}
      </main>
    </div>
  );
}

export default App;
