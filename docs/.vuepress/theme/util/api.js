export default http = ({data, url, method = 'get'}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.send(data)
    xhr.onreadystatechange = () => {
      debugger
      // if ()
    }
  })
}