var Homeworks = {};
(function() {
  let httpPort = 11203
  let httpsPort = 11204
  let login = { user: 'ig1', password: 'Fun2Code' }

  let msgTrace = false
  let name
  let lags = [],
    lCnt = 0

  let gc = {
    student: null,
    name: null,
    id: null,
    hw: null,
    res: null,
    connect: false,
    online: false,
    server: "hfg.hopto.org",
    isReview: false,
    noMenu: false
  }
  let statusNode, sendNode, recvNode
  let reconnect = false
  let checkId = null
  let waitCnt = 0
  let quitCnt = 0

  this.ws = null
  this.gc = gc
  this.aufgabe = 0
  this.version = 'v1.0.3'

  this.updateState = function() {
    if (gc.isReview) {
      Homeworks.showReview()
    } else {
      Homeworks.showStatus()
    }
  }

  /*
   * dozent only part for homeworks review
   */
  this.createReviewNode = function() {
    gc.isReview = true
    statusNode = document.getElementById('status')
    if (null == statusNode) {
      statusNode = createElement(document.body, 'div', { id: "status", style: "position: absolute; top:10px;right:30px;" })
    }
    let url = new URL(window.location)
    gc.student = url.searchParams.get("id")
    gc.hw = url.searchParams.get("hw")
    gc.view = url.searchParams.get("view")
    Homeworks.wsinit()
    window.addEventListener('keydown', onKeyDown)
  }

  this.showReview = function() {
    if (gc.res) {
      if (null != statusNode) {
        if (sendNode) {
          sendNode.removeEventListener('click', review)
        }
        let script = document.getElementById('homework')
        if (null != script) {
          let file = new URL(script.src).pathname.replace(/.*\//, "")
        }
        statusNode.innerHTML = gc.name + (gc.online ?
          (modal + ' <span style="font-size: 2em;"> <span id="review" style="cursor: pointer"><img src="img/g.png" style="border:2px solid ' +
          (gc.res.icon == "g.png" ? "cyan" : "gray") + ';"> <img src="img/y.png" style="border:2px solid ' +
          (gc.res.icon == "y.png" ? "cyan" : "gray") + ';"> <img src="img/r.png" style="border:2px solid ' +
          (gc.res.icon == "r.png" ? "cyan" : "gray") + ';"></span> <a href="' + script.src + '" target="_script">🔬</a></span>') :
          ' <span id="review" style="cursor: pointer;font-size: 2em;">🔴</span>')
        sendNode = document.getElementById('review')
        if (sendNode) {
          sendNode.addEventListener('click', review)
        }
      }
    } else {
      if (gc.student) {
        sendState('REVIEW', {
          student: gc.student,
          hw: gc.hw
        })
      } else {
        sendState('STATE', { add: true })
      }
    }
  }

  function review(evt) {
    if (gc.online) {
      document.getElementById('modal').style.display = 'block'
      document.getElementById('done').addEventListener('click', reviewSend)
      document.getElementById('info').value = gc.res.fb
      document.getElementById('icon').src = evt.target.src
      gc.res.icon = evt.target.src.match(/.\.png/)[0]
      window.removeEventListener('keydown', onKeyDown)
    } else {
      Homeworks.wsinit()
    }
  }

  function reviewSend(evt) {
    document.getElementById('modal').style.display = 'none'
    if (document.getElementById('info').value != '') {
      sendState('REVIEW', {
        student: gc.student,
        hw: gc.hw,
        res: { icon: gc.res.icon, fb: document.getElementById('info').value }
      })
    }
    window.addEventListener('keydown', onKeyDown)
  }

  let modal = `
<div id="modal" class="modal">
  <div class="modalbox">
    <p style="color: #fffba7;">Feedback <img id="icon" src="img/g.png" style="border:2px solid cyan"></p>
    <textarea id="info" rows="3" cols="80">
    </textarea>
    <br><button id="done">Senden</button>
  </div>
</div>`

  /*
   * student only part for homeworks upload
   */
  this.getStudentId = function() {
    return new Promise((resolve, reject) => {
      getFile('data/student.id', 'text/html').then(
        data => {
          gc.student = data.replace(/[\r\n].*/, "")
          resolve(true)
        },
        error => {
          Homeworks.showStatus()
          reject('⚠️ Die Datei "data/student.id" wurde nicht gefunden: ' + error.statusText + ' ' + error.status +
            '.\nDamit die Hausaufgaben per Knopfdruck abgegeben werden können, einfach das ⚠️ anklicken, das gleich oben rechts auftauchen wird. ' +
            'Damit wirst Du auf eine Seite weitergeleitet, auf der Du Deine "student.id" Datei herrunterladen kannst.\nAnmelden mit User "' +
            login.user + '" und Passwort "' + login.password + '".')
        }
      )
    })
  }

  this.createStatusNode = function() {
    statusNode = document.getElementById('status')
    if (null == statusNode) {
      statusNode = createElement(document.body, 'div', { id: "status", style: "position: absolute; top:10px;right:30px;" })
    }
    Homeworks.showStatus()
    if (location.pathname.match(/\/homeworks\/student/)) {
      window.addEventListener('keydown', onKeyDown)
    }
  }

  this.showStatus = function() {
    if (null != statusNode) {
      if (sendNode) {
        sendNode.removeEventListener('click', process)
      }
      if (recvNode) {
        recvNode.removeEventListener('click', receive)
      }
      statusNode.innerHTML = location.protocol != 'file:' ?
        (gc.connect ?
          (gc.student ?
            (gc.online ?
              (gc.version == Homeworks.version ?
                (gc.res ? modal + '<span id="receive" style="cursor: pointer;font-size: 2em;">📥</span>' : '') + '<span id="send" style="cursor: pointer;font-size: 2em;">📤</span>' :
                'Bitte neue Homeworks Version "' + gc.version + '" herunterladen und nach "STEP/libraries" kopieren <a href="https://' + gc.server + ':11204/homeworks.js" target="_blank">🎁</a>') :
              '<span id="send" style="cursor: pointer;font-size: 2em;">🔴</span>') :
            'Datei "data/student.id" fehlt <a href="https://' + gc.server + ':11204/studentIds.html" target="_blank">⚠️</a>') :
          '<span id="send" style="cursor: pointer;font-size: 2em;">🔗</span>') :
        '<span id="send" style="cursor: pointer;font-size: 2em;">🚫</span>'
      sendNode = document.getElementById('send')
      if (sendNode) {
        sendNode.addEventListener('click', process)
      }
      if (gc.res) {
        recvNode = document.getElementById('receive')
        if (recvNode) {
          recvNode.addEventListener('click', receive)
        }
      }
    }
  }

  function receive() {
    document.getElementById('modal').style.display = 'block'
    document.getElementById('done').addEventListener('click', received)
    document.getElementById('info').value = gc.res.fb
    document.getElementById('info').setAttribute('readonly', 'readonly')
    document.getElementById('icon').src = 'img/' + gc.res.icon
    document.getElementById('done').innerHTML = 'OK'
  }

  function received(evt) {
    document.getElementById('modal').style.display = 'none'
  }

  function process() {
    if (location.protocol != 'file:') {
      if (gc.connect) {
        if (gc.student) {
          if (gc.online) {
            publish()
          } else {
            Homeworks.wsinit()
          }
        } else {
          Homeworks.getStudentId().then(res => Homeworks.wsinit()).catch(error => alert(error))
        }
      } else {
        gc.connect = true
        Homeworks.getStudentId().then(res => Homeworks.wsinit()).catch(error => alert(error))
      }
    } else {
      alert("Du mußt die Seite über den Atom-Live-Server öffnen und nicht aus dem Dateisystem, wenn Du die automatische Hausaufgaben-Abgabe nutzen willst.")
    }
  }

  this.wsinit = function() {
    let url = new URL(window.location.href)
    name = url.searchParams.get("name")
    if (null == name) {
      name = getCookie('name')
      if (null == name) {
        name = "Studi" + Math.floor(rand(100, 999))
      }
    } else {
      if (name.startsWith('Studi')) {
        let saved = getCookie('name')
        if (null != saved) {
          name = saved
        }
      } else {
        setCookie('name', name, 90)
      }
    }

    let port = url.searchParams.get("port")
    // console.log(port)

    if (null != port) {
      httpPort = port
    }

    msgTrace = (msgTrace || null != url.searchParams.get("trace"))

    let host = url.searchParams.get("server")
    if (host) {
      gc.server = host
    }

    let wsUri = 'wss://' + gc.server + ':' + httpsPort
    Homeworks.ws = createWebSocket(wsUri, onState, onReceive)
    return gc
  }

  function onKeyDown(evt) {
    switch (evt.key) {
      case 'R':
        sendState('RESTART', {
          rc: 0
        })
        break
      case 'S':
        sendState('STATE', {})
        break
      case 'Q':
        if (quitCnt++ > 3) {
          sendState('RESTART', {
            rc: -1
          })
        }
        break
      default:
        quitCnt = 0
    }
  }

  function onState(online, ws) {
    console.log(online, ws)
    if (!online) {
      waitCnt = 0
      if (reconnect) {
        setTimeout(reload, 5000)
      }
    } else {
      reconnect = true
    }
    gc.online = online
    Homeworks.updateState()
  }

  function reload() {
    // alert("Reload")
    location.reload(false)
  }

  function onReceive(data) {
    let msg = JSON.parse(data)

    if (msgTrace) {
      console.log("REC", msg)
    }

    // calcLag(msg, new Date().getTime())
    if (gc.id === msg.from) {
      return
    }

    switch (msg.id) {
      case 'ID':
        // connected and server provides ID
        gc.id = msg.data.id
        if (msg.data.ip) {
          gc.server = msg.data.ip
        }
        // if (location.pathname != '/' && (window.innerWidth > 800 || window.innerHeight > 600)) {
        //   createQRCode(location.protocol + '//' + gc.server + ':' + (location.protocol == 'http:' ? httpPort : httpsPort) + location.pathname + '?name=Mobile' + Math.floor(rand(100, 999)), 'p1')
        // }
        sendState('JOIN', {
          student: gc.student,
          aufgabe: Homeworks.aufgabe,
          page: location.pathname,
          version: Homeworks.version
        })
        break
      case 'EXIT':
        break
      case 'REVIEW':
        gc.name = msg.data.name
        if (msg.data.res) {
          gc.res = msg.data.res
        } else {
          gc.res = { icon: 'x.png', fb: '' }
        }
        Homeworks.showReview()
        break
      case 'STORE':
        if (waitCnt > 0) {
          waitCnt--
          if (msg.data.rc < 0) {
            alert("🚫 Hausaufgabe " + Homeworks.aufgabe + " von " + msg.data.name + " NICHT erfolgreich abgegeben: " + msg.data.msg)
            waitCnt = 0
          } else {
            if (waitCnt == 0) {
              if (checkId) {
                clearTimeout(checkId)
                checkId = null
              }
              alert("🍀 Hausaufgabe " + Homeworks.aufgabe + " von " + msg.data.name + " erfolgreich abgegeben.")
              // switch to published page: assign or replace
              // location.assign('https://' + gc.server + ':' + httpsPort + location.pathname)
            }
          }
        }
        break
      case 'INFO':
        console.log(msg.data)
        if (msg.data && !gc.isReview) {
          gc.res = msg.data.res
          gc.version = msg.data.version
          Homeworks.showStatus()
        }
        break
      case 'STATE':
        let state = msg.data
        let list = ''
        if (gc.view == 'table') {
          list = '<table border="1"><tr><th>Name</th><th>Gruppe</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>Feedback</th></tr>'
          for (let id in state.students) {
            list += '<tr><td>' + state.students[id].name + '</td>'
            list += '<td>' + state.students[id].group + '</td>'
            let fb = '-'
            for (let a = 1; a < 8; a++) {
              let icon = 'x.png'
              state.students[id].hw.forEach((hw, h) => {
                if (a == hw.aufgabe) {
                  // let actUrl = 'https://' + state.domain + ':' + httpsPort + state.students[id].dir + hw.html + '?id=' + id + '&hw=' + h
                  let res = state.students[id].res[hw.aufgabe]
                  if (res) {
                    fb = res.fb
                    icon = res.icon
                  }
                }
              })
              list += '<td><img src="shared/img/' + icon + '"></td>'
            }
            list += '<td>' + fb + '</td>'
            list += '</tr>'
          }
          list += '</table>'
        } else {
          for (let id in state.students) {
            list += '<li>' + state.students[id].name + ' (' + state.students[id].group + ')'
            list += '<ol>'
            state.students[id].hw.forEach((hw, h) => {
              let actUrl = 'https://' + state.domain + ':' + httpsPort + state.students[id].dir + hw.html + '?id=' + id + '&hw=' + h
              let res = state.students[id].res[hw.aufgabe]
              list += '<li>' + (!res || hw.date > res.date ? ' 🚦' : ' ✅') + ' <img src="shared/img/' + (res ? res.icon : 'x.png') + '"> <a href="' + actUrl + '" target="_blank">' + hw.html + '</a>'
              list += (res ? ' ' + res.fb : '') + ' ( hw=' + hw.aufgabe + ', v' + hw.version + ', ' + new Date(hw.date).toLocaleString() + (res ? ', ' + new Date(res.date).toLocaleString() : '') + ' )'
            })
            list += '</ol>'
          }
        }
        document.getElementById('hwlist').innerHTML = list
        if (!msgTrace) {
          console.log("REC", msg)
        }
        break
      default:
        break
    }
  }

  function publish() {
    let script = document.getElementById('homework')
    if (null != script) {
      let file = new URL(script.src).pathname.replace(/.*\//, "")
      let aufgabe = file.match(/[0-9]/)[0]
      if (aufgabe == Homeworks.aufgabe) {
        if (waitCnt == 0) {
          waitCnt = 2
          checkId = setTimeout(checkUpload, 10000)
          upload(script)
        } else {
          alert("🙄Vorherige 'Abgeben' Funktion ist noch aktiv.\n⚠️ Bitte noch etwas warten.")
        }
      } else {
        alert("🚫 Der Name der Javascript Datei '" + file + "' passt nicht zur Aufgabennummer in dieser Datei:\nHomeworks.aufgabe = " + Homeworks.aufgabe + ".\n⚠️ Bitte entweder den Dateinamen oder die Aufgabennummer anpassen.")
      }
    } else {
      alert("🚫 Die Hausaufgabe ist in der HTML Seite nicht mit der id 'homework' markiert:\n<script ... id=\"homework\">.\n⚠️ Bitte diese id einfügen.")
    }
  }

  function checkUpload() {
    if (waitCnt > 0) {
      alert('🚫 Hausaufgabe NICHT abgegeben: Keine Rückmeldung vom Server erhalten.\n⚠️ Nochmals probieren und wenn es weiterhin nicht geht, bitte melden.')
      waitCnt = 0
      checkId = null
    }
  }

  function upload(script) {
    getFile(script.src, 'text/javascript').then(data => sendFile(data, {
      file: new URL(script.src).pathname
    }))
    getFile(location.origin + location.pathname, 'text/html').then(data => sendFile(data, {
      file: location.pathname
    }))
  }

  function sendFile(text, context) {
    if (context.file.endsWith('html')) {
      text = text.replace(/<!-- Code injected by live-server -->(.|\n)+<\/script>\n*/m, '')
    }
    sendState('STORE', {
      file: context.file.replace(/\/homeworks\/student/, ''),
      student: gc.student,
      page: location.pathname.replace(/\/homeworks\/student/, ''),
      aufgabe: Homeworks.aufgabe,
      // hash: hashCode(text),
      code: Base64.encode(text)
    })
  }

  function getFile(url, type) {
    return new Promise((resolve, reject) => {
      ajax({
        type: 'GET',
        url: url,
        responseType: 'text',
        headers: {
          'Content-Type': type
        },
        success: (response, context) => resolve(response),
        error: (error, headers) => reject(error)
      })
    })
  }

  function addScript(name) {
    let script = document.createElement("script")
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', name)
    document.head.appendChild(script)
    console.log(document.head)
  }

  function createQRCode(data, id) {
    console.log("qrcode=" + data)
    qr = qrcode(4, 'L')
    qr.addData(data)
    data.value = ""
    qr.make()
    document.getElementById(id).innerHTML = qr.createImgTag()
  }

  function createWebSocket(wsUri, onChange, onReceive) {
    try {
      const ws = new WebSocket(wsUri, 'echo-protocol')

      ws.onopen = function(evt) {
        // console.log("OPEN")
        onChange(true, ws)
      }

      ws.onclose = function(evt) {
        // console.log("CLOSE")
        onChange(false, null)
      }

      ws.onerror = function(evt) {
        onChange(false, null)
        console.log('ERR', evt)
      }

      ws.onmessage = function(evt) {
        // console.log(evt.currentTarget, evt.srcElement, ws)
        onReceive(evt.data)
      }

      ws.calcLag = function(msg, ts) {
        if (msg.from === ws.user.ID) {
          // own message - confirmation of SND, can be used to calculate lag
          lags[lCnt++ % 5] = (ts - msg.ts) / 2
          let lag = 0
          if (lags.length > 4) {
            let med = lags.slice().sort()[2]
            let ll = 0
            for (let l = 0; l < lags.length; l++) {
              if (Math.abs(lags[l] - med) < 1000.0) {
                lag += lags[l]
                ll++
              }
            }
            lag /= ll
            console.log('lag', lag)
          }
          //for (let  i = 0; i < lags.length; i++) {
          //  lag += lags[i]
          //}
          //lag /= lags.length
          //console.log('lag', lag)
        }
      }

      return ws
    } catch (e) {
      console.log(e)
      return null
    }
  }

  const sendState = (msgId, data) => {
    if (Homeworks.ws && Homeworks.ws.readyState === WebSocket.OPEN) {
      const msg = {
        id: msgId,
        from: gc.id,
        ts: new Date().getTime(),
        data: data
      }
      if (msgTrace) {
        console.log("SND", msg)
      }
      Homeworks.ws.send(JSON.stringify(msg))
      if (msg.id == 'RESTART' && msg.data.rc == 0) {
        setTimeout(reload, 2000)
      }
    }
  }

  function clearElement(elem) {
    let id = elem.id
    elem.parentNode.replaceChild(elem.cloneNode(false), elem)
    return document.getElementById(id)
  }

  function setCookie(cname, cval, cdays) {
    if (null == cval) {
      document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    } else {
      let d = new Date()
      d.setTime(d.getTime() + (cdays * 86400000))
      document.cookie = cname + "=" + cval + "; expires=" + d.toUTCString() + "; path=/"
    }
  }

  function getCookie(cname) {
    let name = cname + "="
    let cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i].trim()
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return null
  }

  function createElement(parent, type, attrList) {
    var elem = document.createElementNS(parent.namespaceURI, type)
    parent.appendChild(elem)
    for (attr in attrList) {
      elem.setAttribute(attr, attrList[attr])
    }
    return elem
  }

  function trace(arg) {
    let now = (window.performance.now() / 1000).toFixed(3)
    console.log(now + ': ', arg)
  }

  function rand(min, max) {
    return min + Math.random() * (max - min)
  }

  function ajax(req) {
    const xmlhttp = createXMLHttp()

    // callback for state changes
    xmlhttp.onreadystatechange = function() {
      // request finished
      if (xmlhttp.readyState === 4) {
        // request processed and successful (200) or local file (0)
        if ((xmlhttp.status === 200 || xmlhttp.status === 0 && xmlhttp.response)) {
          if (req.context) {
            const xxx = xmlhttp.getResponseHeader('xxx')
            if (xxx !== "undefined") {
              req.context.xxx = xxx
            }
          }
          // console.log(xmlhttp)
          switch (req.responseType) {
            case "arraybuffer":
            case "blob":
              req.success(xmlhttp.response, req.context)
              break
            case "document":
              req.success(xmlhttp.responseXML, req.context)
              break
            case "json":
              req.success(xmlhttp.response, req.context)
              break
            case "":
            case "text":
              req.success(xmlhttp.responseText, req.context)
              break
            default:
              req.success(xmlhttp.responseText, req.context)
          }
        } else {
          req.error(xmlhttp, xmlhttp.getAllResponseHeaders())
        }
      }
    }

    if (req.responseType) {
      xmlhttp.responseType = req.responseType
    }

    // prepare request
    xmlhttp.open(req.type, req.url, true)

    // Send additional headers information along with the request
    if (req.headers) {
      for (header in req.headers) {
        xmlhttp.setRequestHeader(header, req.headers[header])
      }
    }

    // Send proxy tunnel headers information along with the request
    if (req.xxx) {
      xmlhttp.setRequestHeader("xxx", req.xxx)
    }

    // process request
    if (req.data) {
      xmlhttp.send(req.data)
    } else {
      xmlhttp.send()
    }
  }

  function createXMLHttp() {
    // Create object for ajax requests
    if (window.XMLHttpRequest) {
      // IE7+, Firefox, Chrome, Opera, Safari
      return new XMLHttpRequest()
    } else {
      // IE6, IE5
      const xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
      xmlhttp.overrideMimeType("text/plain; charset=utf-8")
      return xmlhttp
    }
  }

  let lut = []
  for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16)
  }

  function guid7() {
    let d0 = Math.random() * 0xffffffff | 0
    let d1 = Math.random() * 0xffffffff | 0
    let d2 = Math.random() * 0xffffffff | 0
    let d3 = Math.random() * 0xffffffff | 0
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
      lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
      lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff]
  }

  function hashCode(text) {
    let hash = 0,
      i, chr
    if (text.length === 0) return hash
    for (i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i)
      hash |= 0; // Convert to 32bit integer
    }
    return hash
  }

  /**
   *
   *  Base64 encode / decode
   *  http://www.webtoolkit.info
   *
   **/
  const Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

      // public method for encoding
      ,
    encode: function(input) {
        let output = ""
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4
        let i = 0

        input = Base64._utf8_encode(input)

        while (i < input.length) {
          chr1 = input.charCodeAt(i++)
          chr2 = input.charCodeAt(i++)
          chr3 = input.charCodeAt(i++)

          enc1 = chr1 >> 2
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
          enc4 = chr3 & 63

          if (isNaN(chr2)) {
            enc3 = enc4 = 64
          } else if (isNaN(chr3)) {
            enc4 = 64
          }

          output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4)
        } // Whend

        return output
      } // End Function encode


      // public method for decoding
      ,
    decode: function(input) {
        let output = ""
        let chr1, chr2, chr3
        let enc1, enc2, enc3, enc4
        let i = 0

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "")
        while (i < input.length) {
          enc1 = this._keyStr.indexOf(input.charAt(i++))
          enc2 = this._keyStr.indexOf(input.charAt(i++))
          enc3 = this._keyStr.indexOf(input.charAt(i++))
          enc4 = this._keyStr.indexOf(input.charAt(i++))

          chr1 = (enc1 << 2) | (enc2 >> 4)
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
          chr3 = ((enc3 & 3) << 6) | enc4

          output = output + String.fromCharCode(chr1)

          if (enc3 != 64) {
            output = output + String.fromCharCode(chr2)
          }

          if (enc4 != 64) {
            output = output + String.fromCharCode(chr3)
          }

        } // Whend

        output = Base64._utf8_decode(output)

        return output
      } // End Function decode


      // private method for UTF-8 encoding
      ,
    _utf8_encode: function(string) {
        let utftext = ""
        string = string.replace(/\r\n/g, "\n")

        for (let n = 0; n < string.length; n++) {
          let c = string.charCodeAt(n)

          if (c < 128) {
            utftext += String.fromCharCode(c)
          } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192)
            utftext += String.fromCharCode((c & 63) | 128)
          } else {
            utftext += String.fromCharCode((c >> 12) | 224)
            utftext += String.fromCharCode(((c >> 6) & 63) | 128)
            utftext += String.fromCharCode((c & 63) | 128)
          }

        } // Next n

        return utftext
      } // End Function _utf8_encode

      // private method for UTF-8 decoding
      ,
    _utf8_decode: function(utftext) {
      let string = ""
      let i = 0
      let c, c1, c2, c3
      c = c1 = c2 = 0

      while (i < utftext.length) {
        c = utftext.charCodeAt(i)

        if (c < 128) {
          string += String.fromCharCode(c)
          i++
        } else if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1)
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
          i += 2
        } else {
          c2 = utftext.charCodeAt(i + 1)
          c3 = utftext.charCodeAt(i + 2)
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
          i += 3
        }

      } // Whend

      return string
    } // End Function _utf8_decode
  }
}).apply(Homeworks)
document.addEventListener("DOMContentLoaded", function() {
  if (location.protocol == 'file:' || location.hostname.match(/localhost|127.0.0.1/)) {
    Homeworks.createStatusNode()
  } else {
    // console.log(location)
    if (!Homeworks.gc.noMenu) {
      Homeworks.createReviewNode()
    }
  }
})
