import { useState, useEffect, memo, useRef, useMemo} from 'react';
import styles from "./testing.module.css";

const ViewTestingCard = memo(({data, formatDate, setState, main}) => {
    console.log("testing")
    const [time, setTime] = useState(3);
    const [isStarted, setIsStarted] = useState(false);
    const [testStatus, setTestStatus] = useState({correct: 0, total:0});

    const findDates = () => {
        const currentDate = new Date();
        const minus3Days = new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000);
        const minus8Days = new Date(currentDate.getTime() - 8 * 24 * 60 * 60 * 1000);
        const minus20Days = new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000);
        return [formatDate(currentDate), formatDate(minus3Days), formatDate(minus8Days), formatDate(minus20Days)]
    }

    useEffect(() => {
        if (isStarted && testStatus.total >= words.length) {
            localStorage.setItem('testStatus', JSON.stringify(testStatus));
            setState('none');
        }
    }, [testStatus, isStarted]);

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
         return array;
    }

    const findWords = () => {
        const dates = findDates();
        const currentWords = [].concat.apply([], dates.filter(date => data[date] !== undefined).map(el => data[el]));
        return shuffleArray(currentWords);
    };

    const words= useMemo(() => findWords(), [data, formatDate]);
    console.log(words);
    const answer = useRef(null);

    const nextQuestion = () => {
        const stats = {...testStatus}
        if (testStatus.total < words.length && answer.current.value === words[testStatus.total].engWord) {
            stats.correct++;
        } 
        stats.total++;
        answer.current.value = '';
        answer.current.focus();
        setTestStatus(stats);
    }

    function getTextWidth(text) {
        if (!main.current) {
            return 32;
        }
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = getComputedStyle(document.body).font;
        const size = (main.current.offsetWidth * 0.8 / context.measureText(text).width) * 16;
        const limit = ((main.current.offsetWidth * 0.8) / (main.current.offsetWidth * 0.2) ) * 16;
        return Math.min(size, limit);
    }

    const checkWord = () => {
        if (testStatus.total >= words.length || !answer.current) {
            return;
        }
        if (answer.current.value === words[testStatus.total].engWord) {
            answer.current.style.color = 'green';
        } else {
            answer.current.style.color = 'red';
        }
    }

    const startTest = () => {
        if (testStatus.total < words.length) {
            const size = getTextWidth(words[testStatus.total].rusWord);
            return (<div className={styles.question}>
                <h1 className={styles.questionTitle} style={{fontSize:size+'px'}}>{words[testStatus.total].rusWord}</h1>
                <input autoFocus autoComplete="off" onChange = {() => checkWord()} ref={answer} placeholder="Ваш ответ"/>
                <p>Правильно {testStatus.correct} из {words.length}</p>
                <button onClick={() => nextQuestion()}>Дальше</button>
            </div>)
        } 
        return null;
    }

    useEffect(() => {
        const interval = setInterval(() => updateTime(), 1000);

        const updateTime = () => {
            if (time === 1) {
                clearInterval(interval);
                setIsStarted(true);
            } else {
                setTime(oldTime => (oldTime - 1));
            }
        }
    
        return () => clearInterval(interval);
      }, [time]);

    return (
        <>
            {!isStarted ? <h1 className={styles.bigNumbers}>{time}</h1>: null}
            {
                isStarted ? 
                startTest()
                : null
            }
        </>
            
    )
})

export default ViewTestingCard;