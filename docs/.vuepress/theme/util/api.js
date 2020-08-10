const http = ({data, url, method = 'get'}) => {
  return new Promise((resolve, reject) => {
    const origin = location.origin + '/api/'
    const xhr = new XMLHttpRequest()
    xhr.open(method, origin + url)
    xhr.timeout = 15000
    xhr.setRequestHeader('Content-Type', 'application/json')
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data)
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState === 4) {
        const data = JSON.parse(xhr.responseText)
        data.code === 0 ? resolve(data) : reject(data)
      }
    }
  })
}

export default http