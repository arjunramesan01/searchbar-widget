import React, { useEffect, useState } from 'react'
import { SearchbarComponent } from 'byjus-searchbar-widget'
import 'byjus-searchbar-widget/dist/index.css'
import 'byjus-searchbar-widget/dist/cropper.css'

const App = () => {
  var [routeUrl, setRouteUrl] = useState(null);

  useEffect(()=>{
    if(routeUrl){
      console.log(routeUrl)
    }
  }, [routeUrl])

  return(
    <div className="bodyContainer">
      <div className="searchBarDiv">
        <SearchbarComponent
        apiEndpoint = 'https://search-api-stg.byjusweb.com/byjus/web_search/'
        userToken = '2676038'
        origin = 'learnportal2'
        authKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2MDVhMzc5MTg2M2YzYTViZTE0YjE0NzgiLCJyb2xlIjoiYnlqdS1hbnN3ZXItcmV2aWV3ZXIiLCJ0aW1lc3RhbXAiOiIyMDIxLTA1LTEwVDEwOjM0OjM4LjUyNloiLCJpYXQiOjE2MjA2NDI4Nzh9.f5xoVcgtvWAOwOnbc-VCMDjRwt7P4Pax5ftUL2TRUJQ'
        setRouteUrl = {el => setRouteUrl(el)}
        />
      </div>
    </div>
  )
}

export default App
