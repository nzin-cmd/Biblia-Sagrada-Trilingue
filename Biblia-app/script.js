const translations = {};
let currentLang = 'pt';
let selectedBook = null;
let selectedChapter = null;
let isDark = false;
let searchTerm = '';

const books = {
  old: [
    { name: 'Gênesis', chapters: 50 },
    { name: 'Êxodo', chapters: 40 },
    { name: 'Levítico', chapters: 27 },
    { name: 'Números', chapters: 36 },
    { name: 'Deuteronômio', chapters: 34 },
    { name: 'Josué', chapters: 24 },
    { name: 'Juízes', chapters: 21 },
    { name: 'Rute', chapters: 4 },
    { name: '1 Samuel', chapters: 31 },
    { name: '2 Samuel', chapters: 24 },
    { name: '1 Reis', chapters: 22 },
    { name: '2 Reis', chapters: 25 },
    { name: '1 Crônicas', chapters: 29 },
    { name: '2 Crônicas', chapters: 36 },
    { name: 'Esdras', chapters: 10 },
    { name: 'Neemias', chapters: 13 },
    { name: 'Ester', chapters: 10 },
    { name: 'Jó', chapters: 42 },
    { name: 'Salmos', chapters: 150 },
    { name: 'Provérbios', chapters: 31 },
    { name: 'Eclesiastes', chapters: 12 },
    { name: 'Cânticos', chapters: 8 },
    { name: 'Isaías', chapters: 66 },
    { name: 'Jeremias', chapters: 52 },
    { name: 'Lamentações', chapters: 5 },
    { name: 'Ezequiel', chapters: 48 },
    { name: 'Daniel', chapters: 12 },
    { name: 'Oseias', chapters: 14 },
    { name: 'Joel', chapters: 3 },
    { name: 'Amós', chapters: 9 },
    { name: 'Obadias', chapters: 1 },
    { name: 'Jonas', chapters: 4 },
    { name: 'Miquéias', chapters: 7 },
    { name: 'Naum', chapters: 3 },
    { name: 'Habacuque', chapters: 3 },
    { name: 'Sofonias', chapters: 3 },
    { name: 'Ageu', chapters: 2 },
    { name: 'Zacarias', chapters: 14 },
    { name: 'Malaquias', chapters: 4 }
  ],
  new: [
    { name: 'Mateus', chapters: 28 },
    { name: 'Marcos', chapters: 16 },
    { name: 'Lucas', chapters: 24 },
    { name: 'João', chapters: 21 },
    { name: 'Atos', chapters: 28 },
    { name: 'Romanos', chapters: 16 },
    { name: '1 Coríntios', chapters: 16 },
    { name: '2 Coríntios', chapters: 13 },
    { name: 'Gálatas', chapters: 6 },
    { name: 'Efésios', chapters: 6 },
    { name: 'Filipenses', chapters: 4 },
    { name: 'Colossenses', chapters: 4 },
    { name: '1 Tessalonicenses', chapters: 5 },
    { name: '2 Tessalonicenses', chapters: 3 },
    { name: '1 Timóteo', chapters: 6 },
    { name: '2 Timóteo', chapters: 4 },
    { name: 'Tito', chapters: 3 },
    { name: 'Filemom', chapters: 1 },
    { name: 'Hebreus', chapters: 13 },
    { name: 'Tiago', chapters: 5 },
    { name: '1 Pedro', chapters: 5 },
    { name: '2 Pedro', chapters: 3 },
    { name: '1 João', chapters: 5 },
    { name: '2 João', chapters: 1 },
    { name: '3 João', chapters: 1 },
    { name: 'Judas', chapters: 1 },
    { name: 'Apocalipse', chapters: 22 }
  ]
};

async function loadTranslations(lang) {
  if (!translations[lang]) {
    const res = await fetch(`./locales/${lang}.json`);
    translations[lang] = await res.json();
  }
}

