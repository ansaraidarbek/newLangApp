import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import AddWordCard from './components/addWordCard';
import ViewTestingCard from './components/viewTestingCard';
import Modal from './components/modalQuestioning';

function App() {
  const [state, setState] = useState('none');
  const [data, setData] = useState(JSON.parse(localStorage.getItem("englishWords")||'{}'));
  const [status, setStatus] = useState({isActive : false, msg : null, change : null});
  const firstMount = useRef(true);

  useEffect(() => {
    // Обновляем заголовок документа с помощью API браузера
    if (!firstMount.current) {
      setStatus({isActive : true, msg : 'Успешно добавленно слово', change : 'none'});
    }
  }, [data]);

  useEffect(() => {
    // Обновляем заголовок документа с помощью API браузера
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
    if (data[currentDay] && data[currentDay].length === 20) {
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

  const getFormattedDate = () => {
    const date = new Date();
    return formatDate(date);
  }

  const updateData = (wordTuple) => {
    const currentDay = getFormattedDate();
    const newData = {...data};
    if (newData[currentDay]) {
      newData[currentDay].push(wordTuple);
    } else {
      newData[currentDay] = [wordTuple];
    }
    localStorage.setItem('englishWords', JSON.stringify(newData));
    firstMount.current = false;
    setData(newData);
  }

  const startTest = () => {
    if (checkState('testing')) {
      setState('testing');
      console.log('sdfg')
    }
    return;
  }

  return (
    <div className="App">
      {status.isActive && <Modal setStatus={setStatus} status={status} />}
      <div className="buttons">
        <button onClick={() => addWord()}> Добавить Слово </button>
        <button onClick={() => startTest()}> Начать подготовку </button>
      </div>
      <main>
        {state === 'none'? <h1>Добро пожаловать</h1> : null}
        {state === 'pressed' ? <AddWordCard updateData={updateData} setStatus={setStatus}/> : null}
        {state === 'testing' ? <ViewTestingCard data={data} formatDate={formatDate}/> : null}
      </main>
    </div>
  );
}

export default App;
