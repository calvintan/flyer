const download = document.getElementById('download')
const canvas = document.getElementById('canvas')
const form = document.getElementById('form')
const formURL = document.getElementById('form-URL')
const generate = document.getElementById('generate')
const preview = document.getElementById('preview')
const previewEditable = preview.querySelector('.editable')
const previewH1 = preview.querySelector('h1')
const previewDescription = preview.querySelector('.description')
const previewLink = preview.querySelector('.link')
const previewSkills = preview.querySelector('.skills')

const draw = () => {
  rasterizeHTML.drawDocument(preview, canvas)
}

const render = ({URL, title, description, skills}) => {
  previewLink.textContent = URL
  previewH1.textContent = title
  previewDescription.textContent = description
  previewSkills.innerHTML = skills.map((skill) => `<li>${skill}.</li>`).join('')
  draw()
}

const fetchURL = (URL) => {
  fetch(URL)
  .then((res) => res.text())
  .then((html) => {
    const targetDocument = document.createElement('html')
    targetDocument.innerHTML = html
    const data = {
      URL,
      title: targetDocument.querySelector('h1').textContent,
      description: targetDocument.querySelector('#what-youll-do + p').textContent,
      skills: [...targetDocument.querySelectorAll('#we-are-looking-for-someone-who + ul li strong')].map(node => node.textContent),
    }
    render(data)
  })
  .catch((error) => {
    alert('Unsupported URL')
    console.log(error)
  })
}

previewEditable.addEventListener('input', draw, false)

generate.addEventListener('click', () => {
  fetchURL(formURL.value)
})

download.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png')
  download.href = dataURL
})

fetchURL('https://wiredcraft.cn/jobs/devops/')







