import React, { useEffect, useState} from "react";
import Cropper from "react-cropper";
import Webcam from "react-webcam";
import styles from '../styles/popup.module.css';
import cx from 'classnames';
import { default as NextImage} from 'next/image';
import { assetURL } from '../services/constants';
import { googleAnalytics, search_lo_by_image, dataURItoBlob } from '../services/common-service';
import Router from 'next/router';
import { encode } from 'url-encode-decode';
import dynamic from "next/dynamic";
const BackIcon = dynamic(() => import("../public/BackIcon"));
const CrossIcon = dynamic(() => import("../public/CrossIcon"));
const CameraIcon = dynamic(() => import("../public/CameraIcon"));
const FlashIcon = dynamic(() => import("../public/FlashIcon"));
const HelpIcon = dynamic(() => import("../public/HelpIcon"));
const KeyboardIcon = dynamic(() => import("../public/KeyboardIcon"))
const GalleryIcon =  dynamic(() => import("../public/GalleryIcon"))
const RetakeIcon = dynamic(() => import("../public/RetakeIcon"))
const RotateIcon = dynamic(() => import("../public/RotateIcon"));
const CameraMarkerIcon = dynamic(() => import("../public/CameraMarkerIcon"));
const CameraAlternateIcon = dynamic(() => import("../public//CameraAlternateIcon"));
const ToggleIcon = dynamic(() => import("../public/ToggleIcon"));

import "cropperjs/dist/cropper.css";
import { setCookies, getCookie } from 'cookies-next';

