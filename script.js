let currentLanguage = 'pt'; // Definido como português inicialmente

let languages = {}; // Vai armazenar as traduções carregadas

// Função para carregar o arquivo JSON correspondente
function loadLanguage(language) {
    return fetch(`translations/${language}.json`)
        .then(response => response.json())
        .then(data => {
            languages[language] = data; // Armazenando os dados do idioma
            currentLanguage = language;
            updateContent(); // Atualiza o conteúdo com o idioma carregado
        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
}

// Função para mudar o idioma
function changeLanguage(language) {
    if (!languages[language]) {
        loadLanguage(language); // Carrega o idioma se ainda não foi carregado
    } else {
        currentLanguage = language;
        updateContent(); // Atualiza o conteúdo imediatamente se o idioma já estiver carregado
    }
}

// Função para atualizar o conteúdo com base no idioma
function updateContent() {
    const langData = languages[currentLanguage];

    if (!langData) return;

    // Atualizando o título da página
    document.getElementById('page-title').textContent = langData.title;

    // Atualizando o menu
    document.getElementById('menu-inicio').textContent = langData.menu.inicio;
    document.getElementById('menu-sobre').textContent = langData.menu.sobre;
    document.getElementById('menu-habilidades').textContent = langData.menu.habilidades;
    document.getElementById('menu-educacao').textContent = langData.menu.educacao;
    document.getElementById('menu-experiencia').textContent = langData.menu.experiencia;
    document.getElementById('menu-projetos').textContent = langData.menu.projetos;
    document.getElementById('menu-contato').textContent = langData.menu.contato;

    // Atualizando a seção "inicio"
    document.getElementById('inicio-title').textContent = langData.sections.inicio.name;
    document.getElementById('typing-effect').textContent = langData.sections.inicio.typing_effect;
    typeEffect(); // Atualiza o efeito de digitação com o texto do idioma atual

    // Atualizando a seção "sobre"
    document.getElementById('sobre-title').textContent = langData.sections.sobre.title;
    document.getElementById('sobre-description1').textContent = langData.sections.sobre.description[0];
    document.getElementById('sobre-description2').textContent = langData.sections.sobre.description[1];
    document.getElementById('profile-image').alt = langData.sections.sobre.profile_image_alt;

    // Atualizando a seção "educacao"
    const educacaoSection = document.getElementById('educacao');
    const educacaoTitle = educacaoSection.querySelector('.section-title');
    const educationContainer = educacaoSection.querySelector('.education-container');

    educacaoTitle.textContent = langData.sections.educacao.title;
    educationContainer.innerHTML = '';
    langData.sections.educacao.items.forEach(item => {
        const educationItem = document.createElement('div');
        educationItem.classList.add('education-item');

        educationItem.innerHTML = `
            <h3>${item.course}</h3>
            <p><strong>${langData.sections.educacao.labels.institution}:</strong> ${item.institution}</p>
            <p><strong>${langData.sections.educacao.labels.mode}:</strong> ${item.mode}</p>
            <p><strong>${langData.sections.educacao.labels.start}:</strong> ${item.start}</p>
            <p><strong>${langData.sections.educacao.labels.end}:</strong> ${item.end}</p>
        `;
        educationContainer.appendChild(educationItem);
    });

    // Atualizando a seção "experiencia"
    const experienciaSection = document.getElementById('experiencia');
    const experienciaTitle = experienciaSection.querySelector('.section-title');
    const timeline = experienciaSection.querySelector('.timeline');

    experienciaTitle.textContent = langData.sections.experiencia.title;
    timeline.innerHTML = '';
    langData.sections.experiencia.items.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.classList.add('timeline-item');

        timelineItem.innerHTML = `
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-content">
                <h3>${item.role}</h3>
                <p>${item.description}</p>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });

    // Atualizando a seção "habilidades"
    const habilidadesSection = document.getElementById('habilidades');
    const habilidadesTitle = habilidadesSection.querySelector('h2');
    const skillsContainer = habilidadesSection.querySelector('.skills-container');

    habilidadesTitle.textContent = langData.sections.habilidades.title;
    skillsContainer.innerHTML = '';

    Object.entries(langData.sections.habilidades.categories).forEach(([categoryKey, categoryData]) => {
        const skillsCard = document.createElement('div');
        skillsCard.classList.add('skills-card');

        skillsCard.innerHTML = `<h3>${categoryData.title}</h3>`;

        Object.entries(categoryData.skills).forEach(([skillKey, skillName]) => {
            const skillElement = document.createElement('div');
            skillElement.classList.add('skill');

            skillElement.innerHTML = `
                <label>${skillName}</label>
                <div class="progress-bar">
                    <div class="progress" data-skill="0"></div>
                    <span class="percentage">0%</span>
                </div>
            `;
            skillsCard.appendChild(skillElement);
        });
        skillsContainer.appendChild(skillsCard);
    });

    // Atualizando a seção "projetos"
    const projetosSection = document.getElementById('projetos');
    const projetosTitle = projetosSection.querySelector('.section-title');
    const projectsGrid = projetosSection.querySelector('.projects-grid');

    projetosTitle.textContent = langData.sections.projetos.title;
    projectsGrid.innerHTML = '';

    langData.sections.projetos.items.forEach(item => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card');

        projectCard.innerHTML = `
            <h3>${item.title}</h3>
            <a href="${item.link}" class="project-link" target="_blank">Ver Artigo</a>
        `;
        projectsGrid.appendChild(projectCard);
    });

    // Atualizando a seção "contato"
    const contatoSection = document.getElementById('contato');
    const contatoTitle = contatoSection.querySelector('h2');
    const contactButtons = contatoSection.querySelector('.contact-buttons');
    const downloadButtons = contatoSection.querySelector('.download-buttons');

    contatoTitle.textContent = langData.sections.contato.title;

    // Atualizando botões de contato
    contactButtons.innerHTML = ''; 
    Object.values(langData.sections.contato.buttons).forEach(button => {
        const buttonElement = document.createElement('button');
        buttonElement.innerHTML = `
            <img src="img/${button.name.toLowerCase().replace(' ', '-')}.png" alt="${button.name}" class="contact-image">
            ${button.name}
        `;
        buttonElement.onclick = () => window.open(button.link, '_blank');
        contactButtons.appendChild(buttonElement);
    });

    // Atualizando botões de download
    downloadButtons.innerHTML = ''; 
    downloadButtons.innerHTML += `
        <button onclick="window.open('${langData.sections.contato.buttons.curriculo.link}')">${langData.sections.contato.buttons.curriculo.name}</button>
        <button onclick="window.open('${langData.sections.contato.buttons.carta.link}')">${langData.sections.contato.buttons.carta.name}</button>
    `;

    // Atualizando o Footer
    const footer = document.querySelector('.footer p');
    footer.textContent = langData.footer.text;  // Atualizando o texto do footer
}

// Função de efeito de digitação
function typeEffect() {
    const langData = languages[currentLanguage];
    const text = langData.sections.inicio.typing_effect;
    const typingElement = document.getElementById("typing-effect");
    let index = 0;

    function type() {
        typingElement.innerText = text.substring(0, index + 1);
        index++;
        if (index < text.length) {
            setTimeout(type, 100);
        } else {
            index = 0;
            setTimeout(type, 1000);
        }
    }
    type(); 
}

// Carregar o idioma padrão (Português)
loadLanguage('pt');