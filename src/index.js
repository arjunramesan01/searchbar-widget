import React, { useEffect, useState} from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { encode } from 'url-encode-decode';
import styles from './styles.module.css'
import Popup from "reactjs-popup";
import ImageSearchPopup from "./ImageSearchPopup";
import 'reactjs-popup/dist/index.css';
import ImageSearchDesktopPopup from "./ImageSearchDesktopPopup";

export const SearchbarComponent = (props) => {
    var [open, setOpen] = useState(false);
    var [searchKeyword, setSearchKeyword] = useState(null);
    var [suggestions, setSuggestions] = useState([]);
    var [history, setHistory] = useState([]);
    var [inputFocus, setInputFocus] = useState(false);
    var [openMobileCam, setopenMobileCam] = useState(false);
    var [openDesktopPopup, setOpenDesktopPopup] = useState(false);
    var [imgUploaded, setimgUploaded] = useState(false);
    var [focusSearchbar, setFocusSearchbar] = useState(false);
    var [ routeUrl, setRouteUrl] = useState(null);
    var [isTablet, setIsTablet] = useState(false);
    var [isLandscape, setIsLandscape] = useState(false);
    const overlayStyle = {'background': 'rgba(0,0,0,0.5)',  'zIndex': 999999999};

    const typeDelay = 500;
    const MathjaxConfig = {tex2jax: { inlineMath: [ ["\\$", "\\$"], ["\\(", "\\)"] ], displayMath: [ ["$$","$$"], ["\\[", "\\]"] ], processEscapes: true, ignoreClass: "tex2jax_ignore|dno" },"HTML-CSS": {styles: { ".MathJax .mo, .MathJax .mi": {color: "black ! important"}, '.MathJax .merror': {'display': 'none'}}, linebreaks: { automatic:true }}, SVG: { linebreaks: { automatic: true } }}
    const contentStyle_mobilePopup = { 
        borderRadius: '0px',
        position: 'relative',
        background: 'black',
        border: 'none',
        padding:'0',
        width: '100%',
        height: '100%'
    };

    const contentStyle_dektopPopup = { 
        borderRadius: '12px',
        position: 'relative',
        boxShadow: '0 15px 15px 0 rgb(0 0 0 / 12%), 0 5px 15px 0 rgb(0 0 0 / 20%)',
        background: '#F6F6F6',
        border: 'none',
        padding: '30px',
        width: '440px',
    };

    const origin = props.origin;
    const API_ENDPOINT = props.apiEndpoint;
    const userToken = props.userToken;
    const AUTH_KEY = 'Bearer ' + props.authKey;

    useEffect(()=>{
    if(open==false && document.fullscreenElement!=null){
        try{
            document.exitFullscreen();
        }
        catch(er){}
    }
    }, [open])

    useEffect(()=>{
        if(routeUrl){
            props.setRouteUrl(routeUrl)
        }
    }, [routeUrl])

    useEffect(()=>{
        setIsTablet(detectMob());
        checkOrientation()
        window.addEventListener("orientationchange", checkOrientation, false);

        window.addEventListener("focus", handleBrowserState.bind(true));
        window.addEventListener("blur", handleBrowserState.bind(false));   

        console.log('v1-widget')
    },[])

    function handleBrowserState(type){
        if(type.type == 'blur'){
            setOpen(false);
        }
    }


    useEffect(() => {
    const timeoutId = setTimeout(() => {
        if(searchKeyword){
            get_suggestions(searchKeyword, userToken).then(r=>r.json()).then(res=>{
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
      
    function checkOrientation(){
        if(window.orientation == 90 || window.orientation == -90){
          setIsLandscape(true);
        }
        else{
          setIsLandscape(false);
        }
      }

    function get_suggestions(text, userId) {
        const formData = new FormData();
        formData.append("text", text);
        formData.append("origin", origin)
        return fetch(API_ENDPOINT + 'get_suggestions/', {
            method: 'POST',
            headers: {
                'Authorization' : AUTH_KEY,
                'X-Tnl-User-Id' : userId
            },
            body: formData,
        })

    }

    function searchInput(value){
        setSearchKeyword(value);
        setSuggestions([]);
    }

    function customSearch(text){
        if(text){
            text = text.replaceAll('+', '-plus-')
            text = text.replaceAll('%', '-pcnt-');
            text = text.replace( /(<([^>]+)>)/ig, '');
            var searchedItem = document.getElementById('searchInput').value
            setRouteUrl('/search/' + encodeURI(encode(text)) + "?searchedTextUrl=" + encodeURI(searchedItem))
        }
        clearSearch();
    }

    function detectMob() {
        const toMatch = [
          /Android/i,
          /webOS/i,
          /iPhone/i,
          /iPad/i,
          /iPod/i,
          /BlackBerry/i,
          /Windows Phone/i
        ]
        return toMatch.some((toMatchItem) => {
          return navigator?.userAgent?.match(toMatchItem)
        })
      }

    function enterButtonPressed(event){
        if(event.key === 'Enter'){
            customSearch(searchKeyword);
          }
    }

    function imageSearch() {
        setOpenDesktopPopup(o => !o);
        clearSearch()
    }

    function cameraClick(){
        setOpen(o => !o);
        setopenMobileCam(true);
        openFullscreen();
        clearSearch()
    }

    function clearSearch(){
        setInputFocus(false);
        setSuggestions([]);
        setSearchKeyword(null);
        setHistory([]);
        document.getElementById('searchInput').value = null;
    }

    function openHistory(ques){
        if(ques.href){
            setRouteUrl('/' + ques['href'] + '/')
        }
        else{
            setRouteUrl('/search/' + encodeURI(encode(ques['searchText'])) + '/')
        }
        clearSearch()
    }

    function removeOptions(input) {
        if (input) {
          try {
            var output = input.replace(/\s*<ul[^>]*>[\S\s]*?<\/ul>\s*/, "");
            output = output.replace(/\s*<ol[^>]*>[\S\s]*?<\/ol>\s*/, "");
            output = replaceS3(output);
          } catch (err) {
            return output;
          }
          return output;
        }
      
        return input;
      }
      
    function replaceS3(input) {
        if (input) {
          try {
            var output = "";
            if (isLive) {
              output = input.replace(
                /https:\/\/meritnation-question-images.s3.ap-southeast-1.amazonaws.com/g,
                "https://search-static.byjusweb.com/question-images"
              );
            } else {
              output = input.replace(
                /https:\/\/meritnation-question-images.s3.ap-southeast-1.amazonaws.com/g,
                "https://search-static-stg.byjusweb.com/question-images"
              );
            }
            output = output.replace(/<div>&#xA0;<\/div>/g, "");
            output = output.replace(/<p>&#xA0;<\/p>/g, "");
            output = output.replace(/<span>&#xA0;<\/span>/g, "");
            output = output.replace(/<div>&#xA0;<\/div>/g, "");
            output = output.replace(/<br\/><br\/>/g, "<br/>");
            output = output.replace(/<br><br><br>/g, "<br>");
            output = output.replace(/<br><br>/g, "<br>");
            output = output.replace(/&nbsp;/g, " ");
            output = output.replace(/&#xA0;/g, " ");
            output = output.replace(/<em>/g, "");
            var re = new RegExp(String.fromCharCode(160), "g");
            output = output.replace(re, " ");
          } catch (err) {
            return input;
          }
      
          try {
            var characters = output.split("");
            var urls = [];
      
            for (var i = 0; i < characters.length; i++) {
              if (
                characters[i] == "s" &&
                characters[i + 1] == "r" &&
                characters[i + 2] == "c" &&
                characters[i + 3] == "="
              ) {
                var j = i + 5;
                var found = false;
                var url = "";
                while (!found) {
                  if (characters[j] == '"') {
                    found = true;
                    break;
                  }
                  url += characters[j];
                  j++;
                }
                urls.push(url);
              }
            }
            for (var i = 0; i < urls.length; i++) {
              var toReplace = urls[i].split("https://")[1];
              var goodString = toReplace.replace("//", "/");
              output = output.replace(toReplace, goodString);
            }
          } catch (err) {
            return output;
          }
      
          return output;
        }
      
        return input;
      }

    function openQuestion(ques, i){
        var searchedItem = document.getElementById('searchInput').value
        setRouteUrl('/' + ques['href'] + '/?searchedTextUrl=' + encodeURI(searchedItem))
        clearSearch()
    }

    function closeModal(){
        setOpen(false);
    }

    function closeDesktopModal(){
        setOpenDesktopPopup(false);
    }



    function showHistory(limit){
        // getSearchHistory(limit).then(r=>r.json()).then(res=>{
        //     setHistory(res['questions_asked']);
        //  })
    }

    function getSearchHistory(limit){
          return fetch(API_ENDPOINT + 'questions_by_user/' + userToken + '/' + limit + '/', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          })
    }

    function openFullscreen() {
        var elem = document.body;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
          elem.msRequestFullscreen();
        }
      }


    return(
        <div>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>


        { isTablet  && isLandscape && <div className={styles.landscapeBlocker}>
            Please switch to portrait mode for a better experience
        </div>
        }
        {!(isTablet  && isLandscape) && <div className={styles.byjus_search_widget_searchBarHolder}>
            <div className={styles.byjus_search_widget_searchBar}>
                <div className={styles.byjus_search_widget_searchbuttonHolder}>
                    <div className={styles.byjus_search_widget_buttonHolder}>
                        <img  onClick={() => customSearch(searchKeyword)} src={"https://search-static-stg.byjusweb.com/assets/SearchIcon1.png"} width="24" height="24" alt="SearchIcon"></img>
                    </div>
                </div>
                <div>
                    <input id="searchInput" name="searchInput" type="text" placeholder={`Search`}  onFocus={() => {setInputFocus(true);showHistory(5);}} onKeyPress={(e) => {enterButtonPressed(e)}} onKeyUp={(e)=>searchInput(e.target.value)} autoComplete="off"></input>
                </div>
                <div className={styles.byjus_search_widget_buttonContainer}>
                    <div className={styles.byjus_search_widget_buttonHolder} style={{transform: 'translateY(-2px)'}}>
                        { (inputFocus || suggestions.length>0 || history.length>0) && <div className={styles.byjus_search_widget_crossButtonHolder}>
                            <img className={styles.byjus_search_widget_icon} onClick={() => clearSearch()} src={"https://search-static-stg.byjusweb.com/assets/cancel.webp"} width="12" height="12" alt="CrossIcon"></img>
                        </div>
                        }
                    </div>

                    <div className={ inputFocus == true ? (styles.byjus_search_widget_buttonHolder + ' ' + styles.showindesktop) : (styles.byjus_search_widget_buttonHolder)}>
                        <div className={styles.byjus_search_widget_showinmobile}>
                            <div className={styles.byjus_search_widget_cameraButtonHolder1}>
                                <img className={styles.byjus_search_widget_icon} onClick={() => cameraClick()} src={"https://search-static-stg.byjusweb.com/assets/Camera.png"} width="24" height="24" alt="CameraIcon"></img>
                            </div>
                        </div>
                        <div className={styles.byjus_search_widget_showindesktop}>
                            <div className={styles.byjus_search_widget_cameraButtonHolder2}>
                                <img className={styles.byjus_search_widget_icon} onClick={() => imageSearch()} src={"https://search-static-stg.byjusweb.com/assets/Camera.png"} width="24" height="24" alt="CameraIcon"></img>
                            </div>
                        </div>
                    </div>
                </div>
                
                {suggestions.length>0 &&
                    <div className={styles.byjus_search_widget_suggestionHolder}>
                        {suggestions.map((el,i) =>
                        <div key={'suggestion_' + i}>
                        {el.href &&
                        <div className={styles.byjus_search_widget_suggestionBox} onClick={() => {openQuestion(el, i);}}>
                            <div>
                            <MathJaxContext config={MathjaxConfig}>
                                <MathJax>
                                    <div className={styles.hideImage} dangerouslySetInnerHTML={{ __html: removeOptions(el.question_text) || ''}}></div>
                                </MathJax>
                            </MathJaxContext>
                            </div>
                            <div>
                                <img src={"https://search-static-stg.byjusweb.com/assets/SearchRecommendation.png"} width="24" height="24" alt="search-recommendation"></img>
                            </div>
                        </div>
                        }
                        </div>
                        )}
                    </div>
                }
                {suggestions.length == 0 && history.length > 0 && !searchKeyword &&
                    <div className={styles.byjus_search_widget_suggestionHolder}>
                        {history.map((el,i) =>
                        <div key={'history_' + i} className={styles.byjus_search_widget_historyBox} onClick={() => {openHistory(el);}}>
                            <div className={styles.byjus_search_widget_clockIcon}>
                                <img src={"https://search-static-stg.byjusweb.com/assets/SearchHistory.png"} width="20" height="20" alt="search-history"></img>
                            </div>
                            <div>
                                <MathJaxContext config={MathjaxConfig}>
                                    <MathJax>
                                        <div className={styles.hideImage} dangerouslySetInnerHTML={{ __html: removeOptions(el.searchText) || ''}}></div>
                                    </MathJax>
                                </MathJaxContext>
                            </div>
                            <div>
                                <img src={"https://search-static-stg.byjusweb.com/assets/SearchRecommendation.png"} width="24" height="24" alt="search-recommendation"></img>
                            </div>
                        </div>
                        )}
                    </div>
                }
            </div>

            <Popup id="popup_camera" overlayStyle = {overlayStyle} lockScroll={true} open={open} modal contentStyle = {contentStyle_mobilePopup} closeOnDocumentClick={false} onClose={closeModal} className="uploadPopup">
                <ImageSearchPopup AUTH_KEY={AUTH_KEY} API_ENDPOINT={API_ENDPOINT} openMobileCam = {openMobileCam} setFocusSearchbar = {el => setFocusSearchbar(el)} setOpen={el => setOpen(el)} setRouteUrl = {el => setRouteUrl(el)}></ImageSearchPopup>
            </Popup>
            <Popup  overlayStyle = {overlayStyle} id="popup_camera_desktop" lockScroll={true} open={openDesktopPopup} contentStyle = {contentStyle_dektopPopup} modal closeOnDocumentClick={false} onClose={closeDesktopModal} className="askADoubt-popup">
                <div className={styles.askADoubtPopupTopbannerCrossIcon}>
                    <img onClick={()=>{setOpenDesktopPopup(false)}} className={styles.pointer} src={"https://search-static-stg.byjusweb.com/assets/crossGreyIcon.png"} alt="loader" height="40" width="40"></img>
                </div>
                <ImageSearchDesktopPopup  AUTH_KEY={AUTH_KEY} API_ENDPOINT={API_ENDPOINT} setOpenDesktopPopup={el => setOpenDesktopPopup(el)}  setRouteUrl = {el => setRouteUrl(el)}></ImageSearchDesktopPopup>
            </Popup>
        </div>
        }
        </div>
  )
}
