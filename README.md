# byjus-searchbar-widget

> widget for byjus qna searchbar

[![NPM](https://img.shields.io/npm/v/byjus-searchbar-widget.svg)](https://www.npmjs.com/package/byjus-searchbar-widget) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save byjus-searchbar-widget --legacy-peer-deps
```

## Usage

```jsx
import React, { Component } from 'react'
import { useEffect, useState } from 'react';
import { SearchbarComponent } from 'byjus-searchbar-widget'
import 'byjus-searchbar-widget/dist/index.css'
import 'byjus-searchbar-widget/dist/cropper.css'

class Example extends Component {

  render() {

    var [routeUrl, setRouteUrl] = useState(null);

    useEffect(()=>{
      if(routeUrl){
        console.log(routeUrl)
      }
    }, [routeUrl])


    return <SearchbarComponent
        apiEndpoint = 'API_ENDPOINT' //String
        userToken = 'USER TOKEN' //String
        origin = 'ORIGIN' //String
        authKey = 'AUTH KEY' //String
        setRouteUrl = {el => setRouteUrl(el)} //Output url for redirection
    />
  }
}
```

## License

MIT © [arjunramesan01](https://github.com/arjunramesan01)
