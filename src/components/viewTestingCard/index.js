import { useState, useEffect, memo, useRef, useMemo} from 'react';
import styles from "./testing.module.css";

const ViewTestingCard = memo(({data, formatDate}) => {
    const [time, setTime] = useState(3);
    const [isStarted, setIsStarted] = useState(false);
    const [status, setStatus] = useState({correct: 0, total:0});

    const findDates = () => {
        const currentDate = new Date();
        const minus3Days = new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000);
        const minus8Days = new Date(currentDate.getTime() - 8 * 24 * 60 * 60 * 1000);
        const minus20Days = new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000);
        return [formatDate(currentDate), formatDate(minus3Days), formatDate(minus8Days), formatDate(minus20Days)]
    }

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    const findWords = () => {
        
        const dates = findDates();
        const currentWords = [].concat.apply([], dates.filter(date => data[date] !== undefined).map(el => data[el]));
        console.log(currentWords);
        shuffleArray(currentWords);
        return currentWords;
    }

    const words= useMemo(() => findWords(), []);
    const answer = useRef(null);

    const nextQuestion = () => {
        const stats = {...status}
        if (answer.current.value === words[status.total].rusWord) {
            stats.correct++;
        } 
        stats.total++;
        answer.current.value = '';
        answer.current.focus();
        setStatus(stats);
    }

    const startTest = () => {
        if (status.total < words.length) {
            return (<div className={styles.question}>
                <h1>{words[status.total].engWord}</h1>
                <input autoFocus ref={answer} placeholder="Ваш ответ"/>
                <button onClick={() => nextQuestion()}>Дальше</button>
            </div>)
        } else {
            return (
                <div className={styles.ending}>
                    <h1>Конец</h1>
                    <h3>{status.correct} / {status.total}</h3>
                    <p>Количество правильных слов: {status.correct}</p>
                    <p>Количество всех слов {status.total}</p>
                </div>
            )
        }
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