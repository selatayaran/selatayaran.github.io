// Variáveis Globais
let currentLanguage = 'pt'; // Definido como português inicialmente
let languages = {}; // Vai armazenar as traduções carregadas
let typingInterval = null;

// Carrega todas as traduções ao carregar o site
async function preloadTranslations() {
    const languagesToLoad = ['pt', 'en']; // Lista de idiomas disponíveis
    const promises = languagesToLoad.map(async (lang) => {
        try {
            const response = await fetch(`translations/${lang}.json`);
            if (!response.ok) throw new Error(`Erro ao carregar ${lang}: ${response.status}`);
            const data = await response.json();
            languages[lang] = data; // Armazena as traduções
        } catch (error) {
            console.error(`Erro ao carregar o idioma ${lang}:`, error);
        }
    });

    await Promise.all(promises); // Aguarda o carregamento de todos os idiomas
    updateContent(); // Atualiza o conteúdo com o idioma padrão
}

function setupMobileMenuToggle() {
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.querySelector(".top-menu");
    const menuLinks = document.querySelectorAll(".top-menu a");

    if (menuToggle && menu) {
        // Função para alternar o menu
        const toggleMenu = () => {
            const isMenuOpen = menu.classList.toggle("menu-open");
            menuToggle.setAttribute("aria-expanded", isMenuOpen);
        };

        // Função para fechar o menu
        const closeMenu = () => {
            menu.classList.remove("menu-open");
            menuToggle.setAttribute("aria-expanded", "false");
        };

        // Adiciona eventos para clique e toque no botão
        menuToggle.addEventListener("click", toggleMenu);
        menuToggle.addEventListener("touchstart", toggleMenu);

        // Adiciona eventos para clique e toque nos links do menu
        menuLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
            link.addEventListener("touchstart", closeMenu);
        });
    } else {
        console.error("Elementos do menu não encontrados!");
    }
}

// Função de efeito de digitação
function typeEffect() {
    const langData = languages[currentLanguage];
    if (!langData) return;

    const text = langData.sections.inicio.typing_effect;
    const typingElement = document.getElementById("typing-effect");
    let index = 0;

    // Limpa qualquer intervalo anterior
    if (typingInterval) clearInterval(typingInterval);

    // Define um novo intervalo para o efeito de digitação
    typingInterval = setInterval(() => {
        if (typingElement) {
            typingElement.innerText = text.substring(0, index + 1);
            index++;

            // Reinicia o texto ao final
            if (index >= text.length) {
                clearInterval(typingInterval); // Pausa ao terminar
                setTimeout(() => {
                    index = 0; // Reseta o índice
                    typeEffect(); // Reinicia o efeito
                }, 1000); // Espera 1 segundo antes de reiniciar
            }
        }
    }, 100); // Velocidade de digitação
}

// Configurar botões de download dinamicamente
function updateDownloadButtons() {
    const langData = languages[currentLanguage];
    const downloadSection = document.querySelector(".contact-download");

    if (!langData.sections.contato.download || !downloadSection) return;

        // Limpa todos os botões existentes na seção
        downloadSection.innerHTML = '';

        // Adiciona os botões traduzidos
        const downloadItems = Object.values(langData.sections.contato.download);
        downloadItems.forEach(item => {
            const button = document.createElement('button');
            button.innerText = item.name; // Nome traduzido
            button.onclick = () => window.open(item.link, "_blank"); // Link correspondente
            downloadSection.appendChild(button);
        });
}

// Função para trocar idioma e reiniciar o efeito de digitação
function changeLanguage(language) {
    if (!languages[language]) {
        preloadTranslations(); // Carrega todos os idiomas
    } else {
        currentLanguage = language;
        updateContent(); // Atualiza o conteúdo imediatamente
    }
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

    // Cria o contêiner de grade
    const skillsGrid = document.createElement('div');
    skillsGrid.className = 'skills-grid';
    section.appendChild(skillsGrid);

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
                    progress.dataset.skill = skill.progress;
                    progressBar.appendChild(progress);

                    skillDetails.appendChild(progressBar);
                    skillItem.appendChild(skillDetails);

                    skillsContainer.appendChild(skillItem);
                }
            }
            card.appendChild(skillsContainer);
            skillsGrid.appendChild(card); // Adiciona o card à grade
        }
    }

    // Adiciona a função de movimentar as barras após carregar o conteúdo
    setupProgressBars();
}

// Função para movimentar as barras
function setupProgressBars() {
    document.addEventListener("scroll", function () {
        const progressBars = document.querySelectorAll(".progress");
        progressBars.forEach(bar => {
            const percentage = bar.dataset.skill; // Recupera o valor do atributo data-skill
            if (bar.getBoundingClientRect().top < window.innerHeight) {
                bar.style.width = `${percentage}%`; // Aplica a largura dinamicamente
            }
        });
    });
};

// Inicializando todas as barras com largura 0%
document.querySelectorAll('.progress').forEach(bar => {
    bar.style.width = "0%"; // Largura inicial
});

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

            // Atualiza o título da seção
            if (projetosTitle) projetosTitle.textContent = langData.sections.projetos.title;

            // Atualiza os itens na grade (projetos ou artigos)
            if (projectsGrid) {
                projectsGrid.innerHTML = ''; // Limpa o conteúdo atual da grade

                langData.sections.projetos.itens.forEach(item => {
                    // Cria o cartão do projeto ou artigo
                    const projectCard = document.createElement('div');
                    projectCard.classList.add('project-card');

                    // Define o conteúdo do cartão
                    projectCard.innerHTML = `
                        <h3>${item.title}</h3>
                        <a href="${item.link}" class="project-link" target="_blank">${langData.sections.projetos.botton}</a>
                    `;

                    // Adiciona o cartão na grade
                    projectsGrid.appendChild(projectCard);
                });
            }
        }


        // Seção contatos
        document.getElementById("contato-title").textContent = langData.sections.contato.title;

        updateDownloadButtons();

        // Rodapé
        document.getElementById("footer-text").innerText = langData.sections.footer.text; 


    } catch (error) {
        console.error('Erro ao atualizar o conteúdo:', error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await preloadTranslations(); // Aguarda o carregamento das traduções
        updateContent(); // Atualiza o conteúdo com o idioma padrão
        setupMobileMenuToggle(); // Configura o menu mobile
    } catch (error) {
        console.error("Erro durante a inicialização:", error);
    }
});