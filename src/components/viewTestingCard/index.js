import { useState, useEffect, memo, useRef, useMemo} from 'react';
import styles from "./testing.module.css";

const ViewTestingCard = memo(({data, formatDate, setState, main}) => {
    console.log("testing")
    const [time, setTime] = useState(3);
    const [isStarted, setIsStarted] = useState(false);
    const [testStatus, setTestStatus] = useState({correct: 0, total:0});

    const findIndexes = (data) => {
        const index = data.length - 1;
        const index1 = index - 3;
        const index2 = index - 8;
        const index3 = index - 20;
        const arr = [index, index1, index2, index3];
        return arr.filter(el => el >= 0);
    }

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
        const indexes = findIndexes(data);
        const currentWords = [].concat.apply([], indexes.filter(index => data[index] !== undefined).map(el => data[el].wordsDict));
        console.log(currentWords);
        return shuffleArray(currentWords);
    };

    const words= useMemo(() => findWords(), [data, formatDate]);

    useEffect(() => {
        if (isStarted && testStatus.total >= words.length) {
            localStorage.setItem('testStatus', JSON.stringify(testStatus));
            setState('none');
        }
    }, [testStatus, isStarted, words.length]);

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