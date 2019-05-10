const download = document.getElementById('download')
const canvas = document.getElementById('canvas')
const form = document.getElementById('form')
const formURL = document.getElementById('form-URL')
const generate = document.getElementById('generate')
const preview = document.getElementById('preview')
const previewEditable = preview.querySelector('.editable')
const previewH1 = preview.querySelector('h1')
const previewH2 = preview.querySelector('h2')
const previewDescription = preview.querySelector('.description')
const previewLink = preview.querySelector('.link')
const previewSkills = preview.querySelector('.skills')
const previewQRCode = preview.querySelector('.qrcode')
const qrcode = new QRCode(previewQRCode, {
  width: 320,
  height: 320,
})

const draw = () => {
  const height = preview.offsetHeight
  canvas.setAttribute('height', height)
  rasterizeHTML.drawDocument(preview, canvas)
}

const render = ({targetURL, title, label, description, skills}) => {
  previewLink.textContent = targetURL
  previewH1.textContent = title
  previewH2.textContent = label
  previewDescription.textContent = description
  // previewSkills.innerHTML = skills.map((skill) => `<li>${skill}.</li>`).join('')
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
      title: targetDocument.querySelector('meta[name="flyer:title"]') ? 
        targetDocument.querySelector('meta[name="flyer:title"]').getAttribute('content') : 
        targetDocument.querySelector('h1').textContent,
      label: targetDocument.querySelector('meta[name="flyer:label"]') ? 
        targetDocument.querySelector('meta[name="flyer:label"]').getAttribute('content') : 
        'Join us',
      description: targetDocument.querySelector('meta[name="flyer:description"]') ? 
        targetDocument.querySelector('meta[name="flyer:description"]').getAttribute('content') : 
        targetDocument.querySelector('meta[name="description"]').getAttribute('content'),
      // skills: [...targetDocument.querySelectorAll('#we-are-looking-for-someone-who + ul li strong')].map(node => node.textContent),
    }
    render(data)
  })
  // .catch((error) => {
  //   console.log(error)
  //   alert('Unsupported targetURL')
  // })
}

previewEditable.addEventListener('input', debounce(draw, 500), false)

generate.addEventListener('click', () => {
  fetchURL(formURL.value)
})

download.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png')
  download.href = dataURL
})

const targetURL =  new URL(location.href).searchParams.get('targetURL')
if (targetURL) {
  formURL.value = targetURL
  fetchURL(targetURL)
}








