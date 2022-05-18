import React, { Fragment, useEffect, useState } from 'react'
import Cropper from 'react-cropper'
import Webcam from 'react-webcam'
import styles from './styles.module.css'
import { encode } from 'url-encode-decode'
import BackIcon from './BackIcon'
import CrossIcon from './CrossIcon'
import CameraIcon from './CameraIcon'
import FlashIcon from './FlashIcon'
import HelpIcon from './HelpIcon'
import KeyboardIcon from './KeyboardIcon'
import GalleryIcon from './GalleryIcon'
import RetakeIcon from './RetakeIcon'
import RotateIcon from './RotateIcon'
import CameraMarkerIcon from './CameraMarkerIcon'
import CameraAlternateIcon from './/CameraAlternateIcon'
import ToggleIcon from './ToggleIcon'

const ImageSearchPopup = (props) => {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment'
  }
  const { camHeight, camWidth } = props

  const [fileUploadError, setFileUploadError] = useState(false)
  const [openMobileCam, setopenMobileCam] = useState(props.openMobileCam)
  const [mediaPermissionsGranted, setMediaPermissionsGranted] = useState(false)
  const [firstUser, setFirstUser] = useState(false)
  const [isCameraImageUploaded, setIsCameraImageUploaded] = useState(false)
  var [imageUploaded, setImageUploaded] = useState(false)
  var [imageFinalized, setImageFinalized] = useState(false)
  var [imageData, setImageData] = useState('')
  var [croppedImageData, setCroppedImageData] = useState(null)
  var cropperRef = React.useRef(null)
  const webcamRef = React.useRef(null)
  const [showFlash, setShowFlash] = useState(false)

  useEffect(() => {
    // if(getCookie('cameraFirstUser') == 'yes'){
    //     setFirstUser(false);
    // }

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => {
          if (device.kind == 'videoinput') {
            if (device.deviceId) {
              setMediaPermissionsGranted(true)
            } else {
              setMediaPermissionsGranted(false)
            }
          }
        })
      })
    }
  }, [])

  const requestMediaPersmissions = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setMediaPermissionsGranted(true)
        setFirstUser(false)
      })
      .catch((err) => {
        setMediaPermissionsGranted(false)
        setFirstUser(false)
      })
  }

  const stopWebCam = () => {
    props.setOpen(false)
    setopenMobileCam(false)
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      stream.getTracks().forEach((track) => {
        track.stop()
      })
    })
  }

  const handleTypeQuestion = () => {
    setopenMobileCam(false)
    document.getElementById('searchInput').focus()
    props.setOpen(false)
    props.setFocusSearchbar(true)
  }

  function handleRetake() {
    setImageUploaded(false)
    setImageData('')
    setopenMobileCam(true)
    // setIsCameraImageUploaded(false);
  }

  function videoError(MediaStreamError) {
    if (MediaStreamError) {
      setMediaPermissionsGranted(false)
    }
  }

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return
    setImageUploaded(true)
    setImageData(imageSrc)
    setopenMobileCam(false)
    setIsCameraImageUploaded(true)
  }, [webcamRef])

  function dataURItoBlob(dataURI) {
    var byteString
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1])
    else byteString = unescape(dataURI.split(',')[1])
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ia = new Uint8Array(byteString.length)
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ia], { type: mimeString })
  }

  function search_lo_by_image(blob) {
    return fetch(props.API_ENDPOINT + 'get_mathpix_v2/', {
      method: 'POST',
      headers: {
        Authorization: props.AUTH_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ base64String: blob })
    })
  }

  function finalizeImage() {
    setIsCameraImageUploaded(false)
    var blob = dataURItoBlob(croppedImageData.getCroppedCanvas().toDataURL())
    var img = new Image()
    setImageFinalized(true)
    img.src = croppedImageData.getCroppedCanvas().toDataURL()
    blob = croppedImageData.getCroppedCanvas().toDataURL('image/jpeg', 0.5)
    search_lo_by_image(blob)
      .then((r) => r.json())
      .then((res) => {
        props.setOpen(false)
        if (res['text']) {
          var text = res['text']
          text = text.replaceAll('+', '-plus-')
          text = text.replaceAll('%', '-pcnt-')
          text = text.replace(/(<([^>]+)>)/gi, '')
          props.setRouteUrl(
            '/search/' +
              encodeURI(encode(text)) +
              '?searchedTextUrl=' +
              encodeURI(text)
          )
        } else {
          props.setRouteUrl('/search/ques?id=-1')
        }
      })
      .catch((res) => {
        props.setOpen(false)
        props.setRouteUrl('/search/ques?id=-1')
      })
  }

  function onCrop() {
    const imageElement = cropperRef?.current
    const cropper = imageElement?.cropper
    setCroppedImageData(cropper)
  }

  function dragNdrop(event) {
    const reader = new FileReader()
    setopenMobileCam(false)
    if (event.target.files && event.target.files.length) {
      if (event.target.files[0].type.split('/')[0] === 'image') {
        setFileUploadError(false)
        const [file] = event.target.files
        reader.readAsDataURL(file)
        reader.onload = () => {
          setImageData(reader.result)
          setImageUploaded(true)
        }
      } else {
        setFileUploadError(true)
      }
    }
  }

  const handleRotate = () => {
    var img = new Image()
    img.src = imageData
    img.onload = () => {
      var canvas = document.createElement('canvas')
      canvas.width = img.height
      canvas.height = img.width
      var ctx = canvas.getContext('2d')
      ctx.translate(Math.floor(img.height / 2), Math.floor(img.width / 2))
      ctx.rotate(90 * (Math.PI / 180))
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      setImageData(canvas.toDataURL('image/jpeg'))
    }
  }

  function closeModal() {
    props.setOpen(false)
    setImageUploaded(false)
    setImageFinalized(false)
    setImageData('')
    setFileUploadError(false)
  }

  const toggleFlash = () => {
    handleFlash(showFlash)
    setShowFlash(!showFlash)
  }

  function handleFlash(showFlash) {
    const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator
    if (SUPPORTS_MEDIA_DEVICES) {
      //Get the environment camera (usually the second one)
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const cameras = devices.filter((device) => device.kind === 'videoinput')
        if (cameras.length === 0) {
          throw 'No camera found on this device.'
        }
        const camera = cameras[cameras.length - 1]
        // Create stream and get video track
        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: camera.deviceId,
              facingMode: ['user', 'environment'],
              height: { ideal: 1080 },
              width: { ideal: 1920 }
            }
          })
          .then((stream) => {
            const track = stream.getVideoTracks()[0]
            //Create image capture object and get camera capabilities
            const imageCapture = new ImageCapture(track)
            const photoCapabilities = imageCapture
              .getPhotoCapabilities()
              .then(() => {
                track.applyConstraints({
                  advanced: [{ torch: showFlash }]
                })
              })
          })
      })
    }
  }

  const renderCameraHeaderIcons = () => {
    return (
      <Fragment>
        <div className={styles.cameraBackIcon} onClick={stopWebCam}>
          <CrossIcon height={15} width={15} fill={'#fff'} />
        </div>
        <div className={styles.cameraIcons}>
          <div>{/* <HelpIcon height={24} width={24} /> */}</div>
          <div>
            <FlashIcon
              onClick={toggleFlash}
              height={24}
              width={18}
              fill={'white'}
            />
          </div>
        </div>
      </Fragment>
    )
  }

  const renderCameraPermissionRequiredMessage = () => {
    return (
      <div className={styles.cameraError}>
        <CameraIcon height={48} width={48} />
        <label className={styles.errorTitle}>Camera access required</label>
        <label className={styles.errorText}>
          It allows you to upload an image of your doubt and interact with
          experts on video call
        </label>
        <button
          className={styles.allowCamera}
          onClick={requestMediaPersmissions}
        >
          Allow camera access
        </button>
      </div>
    )
  }

  const renderCameraErrorMessage = () => {
    return (
      <div className={styles.cameraError}>
        <CameraIcon height={48} width={48} />
        <label className={styles.errorTitle}>
          Camera access is required to proceed
        </label>
        <label className={styles.errorText}>
          Allow Instant Doubt Solver to access your camera in your settings, as
          this will allow you to discuss your doubt with the expert.
        </label>
        <div className={styles.borderCotainer}>
          <div className={styles.cameraStatusContainer}>
            <div className={styles.flex}>
              <CameraAlternateIcon />
              <label className={styles.subtext}>Camera</label>
            </div>
            <ToggleIcon onClick={requestMediaPersmissions} />
          </div>
        </div>
      </div>
    )
  }

  const renderWebcamSection = () => {
    return (
      <div className='webcamWrapper'>
        {mediaPermissionsGranted && (
          <div className='webcamContainer'>
            <Webcam
              height={camHeight >= camWidth ? camHeight : null}
              width={camWidth > camHeight ? camWidth : null}
              className={styles.webcamClass}
              audio={false}
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              videoConstraints={videoConstraints}
              onUserMediaError={videoError}
            />
            <div className={styles.centerMarker}>
              <CameraMarkerIcon />
            </div>
            <div className={styles.bottomSection}>
              <div className={styles.cameraMessage}>
                Take a photo of the question
              </div>
              <div className={styles.bottomControls}>
                <div className={styles.galleryButton}>
                  <GalleryIcon />
                  <label className={styles.cameraLabel}>Gallery</label>
                  <input
                    className={styles.fileSelector}
                    id='uploadFile'
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      dragNdrop(e)
                    }}
                  ></input>
                </div>
                <div
                  className={styles.clickPicture}
                  onClick={() => {
                    mediaPermissionsGranted && capture()
                  }}
                >
                  <div className={styles.innerCircle}></div>
                </div>
                <div className={styles.typeButton} onClick={handleTypeQuestion}>
                  <KeyboardIcon />
                  <label className={styles.cameraLabel}>Type</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {!mediaPermissionsGranted && renderCameraErrorMessage()}
      </div>
    )
  }

  const renderCameraBottomControlsSection = () => {
    return (
      <div className={styles.bottomSection}>
        <label className={styles.cameraMessage}>
          Fit only
          <span className={styles.purple}>one question</span>in a box
        </label>
        <div className={styles.bottomControls}>
          <div className={styles.galleryButton}>
            <CameraIcon height={25} width={25} />
            <label className={styles.cameraLabel}>Retake</label>
            <input
              className={styles.fileSelector}
              id='uploadFile'
              type='file'
              accept='image/*'
              onChange={(e) => {
                dragNdrop(e)
              }}
            ></input>
          </div>
          <div
            className={styles.captureButton + ' ' + styles.clickPicture}
            onClick={finalizeImage}
          >
            <div className={styles.innerCircleCapture}>
              <svg
                fill='none'
                preserveAspectRatio='xMidYMid meet'
                height='32'
                width='20'
                viewBox='0 0 23 18'
              >
                <path
                  d='M17 1L6 12L1 7'
                  stroke='white'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                ></path>
              </svg>
            </div>
          </div>
          <div className={styles.typeButton} onClick={handleRotate}>
            <RetakeIcon height={25} width={25} />
            <label className={styles.cameraLabel}>Rotate</label>
          </div>
        </div>
      </div>
    )
  }

  const renderFindingSolutionAnimationSection = () => {
    return (
      <div>
        <div className={styles.popupTitle}>Finding solution...</div>
        <br></br>
        <div className={styles.scannedThumbnailContainer}>
          <div className={styles.scannerContainer}>
            <div className={styles.scannerRight}></div>
            <div className={styles.scannerLeft}></div>
          </div>
          <img
            src={croppedImageData.getCroppedCanvas().toDataURL()}
            width='100%'
            height='100%'
            alt='croppedImage'
          ></img>
        </div>
      </div>
    )
  }

  const renderPostPhotoClickedSection = () => {
    return (
      <div className='photoClickSection'>
        <div
          className={styles.cameraBackIcon}
          onClick={() => {
            props.setOpen(false)
          }}
        >
          <CrossIcon height={15} width={15} fill={'white'} />
        </div>
        {/* <div className={styles.cameraImageCropperContainer}> */}
        <Cropper
          src={imageData}
          className='cropper'
          style={{ height: '100%', width: 'auto', backgroundColor: '#000' }}
          autoCropArea={0.9}
          initialAspectRatio={25 / 9}
          guides={false}
          crop={onCrop}
          ref={cropperRef}
          dragMode={'none'}
        />
        {/* </div> */}
        <div className={styles.bottomSection}>
          <div className={styles.cameraMessage}>
            Fit<span className={styles.purple}>one question</span>in the box
          </div>
          <div className={styles.bottomControls}>
            <div className={styles.galleryButton} onClick={handleRetake}>
              <CameraIcon height={20} width={20} />
              <label className={styles.cameraLabel}>Retake</label>
              {/* <input className={styles.fileSelector} id="uploadFile" type="file" accept="image/*"></input> */}
            </div>
            <div
              className={styles.captureButton + ' ' + styles.clickPicture}
              onClick={finalizeImage}
            >
              <div
                className={styles.innerCircleCapture}
                onClick={finalizeImage}
              >
                <svg
                  fill='none'
                  preserveAspectRatio='xMidYMid meet'
                  height='32'
                  width='20'
                  viewBox='0 0 23 18'
                >
                  <path
                    d='M17 1L6 12L1 7'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  ></path>
                </svg>
              </div>
            </div>
            <div className={styles.typeButton} onClick={handleRotate}>
              <RotateIcon />
              <label className={styles.cameraLabel}>Rotate</label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className='imageSearchPopupWrapper'
      style={{ height: '100%', display: 'flex', width: '100%' }}
    >
      {openMobileCam && (
        <div className={styles.webcammodal}>
          {renderCameraHeaderIcons()}
          {firstUser && renderCameraPermissionRequiredMessage()}
          {!firstUser && renderWebcamSection()}
          {!mediaPermissionsGranted && !firstUser && (
            <div className={styles.bottomSection}>
              <div
                className={styles.settingsBtn}
                onClick={requestMediaPersmissions}
                dangerouslySetInnerHTML={{
                  __html: 'Settings > Permissions > Camera > Grant permission'
                }}
              />
            </div>
          )}
        </div>
      )}

      {isCameraImageUploaded &&
      !fileUploadError &&
      imageUploaded &&
      !imageFinalized
        ? renderPostPhotoClickedSection()
        : !openMobileCam && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
              className={`galleryPhotoSelectSection`}
            >
              {imageFinalized == false && !isCameraImageUploaded && (
                <div className={styles.closeIcon} onClick={closeModal}>
                  <CrossIcon height={15} width={15} fill={'#fff'} />
                </div>
              )}
              <div
                className={`galleryPhotoSelect ${styles.cameraImageCropper}`}
                style={{ display: 'flex' }}
              >
                {!fileUploadError && imageUploaded == true && (
                  <div style={{ alignSelf: 'center' }}>
                    {!isCameraImageUploaded && (
                      <div
                        style={
                          imageFinalized == false
                            ? { display: 'block' }
                            : { display: 'none' }
                        }
                      >
                        <Cropper
                          src={imageData}
                          style={{ height: '100%', width: 'auto' }}
                          autoCropArea={0.9}
                          initialAspectRatio={25 / 9}
                          guides={false}
                          crop={onCrop}
                          ref={cropperRef}
                          dragMode={'none'}
                        />
                      </div>
                    )}
                    {imageFinalized == true &&
                      renderFindingSolutionAnimationSection()}
                  </div>
                )}
              </div>
              {!imageFinalized && renderCameraBottomControlsSection()}
            </div>
          )}
    </div>
  )
}

export default ImageSearchPopup
