// https://www.mascotarios.org/wp-content/uploads/2011/08/Mojave.jpg

import api from './api';

class App {
    
    constructor() {
        this.repositories = [];
        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repo]');
        this.listEl = document.getElementById('repo-list');
        this.registerHandlers();
    }

    registerHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    setLoading(loading = true) {
        if(loading) {
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Carregando...'));
            loadingEl.setAttribute('id', 'loading');
            this.formEl.appendChild(loadingEl);
        }
        else {
            document.getElementById('loading').remove();
        }
    }

    async addRepository(event) {
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if(repoInput.length === 0) {
            return;
        }
        this.setLoading();
        try {
            const response = await api.get(`/repos/${repoInput}`);
            console.log(response);
            console.log(response.name);
            const {name, description, html_url, owner: {avatar_url}} = response.data;
            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url,
            });

            this.inputEl.value = '';
            this.render();
        }
        catch (err) {
            this.setLoading(false);
            alert('ERRO: O repositório não existe.');
        }
        this.setLoading(false);
    }

    render() {
        this.listEl.innerHTML = '';

        this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let descEl = document.createElement('p');
            descEl.appendChild(document.createTextNode(repo.description));

            let urlEl = document.createElement('a');
            urlEl.setAttribute('href', repo.html_url);
            urlEl.appendChild(document.createTextNode('Acessar'));
            urlEl.setAttribute('target', '_blank');

            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descEl);
            listItemEl.appendChild(urlEl);

            
            this.listEl.appendChild(listItemEl);
        })
    }

}

new App();