function t(key) {
  return translations[currentLang][key] || key;
}

function renderBookList(booksArr) {
  return booksArr.map(book => `
    <li class="book-item${selectedBook === book.name ? ' selected' : ''}" data-book="${book.name}">
      <b>${t(book.name)}</b>
      <span>${book.chapters} ${t('chapter_label')}</span>
    </li>
  `).join('');
}

function renderChapterList(book) {
  if (!book) return '';
  let chapters = [];
  for (let i = 1; i <= book.chapters; i++) {
    chapters.push(`<li class="chapter-item${selectedChapter === i ? ' selected' : ''}" data-chapter="${i}">${t('chapter_label')} ${i}</li>`);
  }
  return `<ul class="chapter-list">${chapters.join('')}</ul>`;
}

async function renderVerses(book, chapter) {
  if (!book || !chapter) return '';

  const bookFileMap = {
    'Gênesis': 'gen.txt',
    'Êxodo': 'exod.txt',
    'Levítico': 'lev.txt',
    'Números': 'num.txt',
    'Deuteronômio': 'deut.txt',
    'Josué': 'jos.txt',
    'Juízes': 'juiz.txt',
    'Rute': 'rute.txt',
    '1 Samuel': '1sa.txt',
    '2 Samuel': '2sa.txt',
    '1 Reis': '1rs.txt',
    '2 Reis': '2rs.txt',
    '1 Crônicas': '1crn.txt',
    '2 Crônicas': '2crn.txt',
    'Esdras': 'esd.txt',
    'Neemias': 'nee.txt',
    'Ester': 'est.txt',
    'Jó': 'jo.txt',
    'Salmos': 'sal.txt',
    'Provérbios': 'prov.txt',
    'Eclesiastes': 'ecl.txt',
    'Cânticos': 'cant.txt',
    'Isaías': 'isa.txt',
    'Jeremias': 'jer.txt',
    'Lamentações': 'lam.txt',
    'Ezequiel': 'eze.txt',
    'Daniel': 'dan.txt',
    'Oseias': 'ose.txt',
    'Joel': 'joel.txt',
    'Amós': 'amos.txt',
    'Obadias': 'oba.txt',
    'Jonas': 'jon.txt',
    'Miquéias': 'miq.txt',
    'Naum': 'naum.txt',
    'Habacuque': 'hab.txt',
    'Sofonias': 'sof.txt',
    'Ageu': 'ageu.txt',
    'Zacarias': 'zac.txt',
    'Malaquias': 'mal.txt',
    'Mateus': 'mat.txt',
    'Marcos': 'mar.txt',
    'Lucas': 'luc.txt',
    'João': 'joao.txt',
    'Atos': 'atos.txt',
    'Romanos': 'rom.txt',
    '1 Coríntios': '1cor.txt',
    '2 Coríntios': '2cor.txt',
    'Gálatas': 'gal.txt',
    'Efésios': 'efes.txt',
    'Filipenses': 'fil.txt',
    'Colossenses': 'col.txt',
    '1 Tessalonicenses': '1tes.txt',
    '2 Tessalonicenses': '2tes.txt',
    '1 Timóteo': '1tim.txt',
    '2 Timóteo': '2tim.txt',
    'Tito': 'tito.txt',
    'Filemom': 'flm.txt',
    'Hebreus': 'heb.txt',
    'Tiago': 'tiag.txt',
    '1 Pedro': '1ped.txt',
    '2 Pedro': '2ped.txt',
    '1 João': '1joao.txt',
    '2 João': '2joao.txt',
    '3 João': '3joao.txt',
    'Judas': 'jud.txt',
    'Apocalipse': 'apo.txt'
  };
  const fileName = bookFileMap[book.name];
  if (fileName) {
    try {
      const path = currentLang === 'pt' ? `assets/${fileName}` : `assets/${currentLang}/${fileName}`;
      const res = await fetch(path);
      const text = await res.text();
      const lines = text.split('\n');
      
      console.log(`[renderVerses] Carregando arquivo: ${path}`);
      console.log(`[renderVerses] Tamanho do texto carregado: ${text.length}`);
      console.log(`[renderVerses] Número de linhas: ${lines.length}`);
      console.log(`[renderVerses] Primeiras 5 linhas:`, lines.slice(0, 5));

      let verses = [];

      if (currentLang === 'fr') {
        // Lógica para o formato francês: [Capítulo:Versículo] Texto
        const lineRegex = /\[(\d+):(\d+)\]\s*(.*)/;
        console.log(`[renderVerses - FR - Debug] Regex usada: ${lineRegex}`);
        
        for (const line of lines) {
          const match = line.match(lineRegex);

          if (match) {
            const parsedChapter = parseInt(match[1]);
            const verseNumber = match[2];
            let verseText = (match[3] || '').trim();

            if (parsedChapter === chapter) {
              verses.push(`<div class="verse"><b>${verseNumber}</b> ${verseText}</div>`);
            }
          }
        }
      } else if (currentLang === 'ln') {
        // Lógica para o formato Lingala: [Código do Livro] [Capítulo] [Versículo] Texto
        const lineRegex = /(\d+)\s+(\w+)\s+(\d+)\s+(\d+)\s+(.*)/;
        console.log(`[renderVerses - LN - Debug] Regex usada: ${lineRegex}`);
        
        for (const line of lines) {
          const match = line.match(lineRegex);

          if (match) {
            const parsedChapter = parseInt(match[3]);
            const verseNumber = parseInt(match[4]);
            let verseText = (match[5] || '').trim();

            if (parsedChapter === chapter) {
              verses.push(`<div class="verse"><b>${verseNumber}</b> ${verseText}</div>`);
            }
          }
        }
      } else { // Lógica para o formato português (e outros futuros formatos similares)
        // Descobrir o prefixo do versículo (ex: Gn, Exod, etc)
        let prefix = '';
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('\\abbreviation')) {
            prefix = lines[i + 1].replace('*abbreviation', '').trim();
            console.log(`[renderVerses] Prefixo encontrado: ${prefix}`);
            break;
          }
        }
        
        console.log(`[renderVerses] Procurando versículos com prefixo: ${prefix} e capítulo: ${chapter}`);
        let foundVerses = false;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith(`\\v ${prefix}.${chapter}.`)) {
            console.log(`[renderVerses] Encontrado versículo na linha ${i}: ${line}`);
            foundVerses = true;
            const verseNumber = line.split('.')[2];
            let verseText = '';
            let currentLineIndex = i + 1;

            // Coletar todas as linhas que compõem o versículo
            while (currentLineIndex < lines.length && !lines[currentLineIndex].startsWith('\\v ') && !lines[currentLineIndex].startsWith('\\abbreviation') && !lines[currentLineIndex].startsWith('\\name-long') && !lines[currentLineIndex].startsWith('\\name-short')) {
              verseText += lines[currentLineIndex] + ' ';
              currentLineIndex++;
            }
            verseText = verseText.trim(); // Limpar espaços extras no início/fim

            // Remover tags de formatação e quebras de linha indesejadas
            verseText = verseText.replace(/\{[^}]*\}/g, ''); // Remove {tr,rp:texto} e similares
            verseText = verseText.replace(/\\added.*?\\*added/g, ''); // Remove \added...\*added e seu conteúdo
            verseText = verseText.replace(/\\fn.*?\\*fn/g, ''); // Remove \fn...\*fn (notas de rodapé)
            verseText = verseText.replace(/\\key.*?\\*key/g, ''); // Remove \key...\*key
            verseText = verseText.replace(/\\ref.*?\\*ref/g, ''); // Remove \ref...\*ref
            verseText = verseText.replace(/\\trnc.*?\\*trnc/g, ''); // Remove \trnc...\*trnc
            verseText = verseText.replace(/\s*\n\s*/g, ' '); // Substitui quebras de linha remanescentes por espaço único
            verseText = verseText.trim(); // Limpa espaços extras no início/fim

            verses.push(`<div class="verse"><b>${verseNumber}</b> ${verseText}</div>`);
          }
        }
        if (!foundVerses) {
          console.log(`[renderVerses] Nenhum versículo encontrado com o padrão \\v ${prefix}.${chapter}.`);
        }
      }
      
      if (verses.length === 0) {
        console.log(`[renderVerses] Nenhum versículo encontrado para ${book.name} capítulo ${chapter}.`);
        return '<div class=\"verses-list\">Nenhum versículo encontrado.</div>';
      }
      console.log(`[renderVerses] Total de versículos encontrados para ${book.name} capítulo ${chapter}: ${verses.length}`);
      return `<div class=\"verses-list\">${verses.join('')}</div>`;
    } catch (e) {
      console.error("Erro ao carregar ou parsear versículos:", e);
      return '<div class=\"verses-list\">Erro ao carregar versículos.</div>';
    }
  }
  // Para livros sem arquivo, mostrar exemplo fictício
  let verses = [];
  for (let i = 1; i <= 5; i++) {
    verses.push(`<div class=\"verse\"><b>${i}</b> Exemplo de versículo ${i} do capítulo ${chapter} de ${book.name}.</div>`);
  }
  return `<div class=\"verses-list\">${verses.join('')}</div>`;
}

