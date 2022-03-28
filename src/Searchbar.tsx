import React, { useEffect, useState, useRef} from "react";
import { encode } from 'url-encode-decode';
import styles from './st';
import { assetURL, absolutePath, MathjaxConfig } from './constants/constants';
import { triggerAnalytics, getSearchHistory, get_suggestions, removeOptions } from './services/common-services';
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { getCookie, removeCookies, setCookies } from 'cookies-next';

import ImageSearchDesktopPopup from "./ImageSearchDesktopPopup";
// const Popup = dynamic(() => import("reactjs-popup"));
// const ImageSearchPopup = dynamic(() => import('./ImageSearchPopup'))
// const Image = dynamic(() => import("next/image"));


const Searchbar = ({}) => {

    var [open, setOpen] = useState(false);
    var [ pageLoaded, setPageLoaded] = useState(true); 
    var [searchKeyword, setSearchKeyword] = useState(null);
    var [suggestions, setSuggestions] = useState([]);
    var [history, setHistory] = useState([]);
    var [inputFocus, setInputFocus] = useState(false);
    var [openMobileCam, setopenMobileCam] = useState(false);
    var [openDesktopPopup, setOpenDesktopPopup] = useState(false);
    var [imageUploaded, setImageUploaded] = useState(false);
    
    const typeDelay = 500;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if(searchKeyword){
                get_suggestions(searchKeyword, getCookie('docId'), getCookie('userToken')).then(r=>r.json()).then(res=>{
                    var tempArray = [];

                    for(var i=0;i<res['suggestions'].length;i++){
                        tempArray.push(
                            {
                                'question_text' : res['suggestions'][i]['mathjax_question'],
                                'question_id' : res['suggestions'][i]['qid'],
                                'href' : res['suggestions'][i]['href']
                            }
                        )
                    }
                    try{
                        setCookies('docId', res['docId'], {maxAge: 60 * 60 * 24, sameSite: "none", secure: true});
                    }
                    catch(err){}
                    setSuggestions(tempArray);
                })
            }

        }, typeDelay);
        return () => clearTimeout(timeoutId);
    }, [searchKeyword]);

 
    function closeModal(){
        setOpen(false);
    }

    function closeDesktopModal(){
        setOpenDesktopPopup(false);
    }

    function openHistory(ques){
        setPageLoaded(false);
        window.setTimeout(()=>{setPageLoaded(true)},3000);
        clearSearch();
        removeCookies('pMatch');
        setCookies('searchedText', '', {maxAge: 60 * 60 * 24, sameSite: "none", secure: true})
        localStorage.removeItem('imageSearched');
        setCookies('isImageSearch', false, {maxAge : 60 * 60 * 24, sameSite: "none", secure: true})
        removeCookies('topMatchedSubject');
    }


    function openQuestion(ques, i){
        setPageLoaded(false);
        removeCookies('pMatch');
        window.setTimeout(()=>{setPageLoaded(true)},3000);
        triggerAnalytics('realtimeSuggestion', i, getCookie('docId'))
        setCookies('searchedText', document.getElementById('searchInput').value, {maxAge: 60 * 60 * 24, sameSite: "none", secure: true})
        localStorage.removeItem('imageSearched');
        setCookies('isImageSearch', false, {maxAge : 60 * 60 * 24, sameSite: "none", secure: true});
        removeCookies('topMatchedSubject');
        clearSearch();
    }

    function showHistory(limit){
        getSearchHistory(limit).then(r=>r.json()).then(res=>{
            setHistory(res['questions_asked']);
         })
    }

    function searchInput(value){
        setSearchKeyword(value);
        setSuggestions([]);
    }

    function clearSearch(){
        setInputFocus(false);
        setSuggestions([]);
        setSearchKeyword(null);
        setHistory([]);
        document.getElementById('searchInput').value = null;
    }
    
    function customSearch(text){
        clearSearch();
        if(text){
            setPageLoaded(false);
            window.setTimeout(()=>{setPageLoaded(true)},3000);
            removeCookies('pMatch');
            setCookies('isImageSearch', false, {maxAge : 60 * 60 * 24, sameSite: "none", secure: true})
            localStorage.removeItem('imageSearched');
            triggerAnalytics('directSearch', 0, getCookie('docId'));
            setCookies('searchedText', text, {maxAge: 60 * 60 * 24, sameSite: "none", secure: true})
            text = text.replaceAll('+', '-plus-')
            text = text.replaceAll('%', '-pcnt-');
            text = text.replace( /(<([^>]+)>)/ig, '');
            Router.push({pathname: '/search/' + encodeURI(encode(text))}, undefined, { shallow: false });
        }
      
    }

    function imageSearch() {
        setOpenDesktopPopup(o => !o);
    }

    function cameraClick(){
        setOpen(o => !o);
        setopenMobileCam(true);
    }

    function enterButtonPressed(event){
        if(event.key === 'Enter'){
            customSearch(searchKeyword);
          }
    }

    return (
        <>
        <div className={styles.searchBarHolder}>
            <div className={styles.searchBar}>
                <div className={styles.searchbuttonHolder}>
                    <div className={styles.buttonHolder + ' myImages'}>
                        {/* <Image className={styles.icon} onClick={() => customSearch(searchKeyword)} src={assetURL + "/Search.png"} width="44" height="44" alt="SearchIcon"></Image> */}
                        <Image  onClick={() => customSearch(searchKeyword)} src={"/question-answer/SearchIcon1.png"} width="24" height="24" alt="SearchIcon"></Image>
                    </div>
                </div>
                <div>
                    <input id="searchInput" name="searchInput" type="text" placeholder={`Search for questions & chapters`}  onFocus={() => {setInputFocus(true);showHistory(5);}} onKeyPress={(e) => {enterButtonPressed(e)}} onKeyUp={(e)=>searchInput(e.target.value)} autoComplete="off"></input>
                </div>
                <div className={styles.buttonContainer}>
                    <div className={styles.buttonHolder + ' myImages'}>
                        { (inputFocus || suggestions.length>0 || history.length>0) && <div className={styles.crossButtonHolder}>
                            <Image className={styles.icon} onClick={() => clearSearch()} src={assetURL + "/cancel.webp"} width="14" height="14" alt="CrossIcon"></Image>
                        </div>
                        }
                    </div>

                    <div className={ inputFocus == true ? (styles.buttonHolder + ' myImages show-in-desktop') : (styles.buttonHolder + ' myImages')}>
                        <div className="show-in-mobile">
                            <div className={styles.cameraButtonHolder1}>
                                <Image className={styles.icon} onClick={() => cameraClick()} src={"/question-answer/Camera.png"} width="24" height="24" alt="CameraIcon"></Image>
                            </div>
                        </div>
                        <div className="show-in-desktop">
                            <div className={styles.cameraButtonHolder2}>
                                <Image className={styles.icon} onClick={() => imageSearch()} src={"/question-answer/Camera.png"} width="36" height="36" alt="CameraIcon"></Image>
                            </div>
                        </div>
                    </div>
                </div>
                
                {suggestions.length>0 &&
                    <div className={styles.suggestionHolder}>
                        {suggestions.map((el,i) =>
                        <>
                        {el.href &&
                        <a key={'suggestion_' + i} href={el.href ? (absolutePath + '/question-answer/' + el.href + '/') : (absolutePath + '/question-answer/search/ques?id=' + el.question_id)} style={{textDecoration: 'none', color: 'unset'}}>
                            <div className={styles.suggestionBox} onClick={() => {openQuestion(el, i);}}>
                                <div>
                                <MathJaxContext config={MathjaxConfig}>
                                    <MathJax>
                                        <div dangerouslySetInnerHTML={{ __html: removeOptions(el.question_text) || ''}}></div>
                                    </MathJax>
                                </MathJaxContext>
                                </div>
                                <div>
                                    <Image src={assetURL + "/SearchRecommendation.png"} width="24" height="24" alt="search-recommendation"></Image>
                                </div>
                            </div>
                        </a>
                        }
                        </>
                        )}
                    </div>
                }
                {suggestions.length == 0 && history.length > 0 && !searchKeyword &&
                    <div className={styles.suggestionHolder}>
                        {history.map((el,i) =>
                          <a key={'history_' + i} href={el.href ? (absolutePath + '/question-answer/' + el.href + '/') : (absolutePath + '/question-answer/search/' + encodeURI(encode(el.searchText)))} style={{textDecoration: 'none', color: 'unset'}}>
                            <div className={styles.historyBox} onClick={() => {openHistory(el);}}>
                                <div className={styles.clockIcon}>
                                    <Image src={assetURL + "/SearchHistory.png"} width="20" height="20" alt="search-history"></Image>
                                </div>
                                <div>
                                    <MathJaxContext config={MathjaxConfig}>
                                        <MathJax>
                                            <div dangerouslySetInnerHTML={{ __html: removeOptions(el.searchText) || ''}}></div>
                                        </MathJax>
                                    </MathJaxContext>
                                </div>
                                <div>
                                    <Image src={assetURL + "/SearchRecommendation.png"} width="24" height="24" alt="search-recommendation"></Image>
                                </div>
                            </div>
                        </a>
                        )}
                    </div>
                }
            </div>
            {/* <div className={ inputFocus == true ? (styles.myQuestionHolder + " show-in-desktop") : (styles.myQuestionHolder)}> */}
            {/* <div className={styles.myQuestionHolder}>
                <div className="myImages">
                    <Image className={styles.icon} onClick={() => openMyQuestion()} src={assetURL + "/myquestions.png"} width="44" height="44" alt="MyQuestionIcon"></Image>
                </div>
            </div> */}
        </div>

        <Popup open={open} modal closeOnDocumentClick={false} onClose={closeModal} className="uploadPopup">
            <ImageSearchPopup openMobileCam = {openMobileCam} setOpen={el => setOpen(el)} setPageLoaded={el => setPageLoaded(el)}></ImageSearchPopup>
        </Popup>
        <Popup open={openDesktopPopup} modal closeOnDocumentClick={false} onClose={closeDesktopModal} className="askADoubt-popup">
            <div className={styles.askADoubtPopupTopbannerCrossIcon}>
                <Image onClick={()=>{setOpenDesktopPopup(false)}} className="pointer" src={"/question-answer/crossGreyIcon.png"} alt="loader" height="40" width="40"></Image>
            </div>
            <ImageSearchDesktopPopup setImageUploaded={el => setImageUploaded(el)} setPageLoaded={el => setPageLoaded(el)}></ImageSearchDesktopPopup>
        </Popup>

        </>
    );
}

export default Searchbar;