const input = document.querySelector('.search__input')
const searchList = document.querySelector('.search__list')
const reposList = document.querySelector('.repos-list')

const inputHandlerDebounced = debounce(inputHandler, 300)

input.addEventListener('input', e => inputHandlerDebounced(e))

function inputHandler(e) {
  if (e.target.value) {
    fetch(`https://api.github.com/search/repositories?q=${e.target.value}&sort=stars&order=desc&per_page=5`)
      .then(response => response.json())
      .then(data => {
        const repos = data.items

        const fragment = document.createDocumentFragment();

        for (let repo of repos) {
          const li = document.createElement('li')
          const button = document.createElement('button')
          button.classList.add('search__list-item')
          button.textContent = repo.name
          button.addEventListener('click', () => {
            createRepoCard(repo.name, repo.owner.login, repo.stargazers_count)
            input.value = ''
            searchList.innerHTML = ''
          })
          li.appendChild(button)
          fragment.appendChild(li)
        }

        searchList.innerHTML = ''
        searchList.appendChild(fragment)
      })
  } else {
    searchList.innerHTML = ''
  }
}

function createRepoCard(name, owner, stars) {
  const repo = document.createElement('li')
  repo.classList.add('repo')

  const repoInfo = document.createElement('div')
  repoInfo.classList.add('repo__info')

  const repoRemoveButton = document.createElement('button')
  repoRemoveButton.classList.add('repo__remove-button')
  repoRemoveButton.addEventListener('click', () => repo.remove())

  const repoName = document.createElement('p')
  repoName.classList.add('repo__name')
  repoName.textContent = `Name: ${name}`

  const repoOwner = document.createElement('p')
  repoOwner.classList.add('repo__owner')
  repoOwner.textContent = `Owner: ${owner}`

  const repoStars = document.createElement('p')
  repoStars.classList.add('repo__stars')
  repoStars.textContent = `Stars: ${stars}`

  repoInfo.appendChild(repoName)
  repoInfo.appendChild(repoOwner)
  repoInfo.appendChild(repoStars)

  repo.appendChild(repoInfo)
  repo.appendChild(repoRemoveButton)

  reposList.insertAdjacentElement('afterbegin', repo)
}

function debounce(func, timeout) {
  let timer

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout)
  };
}