function addBookItemListeners() {
  document.querySelectorAll('.book-item').forEach(item => {
    item.onclick = () => {
      selectedBook = item.getAttribute('data-book');
      selectedChapter = null;
      renderReadPage();
      setTimeout(() => {
        const chaptersBox = document.querySelector('.chapters-box');
        if (chaptersBox) chaptersBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    };
  });
}

function addChapterItemListeners(book) {
  document.querySelectorAll('.chapter-item').forEach(item => {
    item.onclick = () => {
      selectedChapter = parseInt(item.getAttribute('data-chapter'));
      renderReadPage();
      setTimeout(() => {
        const versesBox = document.querySelector('.verses-box');
        if (versesBox) versesBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    };
  });
}

async function renderReadPage() {
  await loadTranslations(currentLang);
  let bookObj = books.old.concat(books.new).find(b => b.name === selectedBook);
  let versesHtml = '';
  if (bookObj && selectedChapter) {
    versesHtml = await renderVerses(bookObj, selectedChapter);
  }
  document.getElementById('mainContent').innerHTML = `
    <!--
    <div class="card">
      <h2>🌐 ${t('select_translation')}</h2>
      <div class="custom-select" id="translationSelect">
        <div class="select-selected" data-value="acf">Almeida Corrigida Fiel</div>
        <div class="select-items select-hide">
          <div data-value="acf">Almeida Corrigida Fiel</div>
        </div>
      </div>
    </div>
    -->
    <div class="card">
      <h2>📖 ${t('select_book')}</h2>
      <h3>${t('old_testament')}</h3>
      <ul class="book-list">
        ${renderBookList(books.old)}
      </ul>
      <h3>${t('new_testament')}</h3>
      <ul class="book-list">
        ${renderBookList(books.new)}
      </ul>
      ${bookObj ? `<div class="chapters-box"><h4>${t('chapters_of')} ${t(bookObj.name)}</h4>${renderChapterList(bookObj)}</div>` : ''}
      ${bookObj && selectedChapter ? `<div class="verses-box"><h4>${t('verses_of_chapter')} ${selectedChapter}</h4>${versesHtml}</div>` : ''}
    </div>
  `;
  addBookItemListeners();
  if (bookObj) addChapterItemListeners(bookObj);
  setupCustomSelect(document.getElementById("translationSelect")); // Inicializa o seletor de tradução
}

async function renderSearchPage() {
  await loadTranslations(currentLang);
  document.getElementById('mainContent').innerHTML = `
    <div class="card">
      <h2>🔍 ${t('search_scriptures')}</h2>
      <input id="searchInput" type="text" value="${searchTerm}" placeholder="${t('search_placeholder')}" style="width:70%">
      <button id="searchBtn">${t('search')}</button>
      <div id="searchResults"></div>
    </div>
  `;
  document.getElementById('searchInput').oninput = (e) => {
    searchTerm = e.target.value;
    showSearchResults();
  };
  document.getElementById('searchBtn').onclick = showSearchResults;
  showSearchResults();
}

async function showSearchResults() {
  const resultsDiv = document.getElementById('searchResults');
  if (!searchTerm.trim()) {
    resultsDiv.innerHTML = '';
    return;
  }
  const term = searchTerm.trim().toLowerCase();
  const allBooks = books.old.concat(books.new);
  const bookFileMap = {
    'Gênesis': 'gen.txt', 'Êxodo': 'exod.txt', 'Levítico': 'lev.txt', 'Números': 'num.txt', 'Deuteronômio': 'deut.txt',
    'Josué': 'jos.txt', 'Juízes': 'juiz.txt', 'Rute': 'rute.txt', '1 Samuel': '1sa.txt', '2 Samuel': '2sa.txt',
    '1 Reis': '1rs.txt', '2 Reis': '2rs.txt', '1 Crônicas': '1crn.txt', '2 Crônicas': '2crn.txt', 'Esdras': 'esd.txt',
    'Neemias': 'nee.txt', 'Ester': 'est.txt', 'Jó': 'jo.txt', 'Salmos': 'sal.txt', 'Provérbios': 'prov.txt',
    'Eclesiastes': 'ecl.txt', 'Cânticos': 'cant.txt', 'Isaías': 'isa.txt', 'Jeremias': 'jer.txt', 'Lamentações': 'lam.txt',
    'Ezequiel': 'eze.txt', 'Daniel': 'dan.txt', 'Oseias': 'ose.txt', 'Joel': 'joel.txt', 'Amós': 'amos.txt',
    'Obadias': 'oba.txt', 'Jonas': 'jon.txt', 'Miquéias': 'miq.txt', 'Naum': 'naum.txt', 'Habacuque': 'hab.txt',
    'Sofonias': 'sof.txt', 'Ageu': 'ageu.txt', 'Zacarias': 'zac.txt', 'Malaquias': 'mal.txt', 'Mateus': 'mat.txt',
    'Marcos': 'mar.txt', 'Lucas': 'luc.txt', 'João': 'joao.txt', 'Atos': 'atos.txt', 'Romanos': 'rom.txt',
    '1 Coríntios': '1cor.txt', '2 Coríntios': '2cor.txt', 'Gálatas': 'gal.txt', 'Efésios': 'efes.txt', 'Filipenses': 'fil.txt',
    'Colossenses': 'col.txt', '1 Tessalonicenses': '1tes.txt', '2 Tessalonicenses': '2tes.txt', '1 Timóteo': '1tim.txt',
    '2 Timóteo': '2tim.txt', 'Tito': 'tito.txt', 'Filemom': 'flm.txt', 'Hebreus': 'heb.txt', 'Tiago': 'tiag.txt',
    '1 Pedro': '1ped.txt', '2 Pedro': '2ped.txt', '1 João': '1joao.txt', '2 João': '2joao.txt', '3 João': '3joao.txt',
    'Judas': 'jud.txt', 'Apocalipse': 'apo.txt'
  };
  let results = [];
  for (const book of allBooks) {
    const fileName = bookFileMap[book.name];
    if (!fileName) continue;
    try {
      const path = currentLang === 'pt' ? `assets/${fileName}` : `assets/${currentLang}/${fileName}`;
      const res = await fetch(path);
      const text = await res.text();
      const lines = text.split('\n');

      console.log(`[showSearchResults - ${book.name}] Idioma atual: ${currentLang}`);
      console.log(`[showSearchResults - ${book.name}] Linhas lidas: ${lines.length}`);

      let parsedLines = [];

      if (currentLang === 'fr') {
        const lineRegex = /\[(\d+):(\d+)\]\s*(.*)/;
        console.log(`[showSearchResults - FR - ${book.name}] Regex usada: ${lineRegex}`);
        for (const line of lines) {
          const match = line.match(lineRegex);
          if (match) {
            parsedLines.push({
              chapter: match[1],
              verse: match[2],
              text: match[3].trim()
            });
          }
        }
      } else if (currentLang === 'ln') {
        const lineRegex = /(\d+)\s+(\w+)\s+(\d+)\s+(\d+)\s+(.*)/;
        console.log(`[showSearchResults - LN - ${book.name}] Regex usada: ${lineRegex}`);
        for (const line of lines) {
          const match = line.match(lineRegex);
          if (match) {
            parsedLines.push({
              chapter: parseInt(match[3]),
              verse: parseInt(match[4]),
              text: match[5].trim()
            });
          }
        }
      } else { // Para pt (e outros formatos similares)
        // Descobrir o prefixo do versículo (ex: Gn, Exod, etc)
        let prefix = '';
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('\\abbreviation')) {
            prefix = lines[i + 1].replace('*abbreviation', '').trim();
            break;
          }
        }
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith(`\\v ${prefix}.`)) {
            const refParts = lines[i].split('.');
            const chapter = parseInt(refParts[1]);
            const verse = parseInt(refParts[2]);
            const verseText = (lines[i + 1] || '').trim();
            parsedLines.push({
              chapter: chapter,
              verse: verse,
              text: verseText
            });
          }
        }
      }

      console.log(`[showSearchResults - ${book.name}] Versículos parseados: ${parsedLines.length}`);
      console.log(`[showSearchResults - ${book.name}] Termo de busca: ${term}`);

      for (const parsedLine of parsedLines) {
        if (parsedLine.text.toLowerCase().includes(term)) {
          results.push(`<div style='margin-bottom:0.7em'><b>${book.name} ${parsedLine.chapter}:${parsedLine.verse}</b> — ${parsedLine.text}</div>`);
        }
      }

    } catch (e) {
      console.error(`Erro ao carregar ou parsear versículos para ${book.name} (${currentLang}):`, e);
    }
  }
  let html = '';
  if (results.length) {
    html += `<div style='margin-top:1em'><b>${t('passages_found')}</b><br>${results.join('')}</div>`;
  } else {
    html = `<div style="margin-top:1em">${t('no_passages_found')}</div>`;
  }
  resultsDiv.innerHTML = html;
}

