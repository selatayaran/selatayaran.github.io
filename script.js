// 1. Variáveis Globais
let currentLanguage = 'pt'; // Definido como português inicialmente
let languages = {}; // Vai armazenar as traduções carregadas

// Função para carregar o arquivo JSON correspondente
async function loadLanguage(language) {
    try {
        const response = await fetch(`translations/${language}.json`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const data = await response.json();
        languages[language] = data; // Armazenando os dados do idioma
        currentLanguage = language;
        updateContent(); // Atualiza o conteúdo com o idioma carregado
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

// Carregar o idioma padrão (Português)
loadLanguage('pt');

// Função para mudar o idioma
function changeLanguage(language) {
    if (!languages[language]) {
        loadLanguage(language); // Carrega o idioma se ainda não foi carregado
    } else {
        currentLanguage = language;
        updateContent(); // Atualiza o conteúdo imediatamente se o idioma já estiver carregado
    }
}

// Função de efeito de digitação
function typeEffect() {
    const langData = languages[currentLanguage];
    if (!langData) return;

    const text = langData.sections.inicio.typing_effect;
    const typingElement = document.getElementById("typing-effect");
    let index = 0;

    function type() {
        if (typingElement) {
            typingElement.innerText = text.substring(0, index + 1);
            index++;
            if (index < text.length) {
                setTimeout(type, 100);
            } else {
                index = 0;
                setTimeout(type, 1000);
            }
        }
    }
    type();
}

function populateSkills(habilidades) {
    const section = document.getElementById('habilidades');
    section.innerHTML = ''; // Limpa a seção antes de adicionar conteúdo

    // Atualiza o título com a imagem
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.innerHTML = `
        <img src="img/tecnicskills.png" alt="Habilidades Técnicas" class="icon">
        ${habilidades.title}
    `;
    section.appendChild(title);

    const categories = habilidades.categories;

    for (const categoryKey in categories) {
        if (categories.hasOwnProperty(categoryKey)) {
            const category = categories[categoryKey];
            const card = document.createElement('div');
            card.className = 'skill-card';

            const cardTitle = document.createElement('h3');
            cardTitle.textContent = category.title;
            card.appendChild(cardTitle);

            const skillsContainer = document.createElement('div');
            skillsContainer.className = 'skills-container';

            for (const skillKey in category.skills) {
                if (category.skills.hasOwnProperty(skillKey)) {
                    const skill = category.skills[skillKey];
                    const skillItem = document.createElement('div');
                    skillItem.className = 'skill-item';

                    // Ícone da habilidade
                    const icon = document.createElement('img');
                    icon.src = skill.icon;
                    icon.alt = skill.name;
                    icon.className = 'skill-icon';
                    skillItem.appendChild(icon);

                    // Nome e barra de progresso
                    const skillDetails = document.createElement('div');
                    skillDetails.className = 'skill-details';

                    const skillName = document.createElement('span');
                    skillName.className = 'skill-name';
                    skillName.textContent = skill.name;
                    skillDetails.appendChild(skillName);

                    const progressBar = document.createElement('div');
                    progressBar.className = 'progress-bar';

                    const progress = document.createElement('div');
                    progress.className = 'progress';
                    progress.style.width = `${skill.progress}%`;
                    progressBar.appendChild(progress);

                    skillDetails.appendChild(progressBar);
                    skillItem.appendChild(skillDetails);

                    skillsContainer.appendChild(skillItem);
                }
            }
            card.appendChild(skillsContainer);
            section.appendChild(card);
        }
    }
}

function updateContent() {
    const langData = languages[currentLanguage];

    if (!langData) {
        console.error('Dados do idioma não encontrados.');
        return;
    }

    try {
        // Atualizando o título da página
        document.getElementById('page-title').textContent = langData.title;

        // Atualizando o menu
        const menuItems = [
            'inicio', 'sobre', 'habilidades', 'educacao',
            'experiencia', 'projetos', 'contato'
        ];
        menuItems.forEach(item => {
            const menuElement = document.getElementById(`menu-${item}`);
            if (menuElement) menuElement.textContent = langData.menu[item];
        });

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
        if (educacaoSection) {
            const educacaoTitle = educacaoSection.querySelector('.section-title');
            const educationContainer = educacaoSection.querySelector('.education-container');

            if (educacaoTitle) educacaoTitle.textContent = langData.sections.educacao.title;
            if (educationContainer) {
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
            }
        }

        // Atualizando a seção "experiencia"
        const experienciaSection = document.getElementById('experiencia');
        if (experienciaSection) {
            const experienciaTitle = experienciaSection.querySelector('.section-title');
            const timeline = experienciaSection.querySelector('.timeline');

            if (experienciaTitle) experienciaTitle.textContent = langData.sections.experiencia.title;
            if (timeline) {
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
            }
        }

        // Atualizar habilidades
        populateSkills(langData.sections.habilidades);


        // Atualizando a seção "projetos"
        const projetosSection = document.getElementById('projetos');
        if (projetosSection) {
            const projetosTitle = projetosSection.querySelector('.section-title');
            const projectsGrid = projetosSection.querySelector('.projects-grid');

            if (projetosTitle) projetosTitle.textContent = langData.sections.projetos.title;
            if (projectsGrid) {
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
            }
        }

        // Seção contatos
        document.getElementById("contato-title").textContent = langData.sections.contato.title;

        // Configurar botões de download dinamicamente
        const downloadSection = document.querySelector(".contact-download");
        if (langData.sections.contato.download) { 
            const downloadItems = Object.values(langData.sections.contato.download); 
            downloadItems.forEach((item) => {
                if (downloadSection && downloadSection.children.length === 0) {
                    downloadItems.forEach((item) => {
                        const button = document.createElement('button');
                        button.innerText = item.name;
                        button.onclick = () => window.open(item.link, "_blank");
                        downloadSection.appendChild(button);
                    });
                }                
            });
        }

        // Rodapé
        document.getElementById("footer-text").innerText = langData.sections.footer.text; 


    } catch (error) {
        console.error('Erro ao atualizar o conteúdo:', error);
    }
}