// script.js
// Frases para os diferentes idiomas
const texts = {
    "pt": "Por um mundo mais saudável através da bioinformática",
    "en": "For a healthier world through bioinformatics"
  };
  
  // Detecta o idioma ou o nome do arquivo
  function getLanguageFromPage() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("index_english.html")) {
      return "en";
    }
    return "pt";
  }
  
  // Exibe a frase com efeito de digitação
  function typeEffect(language) {
    const text = texts[language];
    const typingElement = document.getElementById("typing-effect");
    let index = 0;
  
    function type() {
      typingElement.innerText = text.substring(0, index + 1);
      index++;
      if (index < text.length) {
        setTimeout(type, 100); // Ajuste a velocidade de digitação aqui
      } else {
        index = 0; // Reinicia o loop após digitar tudo
        setTimeout(type, 1000); // Pausa antes de reiniciar
      }
    }
  
    type();
  }
  
  // Inicializa o script
  window.onload = () => {
    const language = getLanguageFromPage();
    typeEffect(language);
  }; 


// Função para movimentar as barras
  document.addEventListener("scroll", function () {
    const progressBars = document.querySelectorAll(".progress");
    progressBars.forEach(bar => {
        const percentage = bar.dataset.skill; // Recupera o valor do atributo data-skill
        const percentageSpan = bar.parentElement.querySelector(".percentage"); // Encontra o <span>
        
        if (bar.getBoundingClientRect().top < window.innerHeight) {
            bar.style.width = `${percentage}%`; // Aplica a largura dinamicamente
            percentageSpan.textContent = `${percentage}%`; // Define o texto do percentual
        }
    });
});

// Inicializando todas as barras com largura 0%
document.querySelectorAll('.progress').forEach(bar => {
    bar.style.width = "0%"; // Largura inicial
});