function getMoonIcon() {
  return `<svg width="22" height="22" fill="none" stroke="#1c2532" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>`;
}
function getSunIcon() {
  return `<svg width="22" height="22" fill="none" stroke="#f7c948" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
}
function updateThemeIcon() {
  document.getElementById('themeIcon').innerHTML = isDark ? getSunIcon() : getMoonIcon();
}

function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
  updateThemeIcon();
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

document.getElementById('lerBtn').onclick = () => {
  document.getElementById('lerBtn').classList.add('active');
  document.getElementById('buscarBtn').classList.remove('active');
  renderReadPage();
};
document.getElementById('buscarBtn').onclick = () => {
  document.getElementById('buscarBtn').classList.add('active');
  document.getElementById('lerBtn').classList.remove('active');
  renderSearchPage();
};

document.getElementById('themeBtn').onclick = toggleTheme;

// Nova função para fechar todos os menus suspensos personalizados
function closeAllCustomSelects() {
  const selectItems = document.querySelectorAll(".select-items");
  const selectSelected = document.querySelectorAll(".select-selected");

  selectItems.forEach(item => {
    item.classList.add("select-hide");
  });
  selectSelected.forEach(item => {
    item.classList.remove("select-arrow-active");
  });
}

function setupCustomSelect(selectElement) {
  let selectedElem = selectElement.getElementsByClassName("select-selected")[0];
  let selectItems = selectElement.getElementsByClassName("select-items")[0];
  let options = selectItems.getElementsByTagName("div");
  let initialValue = selectedElem.getAttribute("data-value") || options[0].getAttribute("data-value");

  // Garante que o menu de itens comece oculto (importante para o estado inicial)
  selectItems.classList.add("select-hide");

  // Define o valor inicial baseado no `data-value` do select-selected ou na primeira opção
  selectedElem.setAttribute("data-value", initialValue);

  // Renderiza o texto inicial da opção selecionada
  const initialOption = Array.from(options).find(opt => opt.getAttribute("data-value") === initialValue);
  if (initialOption) {
    selectedElem.innerHTML = initialOption.innerHTML + '<span class="arrow-down"></span>';
    // Adiciona a classe 'same-as-selected' para que o CSS de seleção funcione
    Array.from(options).forEach(opt => {
      if (opt.getAttribute("data-value") === initialValue) {
        opt.classList.add("same-as-selected");
      } else {
        opt.classList.remove("same-as-selected");
      }
    });
  }

  for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("click", async function(e) {
      let selectedValue = this.getAttribute("data-value");
      let selectedText = this.innerHTML;

      // Remove a classe 'same-as-selected' de todos os itens
      Array.from(options).forEach(opt => {
        opt.classList.remove("same-as-selected");
      });
      // Adiciona a classe 'same-as-selected' ao item clicado
      this.classList.add("same-as-selected");

      selectedElem.innerHTML = selectedText + '<span class="arrow-down"></span>';
      selectedElem.setAttribute("data-value", selectedValue);
      
      closeAllCustomSelects(); // Fecha todos os menus após uma seleção

      // Dispatch custom event for language change
      if (selectElement.id === 'langSelect') {
        currentLang = selectedValue;
        if (document.getElementById('lerBtn').classList.contains('active')) {
          await renderReadPage();
        } else {
          await renderSearchPage();
        }
      }
      // Adicionar lógica para outros seletores personalizados aqui se houver
      if (selectElement.id === 'translationSelect') {
        // Lógica para o seletor de tradução (por enquanto, apenas exibe a tradução)
        console.log("Tradução selecionada:", selectedValue);
        // Futuramente, você pode adicionar a lógica para carregar diferentes traduções aqui
      }
    });
  }

  selectedElem.addEventListener("click", function(e) {
    e.stopPropagation(); // Impede que o clique se propague para o listener global

    const wasOpen = !selectItems.classList.contains("select-hide"); // Verifica o estado atual

    closeAllCustomSelects(); // Fecha todos os menus

    // Se o menu estava fechado, abra-o
    if (!wasOpen) {
      this.classList.add("select-arrow-active");
      selectItems.classList.remove("select-hide");
    }
  });
}

// Adiciona um listener global para fechar os seletores quando clicar fora
document.addEventListener("click", function(event) {
  // Se o clique não foi dentro de um componente custom-select
  if (!event.target.closest('.custom-select')) {
    closeAllCustomSelects(); // Fecha todos os seletores sem exceção
  }
});

// Inicialização
window.onload = () => {
  isDark = localStorage.getItem('theme') === 'dark';
  document.body.classList.toggle('dark', isDark);
  updateThemeIcon();
  renderReadPage(); // Garante que o DOM com custom selects esteja pronto
  
  // Inicializa todos os custom selects na página
  document.querySelectorAll('.custom-select').forEach(selectElement => {
    setupCustomSelect(selectElement);
  });
};

document.getElementById('themeBtn').onclick = toggleTheme;