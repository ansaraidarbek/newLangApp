import './style.css';
import { useRef } from 'react';

const AddWordCard = ({updateData}) => {
    const eng = useRef(null);
    const rus = useRef(null);

    const notEmpty = () => {
        return (!!eng.current.value && !!rus.current.value);
    }

    const addWord = () => {
        if(notEmpty()) {
            // data is array of objects of form 
            /*  engWord : str
                rusWord : str
                date : some date
             */
            const wordTuple = {engWord : eng.current.value, rusWord : rus.current.value};
            updateData(wordTuple);
        }
        return;
    }
    
    return (<div className='mainWordAdd'>
        <label className='mainWordAddLabel' htmlFor="eng">Вставьте английское слово</label>
        <input ref={eng} className='mainWordAddInput' type="text" id="eng" name="eng" />
        <label className='mainWordAddLabel' htmlFor="rus">Сюда русское пожалуйста </label>
        <input ref={rus} className='mainWordAddInput' type="text" id="rus" name="rus" />
        <button className='mainWordAddButton' onClick={() => addWord()} >Добавить</button>
    </div>)

}

export default AddWordCard;