const ImageSearchPopup = (props) => {

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "environment"
      };

    const [fileUploadError, setFileUploadError] = useState(false);
    const [openMobileCam, setopenMobileCam] = useState(props.openMobileCam);
    const [mediaPermissionsGranted, setMediaPermissionsGranted] = useState(getCookie('mediaPermissionGranted'));
    const [isCameraImageUploaded, setIsCameraImageUploaded] = useState(false);
    const [cameraError, setCameraError] = useState(false);
    var [imageUploaded, setImageUploaded] = useState(false);
    var [imageFinalized, setImageFinalized] = useState(false);
    var [imageData, setImageData] = useState('');
    var [croppedImageData, setCroppedImageData] = useState(null);
    var cropperRef = React.useRef(null);
    const webcamRef = React.useRef(null);

    const requestMediaPersmissions = () => {
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
        setMediaPermissionsGranted(!mediaPermissionsGranted);
        setCookies('mediaPermissionGranted', true);
        }).catch((err) => {
            setMediaPermissionsGranted(false)
        });
    }

    const stopWebCam = () => {
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream => {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
            setopenMobileCam(false); 
            props.setOpen(false);
        })
    }

    const handleTypeQuestion = () => {
        setopenMobileCam(false);
        props.setOpen(false);
        document.getElementById('searchInput').focus();
    };

    function handleRetake() {
        setImageUploaded(false);
        setImageData('');
        setopenMobileCam(true);
        // setIsCameraImageUploaded(false);
    }

    function videoError(MediaStreamError){
        if(MediaStreamError){
            setCameraError(true);
        }
    }

    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) return
            setImageUploaded(true);
            setImageData(imageSrc);
            setopenMobileCam(false);
            setIsCameraImageUploaded(true);
        },
        [webcamRef]
    );

    function finalizeImage(){
        setIsCameraImageUploaded(false);
        googleAnalytics('Image_upload', 'click');
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
            props.setOpen(false);
        }).catch(res => {
            props.setOpen(false)
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
        setopenMobileCam(false);
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
        props.setOpen(false);
        setImageUploaded(false);
        setImageFinalized(false);
        setImageData('');
        setFileUploadError(false);
    }

    return (
        <>
            { openMobileCam &&
            <>
             <div className={styles.webcammodal}>
                <div className={styles.cameraBackIcon} onClick={stopWebCam}>
                    <CrossIcon height={15} width={15} fill={"white"}/>
                </div>
                <div className={styles.cameraIcons}>
                    <div>
                        <HelpIcon height={24} width={24} />
                    </div>
                    <div>
                        <FlashIcon height={24} width={18} fill={"white"} />
                    </div>
                </div>
                {
                    !mediaPermissionsGranted && <div>
                        
                    </div> 
                }
                {
                    (cameraError || !mediaPermissionsGranted) &&
                        <div className={styles.cameraError}>
                            <CameraIcon height={48} width={48} />
                            <label className={styles.errorTitle}>{mediaPermissionsGranted ? 'Camera access is required to proceed': 'Camera access required'}</label>
                            <label className={styles.errorText}>{
                            mediaPermissionsGranted ? 'Allow Insta Learn to access your camera in your settings, as this will allow you to discuss your doubt with the expert.': 'It allows you to upload an image of your doubt and interact with experts on video call'}</label>
                            {mediaPermissionsGranted ? <div className={styles.borderCotainer}>
                                <div className={styles.cameraStatusContainer}>
                                    <div className={styles.flex}>
                                        <CameraAlternateIcon />
                                        <label className={styles.subtext}>Camera</label>
                                    </div>
                                <ToggleIcon/>
                            </div>
                        </div>: <button className={styles.allowCamera} onClick={requestMediaPersmissions}>Allow camera access</button>}
                    </div>
                            
                }
                {(mediaPermissionsGranted && ! cameraError) && <>
                    <Webcam className={styles.webcamClass}
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        onUserMediaError={videoError}
                    />
                    <div className={styles.centerMarker}>
                        <CameraMarkerIcon />
                    </div>
                </>}
                {cameraError ? <div className={styles.bottomSection}>
                    <button className={styles.settingsBtn}>Open Settings</button>
                </div> : <>
                <div className={styles.bottomSection}>
                    <div className={styles.cameraMessage}>Take a photo of the question</div>
                    <div className={styles.bottomControls}>
                        <div className={styles.galleryButton}>
                            <GalleryIcon/>
                            <label className={styles.cameraLabel}>Gallery</label>
                            <input className={styles.fileSelector} id="uploadFile" type="file" accept="image/*" onChange={(e) => {dragNdrop(e)}}></input>
                        </div>
                        <div className={styles.captureButton + " " +  styles.clickPicture} onClick={() => {mediaPermissionsGranted && capture()}}>
                            <div className={styles.innerCircle}>
                            </div>
                        </div>
                        <div className={styles.typeButton} onClick={handleTypeQuestion}>
                            <KeyboardIcon/>
                            <label className={styles.cameraLabel}>Type</label>
                        </div>
                    </div>
                </div>
                </>}
                

            </div>
            </>
            }
            {isCameraImageUploaded && !fileUploadError && imageUploaded && !imageFinalized &&
                <>
                    <div className={styles.cameraBackIcon} onClick={() => {props.setOpen(false);}}>
                        <BackIcon stroke={"grey"}/>
                    </div>
                    <div className={styles.cameraImageCropperContainer}>
                        <Cropper
                            src={imageData}
                            style={{ width: "100%", height: "100%" }}
                            autoCropArea={0.9}
                            initialAspectRatio={25 / 9}
                            guides={false}
                            crop={onCrop}
                            ref={cropperRef}
                        />
                    </div>
                    <div className={styles.bottomSection}>
                    <div className={styles.cameraMessage}>Fit only<span className={styles.purple}>&nbsp;one question&nbsp;</span>in the box</div>
                    <div className={styles.bottomControls}>
                        <div className={styles.galleryButton} onClick={handleRetake}>
                            <CameraIcon height={20} width={20}/>
                            <label className={styles.cameraLabel}>Retake</label>
                            {/* <input className={styles.fileSelector} id="uploadFile" type="file" accept="image/*"></input> */}
                        </div>
                        <div className={styles.captureButton + " " +  styles.clickPicture} onClick={finalizeImage}>
                            <div className={styles.innerCircle}>
                            </div>
                        </div>
                        <div className={styles.typeButton} onClick={handleRotate}>
                            <RotateIcon/>
                            <label className={styles.cameraLabel}>Rotate</label>
                        </div>
                    </div>
                </div>
                </>
            }

            { !openMobileCam &&
            <>
                <div className={styles.fileUploadDiv}>
                <div className={styles.cameraImageCropper}>
                    { imageFinalized == false && !isCameraImageUploaded && 
                        <div className={styles.closeIcon} onClick={closeModal}>
                            <NextImage src={assetURL + "/cross1.png"} width="29" height="29" alt="close"></NextImage>
                                
                            </div> 
                    }
                        
                    { imageUploaded==false &&
                    <>
                        <div className={styles.fileBody}>
                            <input className={styles.fileSelector} id="uploadFile" type="file" accept="image/*" onChange={(e) => {dragNdrop(e)}}></input>
                            <div className={styles.circleHolder}>
                                <div className={styles.circle}>
                                    <NextImage src={assetURL + "/UploadIcon.png"} width="29" height="29" alt="UploadIcon"></NextImage>
                                </div>
                            </div>
                            <div className={styles.black}>Upload Image of question</div>
                            <span className="show-in-mobile">Browse/click an image</span>
                            <span className="show-in-desktop">Browse for an image or try dragging an image here.</span>
                        </div>
                        { fileUploadError &&
                            <div className={styles.uploadFileError}>Inavlid file type ( only image files are accepted )
                            </div>
                        }
                        <div className={styles.uploadHolder}>
                            <button disabled className={styles.customButtondisabled}>Upload</button>
                        </div>
                    </>
                    }   
                    { !fileUploadError && imageUploaded==true &&
                    <>
                        { imageFinalized==false && !isCameraImageUploaded &&
                                <>
                                    <div className={styles.thumbnailContainer}>
                                        <Cropper
                                            src={imageData}
                                            style={{ width: "100%", height: "100%" }}
                                            autoCropArea={0.9}
                                            // initialAspectRatio={25 / 9}
                                            guides={false}
                                            crop={onCrop}
                                            ref={cropperRef}
                                        />
                                    </div>
                                    <div className={styles.bottomSection}>
                                        <label className={styles.cameraMessage}>Fit only &nbsp;<span className={styles.purple}>one question</span>&nbsp;in a box</label>
                                        <div className={styles.bottomControls}>
                                            <div className={styles.galleryButton}>
                                                <CameraIcon height={25} width={25} />
                                                <label className={styles.cameraLabel}>Retake</label>
                                                <input className={styles.fileSelector} id="uploadFile" type="file" accept="image/*" onChange={(e) => {dragNdrop(e)}}></input>
                                            </div>
                                            <div className={styles.captureButton + " " +  styles.clickPicture} onClick={finalizeImage}>
                                                <div className={styles.innerCircle}>
                                                </div>
                                            </div>
                                            <div className={styles.typeButton} onClick={handleRotate}>
                                            <RetakeIcon height={25} width={25} />
                                                <label className={styles.cameraLabel}>Rotate</label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }
                        { imageFinalized == true &&
                            <>
                            <div className={styles.popupTitle}>Finding solution...</div>
                            <br></br>
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
                </div>
            </>
            }
        </>
    )
}

export default ImageSearchPopup