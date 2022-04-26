import React, { useEffect, useState} from "react";
import Cropper from "react-cropper";
import styles from './styles.module.css'
import { encode } from 'url-encode-decode';

const ImageSearchDesktopPopup = (props) => {
    const [fileUploadError, setFileUploadError] = useState(false);
    var [imageUploaded, setImageUploaded] = useState(false);
    var [imageFinalized, setImageFinalized] = useState(false);
    var [imageData, setImageData] = useState('');
    var [croppedImageData, setCroppedImageData] = useState(null);
    var cropperRef = React.useRef(null);

    function handleRetake() {
        setImageUploaded(false);
        setImageData('');
    }

    function search_lo_by_image(blob){
        return fetch(props.API_ENDPOINT + 'get_mathpix_v2/', {
            method: 'POST',
            headers: {
                'Authorization' : props.AUTH_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'base64String' : blob})
        })
    }


    function finalizeImage(){
        var blob = dataURItoBlob(croppedImageData.getCroppedCanvas().toDataURL());
        var img = new Image();
        setImageFinalized(true);
        img.src = croppedImageData.getCroppedCanvas().toDataURL();
        blob = croppedImageData.getCroppedCanvas().toDataURL("image/jpeg",0.7);
        search_lo_by_image(blob).then(r=>r.json()).then(res=>{
            props.setOpenDesktopPopup(false)
            if(res['text']){
                var text = res['text'];
                text = text.replaceAll('+', '-plus-');
                text = text.replaceAll('%', '-pcnt-');
                text = text.replace( /(<([^>]+)>)/ig, '');
                props.setRouteUrl('/search/' + encodeURI(encode(text)) + "?searchedTextUrl=" + encodeURI(text))
            }
            else{
                props.setRouteUrl('/search/ques?id=-1')
            }
        }).catch(res => {
            props.setOpenDesktopPopup(false)
            props.setRouteUrl('/search/ques?id=-1')
        });
    }

    function onCrop(){
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        setCroppedImageData(cropper);
      };


    function dragNdrop(event) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            if (event.target.files[0].type.split('/')[0] === 'image') 
            {                  
                setFileUploadError(false);
                const [file] = event.target.files;
                reader.readAsDataURL(file);
                reader.onload = () => {
                    setImageData(reader.result);
                    setImageUploaded(true);
                };
            }
            else {
                setFileUploadError(true);
            }
        }
    }

    function dataURItoBlob(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
    
        return new Blob([ia], {type:mimeString});
    }
    
    const handleRotate = () => {
        var img = new Image();
        img.src = imageData;
        img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.height;
            canvas.height = img.width;
            var ctx = canvas.getContext("2d");
            ctx.translate( Math.floor(img.height/2),Math.floor(img.width/2));
            ctx.rotate(90 * (Math.PI / 180));
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            setImageData(canvas.toDataURL("image/jpeg"))
        }
    };


    const handleRotateLeft = () => {
        var img = new Image();
        img.src = imageData;
        img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.height;
            canvas.height = img.width;
            var ctx = canvas.getContext("2d");
            ctx.translate( Math.floor(img.height/2),Math.floor(img.width/2));
            ctx.rotate(-90 * (Math.PI / 180));
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            setImageData(canvas.toDataURL("image/jpeg"))
        }
    };

    function closeModal(){
        props.setOpenDesktopPopup(false);
        setImageUploaded(false);
        setImageFinalized(false);
        setImageData('');
        setFileUploadError(false);
    }

    return (
        <div>
        <div className={styles.askADoubtPopupTopbanner}>
            <div>
                
            </div>
            <div>
                { imageUploaded==false && <div className={styles.askADoubtPopupTopbannerTitle}>Upload an image</div> } 
                { !fileUploadError && imageUploaded==true && imageFinalized==false && <div className={styles.askADoubtPopupTopbannerTitle}>Crop only one question<br></br>in the frame</div> }
                { !fileUploadError && imageUploaded==true && imageFinalized==true && <div className={styles.askADoubtPopupTopbannerTitle}> Scanning for matches in our question bank</div> }
            </div>
            <div>
                
            </div>
        </div>
        <div className={styles.cameraImageCropper}>
            { imageUploaded==false &&
            <div>
                <div className={styles.fileBody}>
                    <input className={styles.fileSelector} id="uploadFile" type="file" accept="image/*" onChange={(e) => {dragNdrop(e)}}></input>
                    <div className={styles.circleHolder}>
                        <div className={styles.circle}>
                            <img src={"https://search-static-stg.byjusweb.com/assets/UploadIcon.png"} width="29" height="29" alt="UploadIcon"></img>
                        </div>
                    </div>
                    <span>Browse for an image or try dragging an image here</span>
                </div>

                { fileUploadError &&
                    <div className={styles.uploadFileError}>Inavlid file type ( only image files are accepted )
                    </div>
                }
            </div>
            }   

            { !fileUploadError && imageUploaded==true &&
            <div>
        
                <div style={imageFinalized==false ? {display:'block'} : { display: 'none'}}>
                    <Cropper
                        src={imageData}
                        style={{  maxHeight: "20rem", height: "20rem", width:"auto"}}
                        autoCropArea={0.9}
                        guides={false}
                        crop={onCrop}
                        ref={cropperRef}
                        dragMode={'none'}
                    />
                    <div className={styles.bottomSectionDesktop}>
                        <div className={styles.pointer} onClick={handleRotateLeft}><img src={"https://search-static-stg.byjusweb.com/assets/rotateleft.png"} alt="loader" height="40" width="40"></img></div>
                        <div className={styles.pointer} onClick={handleRotate}><img src={"https://search-static-stg.byjusweb.com/assets/rotateright.png"} alt="loader" height="40" width="40"></img></div>
                        <div></div>
                        <div></div>
                        {/* <div className={styles.pointer} onClick={handleRetake}><img src={"https://search-static-stg.byjusweb.com/assets/retakedesktop.png"} alt="loader" height="40" width="40"></img></div> */}
                    </div>
                    <div className={styles.customButton} onClick={()=>{finalizeImage()}}>Continue</div>
                </div>
                { imageFinalized == true &&
                <div className={styles.scannedThumbnailContainer}>
                    <div className={styles.scannerContainer}>
                        <div className={styles.scannerRight}></div>
                        <div className={styles.scannerLeft}></div>
                    </div>
                    <img src={croppedImageData.getCroppedCanvas().toDataURL()} width="100%" height="100%" alt="croppedImage"></img>
                </div>
                }
            </div>
            }
        </div>
        </div>
    )
}

export default ImageSearchDesktopPopup