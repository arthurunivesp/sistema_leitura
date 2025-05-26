document.addEventListener('DOMContentLoaded', () => {
    // Referências para todas as seções
    const instructionsSection = document.getElementById('instructions');
    const gameplaySection = document.getElementById('gameplay');
    const comprehensionSection = document.getElementById('comprehension');
    const resultsSection = document.getElementById('results');
    const adminSection = document.getElementById('adminSection');

    // Botões e displays do jogo
    const startButton = document.getElementById('startButton'); // Botão "Iniciar Jogo" na tela de instruções do aluno
    const timerDisplay = document.getElementById('timer');
    const readingContent = document.getElementById('readingContent');
    const finishReadingButton = document.getElementById('finishReadingButton');
    const nextPhaseButton = document.getElementById('nextPhaseButton');
    const comprehensionTextDiv = document.getElementById('comprehensionText');
    const question1Para = document.getElementById('question1');
    const answer1Input = document.getElementById('answer1');
    const question2Para = document.getElementById('question2');
    const answer2Input = document.getElementById('answer2');
    const submitAnswersButton = document.getElementById('submitAnswersButton');
    const totalTimePara = document.getElementById('totalTime');
    const comprehensionResultPara = document.getElementById('comprehensionResult');
    const restartButton = document.getElementById('restartButton');

    // Elementos do feedback de interpretação final
    const comprehensionFeedbackDiv = document.getElementById('comprehensionFeedback');
    const feedbackQ1 = document.getElementById('feedbackQ1');
    const feedbackQ2 = document.getElementById('feedbackQ2');

    // Elementos da seção de administração
    const phase1ContentInput = document.getElementById('phase1Content');
    const phase1ExplanationTextarea = document.getElementById('phase1Explanation');
    const phase2ContentInput = document.getElementById('phase2Content');
    const phase2ExplanationTextarea = document.getElementById('phase2Explanation');
    const phase3ContentTextarea = document.getElementById('phase3Content');
    const phase3ExplanationTextarea = document.getElementById('phase3Explanation');
    const phase4ContentTextarea = document.getElementById('phase4Content');
    const phase4ExplanationTextarea = document.getElementById('phase4Explanation');
    const comprehensionMainTextarea = document.getElementById('comprehensionMainText');
    const question1AdminInput = document.getElementById('question1Admin');
    const answer1AdminInput = document.getElementById('answer1Admin');
    const question2AdminInput = document.getElementById('question2Admin');
    const answer2AdminInput = document.getElementById('answer2Admin');
    const comprehensionExplanationTextarea = document.getElementById('comprehensionExplanation');
    const saveContentButton = document.getElementById('saveContentButton');
    const saveMessage = document.getElementById('saveMessage');
    const startPlayForStudentButton = document.getElementById('startPlayForStudentButton');

    // Elementos do Modal de Feedback
    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const explanationText = document.getElementById('explanationText');
    const retryPhaseButton = document.getElementById('retryPhaseButton');
    const showExplanationButton = document.getElementById('showExplanationButton');
    const continueGameButton = document.getElementById('continueGameButton');

    let currentPhase = 0;
    let timerInterval;
    let startTime;
    let readingTimes = [];
    const TIME_THRESHOLD = 20; // Tempo limite em segundos para as fases de leitura

    // Variáveis para armazenar as últimas respostas e o status da interpretação
    let lastAnswers = { q1: '', q2: '' };
    let lastCorrectStatus = { q1: false, q2: false };

    // Objeto para armazenar todo o conteúdo do jogo, incluindo explicações
    let gameContent = {
        phases: [
            {
                type: 'reading',
                content: "gato",
                instruction: "Leia a palavra abaixo o mais rápido que puder:",
                explanation: "Esta fase é para praticar a leitura de palavras curtas. Tente identificar todas as letras rapidamente.",
                buttonText: "Terminei de Ler!"
            },
            {
                type: 'reading',
                content: "Casa azul grande",
                instruction: "Leia as palavras abaixo:",
                explanation: "Aqui, você pratica a leitura de pequenas frases. Tente ler as palavras em sequência, sem interrupções.",
                buttonText: "Terminei de Ler!"
            },
            {
                type: 'reading',
                content: "O sol brilha no céu. Os pássaros cantam alegremente pela manhã.",
                instruction: "Leia o texto curto:",
                explanation: "Nesta fase, o objetivo é ler um texto curto de forma fluida. Preste atenção à pontuação.",
                buttonText: "Terminei de Ler!"
            },
            {
                type: 'reading',
                content: "A borboleta colorida voava entre as flores do jardim, procurando por néctar doce. Ela tinha asas com tons de azul e amarelo, muito bonitas.",
                instruction: "Leia o texto mais longo:",
                explanation: "Este texto é um pouco mais longo. Tente manter a velocidade de leitura e a compreensão do que está acontecendo na história.",
                buttonText: "Terminei de Ler!"
            },
            {
                type: 'comprehension',
                content: "Era uma vez uma pequena coruja que adorava ler livros. Ela passava suas noites na biblioteca da floresta, aprendendo sobre estrelas e rios. Um dia, ela encontrou um mapa antigo que mostrava o caminho para uma árvore mágica de sabedoria.",
                explanation: "Nesta fase, o importante é ler o texto com atenção para entender bem a história. As perguntas testam o quanto você conseguiu absorver da leitura. Lembre-se que as respostas precisam ser exatas!",
                questions: [
                    {
                        question: "O que a pequena coruja adorava fazer?",
                        correctAnswer: "ler livros"
                    },
                    {
                        question: "O que a coruja encontrou um dia?",
                        correctAnswer: "um mapa antigo"
                    }
                ]
            }
        ]
    };

    // Função para carregar o conteúdo salvo do localStorage
    function loadContent() {
        const savedContent = localStorage.getItem('gameReadingContent');
        if (savedContent) {
            gameContent = JSON.parse(savedContent);
            // Preencher os campos da administração com o conteúdo carregado
            phase1ContentInput.value = gameContent.phases[0].content;
            phase1ExplanationTextarea.value = gameContent.phases[0].explanation;
            phase2ContentInput.value = gameContent.phases[1].content;
            phase2ExplanationTextarea.value = gameContent.phases[1].explanation;
            phase3ContentTextarea.value = gameContent.phases[2].content;
            phase3ExplanationTextarea.value = gameContent.phases[2].explanation;
            phase4ContentTextarea.value = gameContent.phases[3].content;
            phase4ExplanationTextarea.value = gameContent.phases[3].explanation;
            comprehensionMainTextarea.value = gameContent.phases[4].content;
            question1AdminInput.value = gameContent.phases[4].questions[0].question;
            answer1AdminInput.value = gameContent.phases[4].questions[0].correctAnswer;
            question2AdminInput.value = gameContent.phases[4].questions[1].question;
            answer2AdminInput.value = gameContent.phases[4].questions[1].correctAnswer;
            comprehensionExplanationTextarea.value = gameContent.phases[4].explanation;
        }
    }

    // Função para salvar o conteúdo no localStorage
    function saveContent() {
        gameContent.phases[0].content = phase1ContentInput.value.trim();
        gameContent.phases[0].explanation = phase1ExplanationTextarea.value.trim();
        gameContent.phases[1].content = phase2ContentInput.value.trim();
        gameContent.phases[1].explanation = phase2ExplanationTextarea.value.trim();
        gameContent.phases[2].content = phase3ContentTextarea.value.trim();
        gameContent.phases[2].explanation = phase3ExplanationTextarea.value.trim();
        gameContent.phases[3].content = phase4ContentTextarea.value.trim();
        gameContent.phases[3].explanation = phase4ExplanationTextarea.value.trim();
        gameContent.phases[4].content = comprehensionMainTextarea.value.trim();
        gameContent.phases[4].explanation = comprehensionExplanationTextarea.value.trim();
        gameContent.phases[4].questions[0].question = question1AdminInput.value.trim();
        gameContent.phases[4].questions[0].correctAnswer = answer1AdminInput.value.trim();
        gameContent.phases[4].questions[1].question = question2AdminInput.value.trim();
        gameContent.phases[4].questions[1].correctAnswer = answer2AdminInput.value.trim();

        localStorage.setItem('gameReadingContent', JSON.stringify(gameContent));
        saveMessage.textContent = 'Conteúdo salvo com sucesso!';
        setTimeout(() => {
            saveMessage.textContent = '';
        }, 3000); // Mensagem some após 3 segundos
    }


    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000; // duration in seconds
        return duration;
    }

    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function showPhase(phaseIndex) {
        // Esconde o modal de feedback se estiver visível
        feedbackModal.classList.add('hidden'); 
        gameplaySection.classList.remove('hidden'); // Garante que a seção de jogo esteja visível

        const phase = gameContent.phases[phaseIndex];
        readingContent.innerHTML = `<p>${phase.instruction}</p><p class="content-to-read">${phase.content}</p>`;
        timerDisplay.textContent = '00:00'; // Reset timer display

        finishReadingButton.classList.remove('hidden');
        nextPhaseButton.classList.add('hidden');
        
        comprehensionSection.classList.add('hidden');
        comprehensionFeedbackDiv.classList.add('hidden'); // Esconde o feedback final de compreensão

        startTimer();
    }

    function handleFinishReading() {
        const timeTaken = stopTimer();
        
        // Remove a última entrada de tempo se a fase estiver sendo refeita
        if (readingTimes.length > currentPhase) {
            readingTimes[currentPhase] = timeTaken;
        } else {
            readingTimes.push(timeTaken);
        }

        // Verifica se o tempo foi muito alto (apenas para fases de leitura)
        if (currentPhase < gameContent.phases.length - 1 && timeTaken > TIME_THRESHOLD) {
            showFeedbackModal("Poxa! Você levou um tempo um pouco alto para ler esta fase. Que tal tentar novamente para melhorar?", true, true, false);
            // Não avança para a próxima fase automaticamente
        } else {
            alert(`Você levou ${timeTaken.toFixed(1)} segundos para ler esta fase.`);
            goToNextPhase();
        }
    }

    function goToNextPhase() {
        currentPhase++;
        if (currentPhase < gameContent.phases.length - 1) { // Ainda há fases de leitura
            showPhase(currentPhase);
        } else if (currentPhase === gameContent.phases.length - 1) { // Última fase é de interpretação
            displayComprehensionPhase();
        } else {
            console.error("Game finished unexpectedly.");
        }
    }

    function displayComprehensionPhase() {
        gameplaySection.classList.add('hidden');
        comprehensionSection.classList.remove('hidden');
        const comprehensionPhase = gameContent.phases[currentPhase];
        comprehensionTextDiv.innerHTML = `<p>${comprehensionPhase.content}</p>`;
        question1Para.textContent = comprehensionPhase.questions[0].question;
        question2Para.textContent = comprehensionPhase.questions[1].question;
        answer1Input.value = ''; // Limpa respostas anteriores
        answer2Input.value = '';
    }

    function calculateResults() {
        let correctAnswers = 0;
        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 1];

        lastAnswers.q1 = answer1Input.value.trim();
        lastAnswers.q2 = answer2Input.value.trim();

        lastCorrectStatus.q1 = (lastAnswers.q1.toLowerCase() === comprehensionPhase.questions[0].correctAnswer.toLowerCase());
        lastCorrectStatus.q2 = (lastAnswers.q2.toLowerCase() === comprehensionPhase.questions[1].correctAnswer.toLowerCase());
        
        if (lastCorrectStatus.q1) correctAnswers++;
        if (lastCorrectStatus.q2) correctAnswers++;

        if (correctAnswers < 2) { // Se a criança errou alguma pergunta
            showFeedbackModal(`Você acertou ${correctAnswers} de 2 perguntas. Que tal rever o texto e tentar de novo?`, true, true, false, true); // Último true indica que é fase de interpretação
        } else {
            showFinalResults(correctAnswers);
        }
    }

    function showFinalResults(correctAnswers) {
        comprehensionSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');

        // Calcula o tempo total de leitura (apenas as fases de leitura)
        const totalReadingDuration = readingTimes.slice(0, gameContent.phases.length - 1).reduce((sum, time) => sum + time, 0);
        const minutes = Math.floor(totalReadingDuration / 60);
        const seconds = Math.floor(totalReadingDuration % 60);
        totalTimePara.textContent = `Tempo total de leitura (fases 1-4): ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        comprehensionResultPara.textContent = `Você acertou ${correctAnswers} de 2 perguntas de interpretação.`;

        // Exibe o feedback detalhado das questões de interpretação
        comprehensionFeedbackDiv.classList.remove('hidden');
        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 1];

        // Pergunta 1
        let feedback1Text = `Pergunta 1: ${comprehensionPhase.questions[0].question}<br>`;
        if (lastCorrectStatus.q1) {
            feedback1Text += `Sua resposta: "${lastAnswers.q1}" - **Correta!**`;
            feedbackQ1.className = 'correct';
        } else {
            feedback1Text += `Sua resposta: "${lastAnswers.q1}" - **Incorreta.** A resposta correta era: "${comprehensionPhase.questions[0].correctAnswer}"`;
            feedbackQ1.className = 'incorrect';
        }
        feedbackQ1.innerHTML = feedback1Text;

        // Pergunta 2
        let feedback2Text = `Pergunta 2: ${comprehensionPhase.questions[1].question}<br>`;
        if (lastCorrectStatus.q2) {
            feedback2Text += `Sua resposta: "${lastAnswers.q2}" - **Correta!**`;
            feedbackQ2.className = 'correct';
        } else {
            feedback2Text += `Sua resposta: "${lastAnswers.q2}" - **Incorreta.** A resposta correta era: "${comprehensionPhase.questions[1].correctAnswer}"`;
            feedbackQ2.className = 'incorrect';
        }
        feedbackQ2.innerHTML = feedback2Text;
    }

    function restartGame() {
        currentPhase = 0;
        readingTimes = [];
        lastAnswers = { q1: '', q2: '' }; // Limpa as respostas anteriores
        lastCorrectStatus = { q1: false, q2: false }; // Reseta o status de correção
        
        // Ao reiniciar, volta para a tela de administração
        showAdminScreen();
    }

    /**
     * Exibe o modal de feedback
     * @param {string} message Mensagem a ser exibida.
     * @param {boolean} showRetry Se o botão "Tentar Novamente" deve aparecer.
     * @param {boolean} showExplanation Se o botão "Ver Explicação" deve aparecer.
     * @param {boolean} showContinue Se o botão "Continuar Jogo" deve aparecer (para quando não há erro, mas um feedback).
     * @param {boolean} isComprehensionPhase Se o feedback é para a fase de interpretação.
     */
    function showFeedbackModal(message, showRetry, showExplanation, showContinue, isComprehensionPhase = false) {
        gameplaySection.classList.add('hidden'); // Oculta a seção de jogo
        comprehensionSection.classList.add('hidden'); // Oculta a seção de interpretação
        feedbackModal.classList.remove('hidden');
        feedbackMessage.textContent = message;
        explanationText.classList.add('hidden'); // Esconde a explicação por padrão

        retryPhaseButton.classList.toggle('hidden', !showRetry);
        showExplanationButton.classList.toggle('hidden', !showExplanation);
        continueGameButton.classList.toggle('hidden', !showContinue);

        // Se for fase de interpretação e houver erro, a opção de continuar não deve aparecer diretamente
        if (isComprehensionPhase && showRetry) {
             continueGameButton.classList.add('hidden');
        } else if (!showRetry && !showExplanation) { // Se não tem erro, só continuar
             continueGameButton.classList.remove('hidden');
        }
    }

    // --- Gerenciamento de Telas ---
    function showAdminScreen() {
        adminSection.classList.remove('hidden');
        instructionsSection.classList.add('hidden');
        gameplaySection.classList.add('hidden');
        comprehensionSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        feedbackModal.classList.add('hidden'); // Esconde o modal caso esteja aberto
    }

    function showStudentStartScreen() {
        adminSection.classList.add('hidden');
        instructionsSection.classList.remove('hidden');
        gameplaySection.classList.add('hidden');
        comprehensionSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        feedbackModal.classList.add('hidden'); // Esconde o modal caso esteja aberto
    }
    // --- Fim Gerenciamento de Telas ---


    // Event Listeners

    // Botão "Salvar Conteúdo" na tela de administração
    saveContentButton.addEventListener('click', saveContent);

    // Novo botão "Iniciar Jogo para o Aluno" na tela de administração
    startPlayForStudentButton.addEventListener('click', showStudentStartScreen);

    // Botão "Iniciar Jogo" na tela de instruções do aluno
    startButton.addEventListener('click', () => {
        instructionsSection.classList.add('hidden');
        showPhase(currentPhase);
    });

    finishReadingButton.addEventListener('click', handleFinishReading);
    submitAnswersButton.addEventListener('click', calculateResults);

    // Botões do Modal
    retryPhaseButton.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
        if (gameContent.phases[currentPhase].type === 'reading') {
            showPhase(currentPhase); // Volta para a mesma fase de leitura
        } else if (gameContent.phases[currentPhase].type === 'comprehension') {
            displayComprehensionPhase(); // Volta para a mesma fase de interpretação
        }
    });

    showExplanationButton.addEventListener('click', () => {
        const phase = gameContent.phases[currentPhase];
        explanationText.textContent = phase.explanation;
        explanationText.classList.remove('hidden');
        // Esconde os outros botões para focar na explicação
        retryPhaseButton.classList.add('hidden');
        showExplanationButton.classList.add('hidden');
        continueGameButton.classList.remove('hidden'); // Permite continuar após ver a explicação
        feedbackMessage.textContent = "Aqui está uma dica para te ajudar:"; // Mensagem para a explicação
    });

    continueGameButton.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
        // Verifica se a fase atual é de interpretação e se já foi corrigida para exibir os resultados finais
        if (gameContent.phases[currentPhase].type === 'comprehension' && explanationText.classList.contains('hidden') === false) {
             // Se a explicação da fase de interpretação foi mostrada e a criança clica em continuar,
             // considera que ela concluiu a tentativa de interpretação e segue para os resultados finais.
             const comprehensionPhase = gameContent.phases[gameContent.phases.length - 1];
             let correctAnswers = 0;
             if (lastCorrectStatus.q1) correctAnswers++;
             if (lastCorrectStatus.q2) correctAnswers++;
             showFinalResults(correctAnswers);

        } else if (gameContent.phases[currentPhase].type === 'comprehension' && explanationText.classList.contains('hidden') === true) {
            // Se estava no modal de feedback da compreensão (com erro), mas não pediu explicação,
            // e clica em continuar, significa que não quer refazer, então avança para os resultados
            const comprehensionPhase = gameContent.phases[gameContent.phases.length - 1];
            let correctAnswers = 0;
            if (lastCorrectStatus.q1) correctAnswers++;
            if (lastCorrectStatus.q2) correctAnswers++;
            showFinalResults(correctAnswers);

        } else {
            // Se for fase de leitura ou se o feedback não era de erro (apenas informativo), avança normalmente
            goToNextPhase();
        }
    });


    restartButton.addEventListener('click', restartGame);

    // --- Inicialização ---
    // Carregar o conteúdo salvo quando a página é carregada
    loadContent();
    // Exibir a tela de administração por padrão
    showAdminScreen();
});



