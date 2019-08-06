const download = document.getElementById('download')
const canvas = document.getElementById('canvas')
const formURL = document.getElementById('form-URL')
const generate = document.getElementById('generate')
const preview = document.getElementById('preview')
const previewEditable = preview.querySelector('.editable')
const previewH1 = preview.querySelector('h1')
const previewLabel = preview.querySelector('.label')
const previewDescription = preview.querySelector('.description')
const previewLink = preview.querySelector('.link')
const previewPoster = preview.querySelector('.poster')
const previewQRCode = preview.querySelector('.qrcode')
const qrcode = new QRCode(previewQRCode, {
  width: 320,
  height: 320,
})
const URLObject = new URL(location.href)
const URLSearch = URLObject.searchParams

const draw = () => {
  const height = preview.offsetHeight
  canvas.setAttribute('height', height)
  rasterizeHTML.drawDocument(preview, canvas)
}

const render = ({targetURL, title, label, description, image}) => {
  previewLink.textContent = targetURL
  previewH1.textContent = title
  previewLabel.textContent = label
  previewDescription.innerHTML = description
  previewPoster.setAttribute('src', image)
  qrcode.makeCode(targetURL)
  draw()
}

const fetchURL = (targetURL) => {
  fetch(targetURL)
  .then((res) => res.text())
  .then((html) => {
    const targetDocument = document.createElement('html')
    targetDocument.innerHTML = html
    const data = {
      targetURL,
      title: targetDocument.querySelector('meta[name="flyer:title"]') &&
        targetDocument.querySelector('meta[name="flyer:title"]').getAttribute('content') ||
        targetDocument.querySelector('h1').textContent,
      label: targetDocument.querySelector('meta[name="flyer:label"]') &&
        targetDocument.querySelector('meta[name="flyer:label"]').getAttribute('content') ||
        'Join us',
      description: targetDocument.querySelector('meta[name="flyer:body"]') &&
        targetDocument.querySelector('meta[name="flyer:body"]').getAttribute('content').replace(/\s/g, '').length &&
        targetDocument.querySelector('meta[name="flyer:body"]').getAttribute('content') ||
        // targetDocument.querySelector('meta[name="description"]').getAttribute('content'),
        targetDocument.querySelector('div.narrow').innerHTML,
      image: targetDocument.querySelector('meta[property="og:image"]') &&
        targetDocument.querySelector('meta[property="og:image"]').getAttribute('content') ||
        './poster.png',
    }
    render(data)
  })
}

previewEditable.addEventListener('input', debounce(draw, 500), false)

generate.addEventListener('click', () => {
  URLSearch.set('targetURL', formURL.value)
  location.href = URLObject.href
})

formURL.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    URLSearch.set('targetURL', formURL.value)
    location.href = URLObject.href
  }
}, false)

download.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png')
  download.href = dataURL
})

const targetURL =  URLSearch.get('targetURL')
if (targetURL) {
  formURL.value = targetURL
  fetchURL(targetURL)
}
