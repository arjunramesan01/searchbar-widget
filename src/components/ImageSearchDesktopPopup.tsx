import React, { useEffect, useState} from "react";
import Cropper from "react-cropper";
import styles from '../styles/popup.module.css';
import { default as NextImage} from 'next/image';
import { assetURL } from '../services/constants';
import { search_lo_by_image, dataURItoBlob } from '../services/common-service';
import { encode } from 'url-encode-decode';

const ImageSearchDesktopPopup = (props: any) => {
    const [fileUploadError, setFileUploadError] = useState(false);
    var [imageUploaded, setImageUploaded] = useState(false);
    var [imageFinalized, setImageFinalized] = useState(false);
    var [imageData, setImageData] = useState('');
    var [croppedImageData, setCroppedImageData] = useState(null);
    var cropperRef = React.useRef(null);
    const webcamRef = React.useRef(null);

    function handleRetake() {
        setImageUploaded(false);
        setImageData('');
    }

    function finalizeImage(){
        var blob = dataURItoBlob(croppedImageData.getCroppedCanvas().toDataURL());
        setImageFinalized(true);
        var img = new Image();
        img.src = croppedImageData.getCroppedCanvas().toDataURL();
        setCookies('isImageSearch', true, {maxAge: 60 * 60 * 24, sameSite: "none", secure: true});
        blob = croppedImageData.getCroppedCanvas().toDataURL();
        localStorage.setItem('imageSearched', blob);
        search_lo_by_image(blob).then(r=>r.json()).then(res=>{
            props.setPageLoaded(false);
            window.setTimeout(()=>{props.setPageLoaded(true)},3000);
            if(res['text']){
                var text = res['text'];
                text = text.replaceAll('+', '-plus-');
                text = text.replaceAll('%', '-pcnt-');
                text = text.replace( /(<([^>]+)>)/ig, '');
                Router.push({pathname: '/search/' + encodeURI(encode(text))}, null, { shallow: false });
            }
            else{
                Router.push({pathname: '/search/ques', query: { id: -1 }}, null, { shallow: false });
            }
        }).catch(res => {
            props.setPageLoaded(false);
            window.setTimeout(()=>{props.setPageLoaded(true)},3000);
            Router.push({pathname: '/search/ques', query: { id: -1 }}, undefined, { shallow: false });
            return;
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

    function closeModal(){
        props.setOpenDesktopPopup(false);
        setImageUploaded(false);
        setImageFinalized(false);
        setImageData('');
        setFileUploadError(false);
    }

    useEffect(()=>{
        if(!fileUploadError){
            props.setImageUploaded(imageUploaded)
        }
    }, [imageUploaded])

    return (
        <>
            <>
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
                    <>
                        <div className={styles.fileBody}>
                            <input className={styles.fileSelector} id="uploadFile" type="file" accept="image/*" onChange={(e) => {dragNdrop(e)}}></input>
                            <div className={styles.circleHolder}>
                                <div className={styles.circle}>
                                    <NextImage src={assetURL + "/UploadIcon.png"} width="29" height="29" alt="UploadIcon"></NextImage>
                                </div>
                            </div>
                            <span>Browse for an image or try dragging an image here</span>
                        </div>

                        { fileUploadError &&
                            <div className={styles.uploadFileError}>Inavlid file type ( only image files are accepted )
                            </div>
                        }
                    </>
                    }   

                    { !fileUploadError && imageUploaded==true &&
                    <>
                        { imageFinalized==false &&
                        <>
                            <div className={styles.thumbnailContainer}>
                                <Cropper
                                    src={imageData}
                                    style={{ width: "100%", height: "100%" }}
                                    autoCropArea={0.9}
                                    guides={false}
                                    crop={onCrop}
                                    ref={cropperRef}
                                />
                            </div>
                            <div className={styles.bottomSectionDesktop}>
                                <div><NextImage src={"/question-answer/rotateleft.png"} alt="loader" height="40" width="40"></NextImage></div>
                                <div><NextImage src={"/question-answer/rotateright.png"} alt="loader" height="40" width="40"></NextImage></div>
                                <div></div>
                                <div><NextImage src={"/question-answer/retakeDesktop.png"} alt="loader" height="40" width="40"></NextImage></div>
                            </div>
                            <div className={styles.customButton} onClick={()=>{finalizeImage()}}>Continue</div>
                        </>
                        }
                        { imageFinalized == true &&
                            <>
                            <div className={styles.scannedThumbnailContainer}>
                                <div className={styles.scannerContainer}>
                                    <div className={styles.scannerRight}></div>
                                    <div className={styles.scannerLeft}></div>
                                </div>
                                <NextImage src={croppedImageData.getCroppedCanvas().toDataURL()} layout='fill' objectFit='contain' alt="croppedImage"></NextImage>
                            </div>
                            </>
                        }
                    </>
                    }
                </div>
            </>

        </>
    )
}

export default ImageSearchDesktopPopup