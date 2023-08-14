const input = document.querySelector('.search__input')
const searchList = document.querySelector('.search__list')
const repositoriesList = document.querySelector('.repositories-list')

const inputHandlerDebounced = debounce(inputHandler, 500)

input.addEventListener('input', e => inputHandlerDebounced(e))

function inputHandler(e) {
  if (e.target.value) {
    fetch(`https://api.github.com/search/repositories?q=${e.target.value}&sort=stars&order=desc&per_page=5`)
      .then(response => response.json())
      .then(data => {
        const repositories = data.items
        if (repositories.length) {
          const fragment = document.createDocumentFragment();

          for (let repository of repositories) {
            const li = document.createElement('li')
            const button = document.createElement('button')
            button.classList.add('search__list-item')
            button.textContent = repository.name
            button.addEventListener('click', () => {
              createRepositoryCard(repository.name, repository.owner.login, repository.stargazers_count)
              input.value = ''
              searchList.innerHTML = ''
            })
            li.appendChild(button)
            fragment.appendChild(li)
          }

          searchList.innerHTML = ''
          searchList.appendChild(fragment)
        } else {
          const div = document.createElement('div')
          div.classList.add('search__message')
          div.textContent = 'Nothing found'

          searchList.innerHTML = ''
          searchList.appendChild(div)
        }
      })
  } else {
    searchList.innerHTML = ''
  }
}

function createRepositoryCard(name, owner, stars) {
  const repository = document.createElement('li')
  repository.classList.add('repository')

  const repositoryInfo = document.createElement('div')
  repositoryInfo.classList.add('repository__info')

  const repositoryRemoveButton = document.createElement('button')
  repositoryRemoveButton.classList.add('repository__remove-button')
  repositoryRemoveButton.addEventListener('click', () => repository.remove())

  const repositoryName = document.createElement('p')
  repositoryName.classList.add('repository__name')
  repositoryName.textContent = `Name: ${name}`

  const repositoryOwner = document.createElement('p')
  repositoryOwner.classList.add('repository__owner')
  repositoryOwner.textContent = `Owner: ${owner}`

  const repositoryStars = document.createElement('p')
  repositoryStars.classList.add('repository__stars')
  repositoryStars.textContent = `Stars: ${stars}`

  repositoryInfo.appendChild(repositoryName)
  repositoryInfo.appendChild(repositoryOwner)
  repositoryInfo.appendChild(repositoryStars)

  repository.appendChild(repositoryInfo)
  repository.appendChild(repositoryRemoveButton)

  repositoriesList.insertAdjacentElement('afterbegin', repository)
}

function debounce(func, timeout) {
  let timer

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout)
  };
}