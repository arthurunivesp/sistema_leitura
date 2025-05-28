document.addEventListener('DOMContentLoaded', () => {
    // --- Referências para todas as seções e elementos do DOM ---
    const instructionsSection = document.getElementById('instructions');
    const gameplaySection = document.getElementById('gameplay');
    const comprehensionSection = document.getElementById('comprehension');
    const creativeWritingSection = document.getElementById('creativeWriting');
    const resultsSection = document.getElementById('results');
    const adminSection = document.getElementById('adminSection');
    const nameInputSection = document.getElementById('nameInputSection');

    const startButton = document.getElementById('startButton');
    const timerDisplay = document.getElementById('timer');
    const readingContent = document.getElementById('readingContent');
    const finishReadingButton = document.getElementById('finishReadingButton');
    const comprehensionTextDiv = document.getElementById('comprehensionText');
    const questionsContainerDiv = document.getElementById('questionsContainer');
    const submitAnswersButton = document.getElementById('submitAnswersButton');
    const totalTimePara = document.getElementById('totalTime');
    const comprehensionResultPara = document.getElementById('comprehensionResult');
    const restartButton = document.getElementById('restartButton');
    const starRatingDiv = document.getElementById('starRating');

    const comprehensionFeedbackDiv = document.getElementById('comprehensionFeedback');

    const phase1ContentInput = document.getElementById('phase1Content');
    const phase1ExplanationTextarea = document.getElementById('phase1Explanation');
    const phase2ContentInput = document.getElementById('phase2Content');
    const phase2ExplanationTextarea = document.getElementById('phase2Explanation');
    const phase3ContentTextarea = document.getElementById('phase3Content');
    const phase3ExplanationTextarea = document.getElementById('phase3Explanation');
    const phase4ContentTextarea = document.getElementById('phase4Content');
    const phase4ExplanationTextarea = document.getElementById('phase4Explanation');
    const comprehensionMainTextarea = document.getElementById('comprehensionMainText');
    const comprehensionExplanationTextarea = document.getElementById('comprehensionExplanation');

    const fableBaseTextarea = document.getElementById('fableBaseText');
    const fableExplanationTextarea = document.getElementById('fableExplanation');
    const minWritingLinesInput = document.getElementById('minWritingLines');

    const saveContentButton = document.getElementById('saveContentButton');
    const saveMessage = document.getElementById('saveMessage');
    const startPlayForStudentButton = document.getElementById('startPlayForStudentButton');
    const goToAdminButton = document.getElementById('goToAdminButton');

    const phase1TimeLimitInput = document.getElementById('phase1TimeLimit');
    const phase2TimeLimitInput = document.getElementById('phase2TimeLimit');
    const phase3TimeLimitInput = document.getElementById('phase3TimeLimit');
    const phase4TimeLimitInput = document.getElementById('phase4TimeLimit');

    const adminQuestionsContainer = document.getElementById('adminQuestionsContainer');
    const addQuestionButton = document.getElementById('addQuestionButton');

    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const explanationText = document.getElementById('explanationText');
    const retryPhaseButton = document.getElementById('retryPhaseButton');
    const showExplanationButton = document.getElementById('showExplanationButton');
    const continueGameButton = document.getElementById('continueGameButton');
    const closeFeedbackModalButton = document.getElementById('closeFeedbackModalButton');
    const closeFinalResultsModalButton = document.getElementById('closeFinalResultsModalButton');
    const modalIcon = document.getElementById('modalIcon');
    const finalMotivationMessagePara = document.getElementById('finalMotivationMessage');

    const timerBeep = document.getElementById('timerBeep');

    const studentNameInput = document.getElementById('studentNameInput');
    const submitNameButton = document.getElementById('submitNameButton');
    const studentNameDisplay = document.getElementById('studentNameDisplay');

    const baseFableContentDiv = document.getElementById('baseFableContent');
    const studentWritingArea = document.getElementById('studentWritingArea');
    const lineCountDisplay = document.getElementById('lineCountDisplay');
    const submitWritingButton = document.getElementById('submitWritingButton');

    const rocketAnimationContainer = document.getElementById('rocketAnimationContainer');
    const animatedMessage = document.getElementById('animatedMessage');
    const starsContainer = document.getElementById('stars-container');

    // --- Variáveis de Estado do Jogo ---
    let currentPhase = 0;
    let timerInterval;
    let startTime;
    let readingTimes = [];
    let studentName = '';
    let lastComprehensionAnswers = [];
    let lastComprehensionCorrectStatus = [];
    let studentFableText = '';

    const TIME_THRESHOLD_PER_CHAR = 1.0;
    const TIME_THRESHOLD_PER_WORD = 2.0;

    let gameContent = {
        phases: [
            {
                type: 'reading',
                content: "gato",
                instruction: "",
                explanation: "Esta fase é para praticar a leitura de palavras curtas. Tente identificar todas as letras para ler a palavra.",
                buttonText: "Terminei de Ler!",
                timeLimit: null
            },
            {
                type: 'reading',
                content: "Casa azul grande",
                instruction: "",
                explanation: "Aqui, você pratica a leitura de pequenas frases. Tente ler as palavras em sequência, sem interrupções.",
                buttonText: "Terminei de Ler!",
                timeLimit: null
            },
            {
                type: 'reading',
                content: "O sol brilha no céu. Os pássaros cantam alegremente pela manhã.",
                instruction: "",
                explanation: "Nesta fase, o objetivo é ler um texto curto de forma fluida. Preste atenção à pontuação.",
                buttonText: "Terminei de Ler!",
                timeLimit: null
            },
            {
                type: 'reading',
                content: "A borboleta colorida voava entre as flores do jardim, procurando por néctar doce. Ela tinha asas com tons de azul e amarelo, muito bonitas.",
                instruction: "",
                explanation: "Este texto é um pouco mais longo. Tente manter a velocidade de leitura e a compreensão do que está acontecendo na história.",
                buttonText: "Terminei de Ler!",
                timeLimit: null
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
                    },
                    {
                        question: "Onde a coruja passava suas noites?",
                        correctAnswer: "na biblioteca da floresta"
                    },
                    {
                        question: "Sobre o que ela aprendia na biblioteca?",
                        correctAnswer: "sobre estrelas e rios"
                    }
                ]
            },
            {
                type: 'creativeWriting',
                baseFable: "Era uma vez em uma floresta mágica, vivia um coelho muito esperto chamado Saltitante. Ele adorava cenouras e passava o dia explorando. Um dia, Saltitante encontrou uma porta secreta escondida entre as árvores...",
                explanation: "Agora é sua vez de ser um escritor! Leia a fábula e continue a história, inventando o que acontece depois. Use sua imaginação e crie um final divertido e original!",
                minLines: 20
            }
        ]
    };

    let adminQuestionCounter = gameContent.phases[gameContent.phases.length - 2].questions.length + 1;

    // --- Funções de Salvar/Carregar Conteúdo ---
    function loadContent() {
        const savedContent = localStorage.getItem('gameReadingContent');
        if (savedContent) {
            try {
                const parsedContent = JSON.parse(savedContent);
                if (parsedContent.phases && parsedContent.phases.length >= 6 &&
                    parsedContent.phases[4] && parsedContent.phases[4].type === 'comprehension' && parsedContent.phases[4].questions &&
                    parsedContent.phases[5] && parsedContent.phases[5].type === 'creativeWriting') {
                    gameContent = parsedContent;

                    phase1ContentInput.value = gameContent.phases[0].content;
                    phase1ExplanationTextarea.value = gameContent.phases[0].explanation;
                    phase2ContentInput.value = gameContent.phases[1].content;
                    phase2ExplanationTextarea.value = gameContent.phases[1].explanation;
                    phase3ContentTextarea.value = gameContent.phases[2].content;
                    phase3ExplanationTextarea.value = gameContent.phases[2].explanation;
                    phase4ContentTextarea.value = gameContent.phases[3].content;
                    phase4ExplanationTextarea.value = gameContent.phases[3].explanation;
                    comprehensionMainTextarea.value = gameContent.phases[4].content;
                    comprehensionExplanationTextarea.value = gameContent.phases[4].explanation;

                    phase1TimeLimitInput.value = gameContent.phases[0].timeLimit !== null ? gameContent.phases[0].timeLimit : '';
                    phase2TimeLimitInput.value = gameContent.phases[1].timeLimit !== null ? gameContent.phases[1].timeLimit : '';
                    phase3TimeLimitInput.value = gameContent.phases[2].timeLimit !== null ? gameContent.phases[2].timeLimit : '';
                    phase4TimeLimitInput.value = gameContent.phases[3].timeLimit !== null ? gameContent.phases[3].timeLimit : '';

                    adminQuestionsContainer.innerHTML = '';
                    gameContent.phases[4].questions.forEach((q, index) => {
                        const questionBlock = document.createElement('div');
                        questionBlock.classList.add('admin-phase-editor');
                        const questionNum = index + 1;
                        questionBlock.innerHTML = `
                            <label for="question${questionNum}Admin">Pergunta ${questionNum}:</label>
                            <input type="text" id="question${questionNum}Admin" data-question-index="${index}" value="${q.question}">
                            <label for="answer${questionNum}Admin">Resposta ${questionNum} (exata):</label>
                            <input type="text" id="answer${questionNum}Admin" data-answer-index="${index}" value="${q.correctAnswer}">
                            <button type="button" class="remove-question-btn btn-small" data-index="${index}">Remover</button>
                        `;
                        adminQuestionsContainer.appendChild(questionBlock);

                        questionBlock.querySelector('.remove-question-btn').addEventListener('click', (event) => {
                            const btnIndex = parseInt(event.target.dataset.index);
                            gameContent.phases[4].questions.splice(btnIndex, 1);
                            saveContent();
                            loadContent();
                        });
                    });
                    adminQuestionCounter = gameContent.phases[4].questions.length + 1;

                    fableBaseTextarea.value = gameContent.phases[5].baseFable;
                    fableExplanationTextarea.value = gameContent.phases[5].explanation;
                    minWritingLinesInput.value = gameContent.phases[5].minLines;
                } else {
                    console.warn("Conteúdo salvo no localStorage tem formato inválido ou incompleto. Usando conteúdo padrão.");
                }
            } catch (e) {
                console.error("Erro ao fazer parse do conteúdo salvo no localStorage:", e);
            }
        }
    }

    function saveContent() {
        gameContent.phases[0].content = phase1ContentInput.value.trim();
        gameContent.phases[0].explanation = phase1ExplanationTextarea.value.trim();
        gameContent.phases[0].timeLimit = parseInt(phase1TimeLimitInput.value) || null;

        gameContent.phases[1].content = phase2ContentInput.value.trim();
        gameContent.phases[1].explanation = phase2ExplanationTextarea.value.trim();
        gameContent.phases[1].timeLimit = parseInt(phase2TimeLimitInput.value) || null;

        gameContent.phases[2].content = phase3ContentTextarea.value.trim();
        gameContent.phases[2].explanation = phase3ExplanationTextarea.value.trim();
        gameContent.phases[2].timeLimit = parseInt(phase3TimeLimitInput.value) || null;

        gameContent.phases[3].content = phase4ContentTextarea.value.trim();
        gameContent.phases[3].explanation = phase4ExplanationTextarea.value.trim();
        gameContent.phases[3].timeLimit = parseInt(phase4TimeLimitInput.value) || null;

        gameContent.phases[4].content = comprehensionMainTextarea.value.trim();
        gameContent.phases[4].explanation = comprehensionExplanationTextarea.value.trim();
        gameContent.phases[4].questions = [];
        const questionInputs = adminQuestionsContainer.querySelectorAll('[id^="question"][id$="Admin"]');
        const answerInputs = adminQuestionsContainer.querySelectorAll('[id^="answer"][id$="Admin"]');

        questionInputs.forEach((qInput, index) => {
            const aInput = answerInputs[index];
            if (qInput && aInput && qInput.value.trim() !== "" && aInput.value.trim() !== "") {
                gameContent.phases[4].questions.push({
                    question: qInput.value.trim(),
                    correctAnswer: aInput.value.trim().toLowerCase()
                });
            }
        });

        gameContent.phases[5].baseFable = fableBaseTextarea.value.trim();
        gameContent.phases[5].explanation = fableExplanationTextarea.value.trim();
        gameContent.phases[5].minLines = parseInt(minWritingLinesInput.value) || 20;

        localStorage.setItem('gameReadingContent', JSON.stringify(gameContent));
        saveMessage.textContent = 'Conteúdo salvo com sucesso!';
        setTimeout(() => {
            saveMessage.textContent = '';
        }, 3000);
    }

    function addQuestionField() {
        const newQuestionIndex = adminQuestionCounter++;

        const questionBlock = document.createElement('div');
        questionBlock.classList.add('admin-phase-editor');
        questionBlock.innerHTML = `
            <label for="question${newQuestionIndex}Admin">Pergunta ${newQuestionIndex}:</label>
            <input type="text" id="question${newQuestionIndex}Admin" data-question-index="${newQuestionIndex - 1}" value="">
            <label for="answer${newQuestionIndex}Admin">Resposta ${newQuestionIndex} (exata):</label>
            <input type="text" id="answer${newQuestionIndex}Admin" data-answer-index="${newQuestionIndex - 1}" value="">
            <button type="button" class="remove-question-btn btn-small" data-index="${newQuestionIndex - 1}">Remover</button>
        `;
        adminQuestionsContainer.appendChild(questionBlock);

        questionBlock.querySelector('.remove-question-btn').addEventListener('click', (event) => {
            const questionText = event.target.parentNode.querySelector('[id^="question"]').value.trim();
            const phaseQuestions = gameContent.phases[4].questions;
            const indexToRemove = phaseQuestions.findIndex(q => q.question === questionText);

            if (indexToRemove !== -1) {
                gameContent.phases[4].questions.splice(indexToRemove, 1);
                saveContent();
                loadContent();
            }
        });
    }

    // --- Funções do Timer ---
    let lastSecondPlayedBeep = -1;
    function startTimer() {
        startTime = Date.now();
        lastSecondPlayedBeep = -1;
        timerInterval = setInterval(updateTimer, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        return duration;
    }

    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

        const phase = gameContent.phases[currentPhase];
        let threshold;

        if (phase && phase.timeLimit !== null && !isNaN(phase.timeLimit)) {
            threshold = phase.timeLimit;
        } else if (phase && phase.content) {
            const words = phase.content.split(/\s+/).filter(word => word.length > 0);
            if (words.length <= 1) {
                threshold = phase.content.length * TIME_THRESHOLD_PER_CHAR;
            } else {
                threshold = words.length * TIME_THRESHOLD_PER_WORD;
            }
        } else {
            threshold = 10;
        }

        if (
            threshold - seconds <= 5 &&
            threshold - seconds > 0 &&
            seconds !== lastSecondPlayedBeep &&
            timerBeep &&
            timerBeep.src
        ) {
            timerBeep.currentTime = 0;
            timerBeep.play().catch(e => console.warn("Erro ao tocar beep:", e));
            lastSecondPlayedBeep = seconds;
        }
    }

    // --- Funções de Interface ---
    function hideAllSections() {
        const sections = [
            nameInputSection,
            instructionsSection,
            gameplaySection,
            comprehensionSection,
            creativeWritingSection,
            resultsSection,
            adminSection
        ];
        sections.forEach(section => section.classList.add('hidden'));
        feedbackModal.classList.add('hidden');
    }

    function showFeedbackModal(message, showRetry, showExplanation, showContinue, showIconSuccess) {
        feedbackModal.classList.remove('hidden');
        feedbackMessage.textContent = message;
        feedbackMessage.classList.remove('hidden');
        retryPhaseButton.classList.toggle('hidden', !showRetry);
        showExplanationButton.classList.toggle('hidden', !showExplanation);
        continueGameButton.classList.toggle('hidden', !showContinue);
        closeFeedbackModalButton.classList.toggle('hidden', showRetry || showExplanation || showContinue);
        explanationText.classList.add('hidden');
        closeFinalResultsModalButton.classList.add('hidden');
        finalMotivationMessagePara.classList.add('hidden');
        modalIcon.classList.toggle('hidden', !showIconSuccess);
        modalIcon.textContent = showIconSuccess ? '🎉' : '';
        modalIcon.classList.toggle('success-icon', showIconSuccess);
        rocketAnimationContainer.classList.add('hidden');
        animatedMessage.classList.add('hidden');
    }

    // --- Lógica das Fases do Jogo ---
    function showPhase(phaseIndex) {
        hideAllSections();

        if (phaseIndex >= gameContent.phases.length || !gameContent.phases[phaseIndex]) {
            console.error("Tentativa de exibir uma fase que não existe:", phaseIndex);
            showFinalResults(0);
            return;
        }

        const phase = gameContent.phases[phaseIndex];

        if (phase.type === 'reading') {
            gameplaySection.classList.remove('hidden');
            readingContent.innerHTML = `<p class="content-to-read">${phase.content}</p>`;
            timerDisplay.textContent = '00:00';
            finishReadingButton.classList.remove('hidden');
            startTimer();
        } else if (phase.type === 'comprehension') {
            displayComprehensionPhase();
        } else if (phase.type === 'creativeWriting') {
            displayCreativeWritingPhase();
        }
    }

    function handleFinishReading() {
        const timeTaken = stopTimer();
        const phase = gameContent.phases[currentPhase];

        let threshold;
        if (phase && phase.timeLimit !== null && !isNaN(phase.timeLimit)) {
            threshold = phase.timeLimit;
        } else if (phase && phase.content) {
            const words = phase.content.split(/\s+/).filter(word => word.length > 0);
            if (words.length <= 1) {
                threshold = phase.content.length * TIME_THRESHOLD_PER_CHAR;
            } else {
                threshold = words.length * TIME_THRESHOLD_PER_WORD;
            }
        } else {
            threshold = 10;
        }

        if (readingTimes.length > currentPhase) {
            readingTimes[currentPhase] = timeTaken;
        } else {
            readingTimes.push(timeTaken);
        }

        if (timeTaken > threshold) {
            showFeedbackModal(
                `Parece que você levou um pouco mais de tempo nesta fase (${timeTaken.toFixed(1)}s). O tempo ideal seria de ${threshold.toFixed(1)}s. Que tal tentar novamente para praticar mais um pouco?`,
                true,
                true,
                false,
                false
            );
        } else {
            showFeedbackModal(
                `Muito bem! Você leu esta fase em ${timeTaken.toFixed(1)} segundos. Continue assim!`,
                false,
                false,
                true,
                true
            );
        }
    }

    function displayComprehensionPhase() {
        hideAllSections();
        comprehensionSection.classList.remove('hidden');

        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 2];

        if (!comprehensionPhase || !comprehensionPhase.questions) {
            console.error("Fase de compreensão ou suas perguntas não estão definidas.");
            showFinalResults(0);
            return;
        }

        comprehensionTextDiv.textContent = comprehensionPhase.content;
        questionsContainerDiv.innerHTML = '';

        comprehensionPhase.questions.forEach((q, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.classList.add('question-block');
            questionBlock.innerHTML = `
                <p id="question${index + 1}">${q.question}</p>
                <input type="text" id="answer${index + 1}" placeholder="Sua resposta">
            `;
            questionsContainerDiv.appendChild(questionBlock);
        });
        submitAnswersButton.classList.remove('hidden');
    }

    function calculateResults() {
        let correctAnswersCount = 0;
        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 2];

        if (!comprehensionPhase || !comprehensionPhase.questions) {
            console.error("Fase de compreensão ou suas perguntas não estão definidas ao calcular resultados.");
            showFinalResults(0);
            return;
        }

        lastComprehensionAnswers = [];
        lastComprehensionCorrectStatus = [];

        comprehensionPhase.questions.forEach((q, index) => {
            const userAnswerInput = document.getElementById(`answer${index + 1}`);
            const userAnswer = userAnswerInput ? userAnswerInput.value.trim() : '';
            const correctAnswer = q.correctAnswer;

            const isCorrect = (userAnswer.toLowerCase() === correctAnswer.toLowerCase());

            lastComprehensionAnswers.push(userAnswer);
            lastComprehensionCorrectStatus.push(isCorrect);

            if (isCorrect) {
                correctAnswersCount++;
            }
        });

        if (correctAnswersCount === comprehensionPhase.questions.length && comprehensionPhase.questions.length > 0) {
            showFeedbackModal(
                `Fantástico! Você acertou todas as perguntas de interpretação! Agora, para o próximo desafio.`,
                false,
                false,
                true,
                true
            );
        } else {
            showFeedbackModal(
                `Você acertou ${correctAnswersCount} de ${comprehensionPhase.questions.length} perguntas. Que tal rever o texto e tentar de novo para melhorar sua compreensão?`,
                true,
                true,
                false,
                true
            );
        }
    }

    function displayCreativeWritingPhase() {
        hideAllSections();
        creativeWritingSection.classList.remove('hidden');

        const creativeWritingPhase = gameContent.phases[gameContent.phases.length - 1];
        baseFableContentDiv.textContent = creativeWritingPhase.baseFable;
        studentWritingArea.value = studentFableText;
        updateLineCount();
    }

    function updateLineCount() {
        const text = studentWritingArea.value;
        const lines = text.split('\n').filter(line => line.trim() !== '').length;

        const minLines = gameContent.phases[gameContent.phases.length - 1].minLines;
        lineCountDisplay.textContent = `Linhas: ${lines}/${minLines}`;
        lineCountDisplay.style.color = lines >= minLines ? 'green' : 'red';
    }

    function handleSubmitWriting() {
        studentFableText = studentWritingArea.value.trim();
        const lines = studentFableText.split('\n').filter(line => line.trim() !== '').length;
        const minLines = gameContent.phases[gameContent.phases.length - 1].minLines;

        if (lines >= minLines) {
            startCelebration();
        } else {
            showFeedbackModal(
                `Ops! Você precisa escrever pelo menos ${minLines} linhas para completar este desafio. Continue sua história!`,
                true,
                false,
                false,
                false
            );
        }
    }

    function startCelebration() {
        hideAllSections();
        feedbackModal.classList.remove('hidden');
        feedbackModal.querySelector('.modal-content').classList.add('festive');

        // Hide all modal elements
        feedbackMessage.classList.add('hidden');
        explanationText.classList.add('hidden');
        retryPhaseButton.classList.add('hidden');
        showExplanationButton.classList.add('hidden');
        continueGameButton.classList.add('hidden');
        closeFeedbackModalButton.classList.add('hidden');
        closeFinalResultsModalButton.classList.add('hidden');
        animatedMessage.classList.add('hidden');

        // Show motivational message and icon
        const correctAnswers = lastComprehensionCorrectStatus.filter(status => status).length;
        const totalTime = readingTimes.reduce((sum, time) => sum + time, 0);
        displayFinalMotivationMessage(totalTime, correctAnswers);
        finalMotivationMessagePara.classList.remove('hidden');
        finalMotivationMessagePara.classList.add('celebration');
        modalIcon.classList.remove('hidden');
        modalIcon.textContent = '🎉';
        modalIcon.classList.add('success-icon');

        // Start rocket animation
        playRocketAnimation();

        // Start confetti
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti({
            emojis: ['🎉', '⭐', '🚀', '✨'],
            confettiRadius: 6,
            confettiNumber: 100,
        });

        // Start falling stars
        createFallingStars();

        // Transition to results after 8 seconds
        setTimeout(() => {
            feedbackModal.classList.add('hidden');
            feedbackModal.querySelector('.modal-content').classList.remove('festive');
            starsContainer.innerHTML = ''; // Clear stars
            showFinalResults(correctAnswers);
        }, 8000);
    }

    function createFallingStars() {
        starsContainer.innerHTML = '';
        const emojis = ['⭐', '✨', '🎉'];
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            starsContainer.appendChild(star);
        }
    }

    function playRocketAnimation() {
        rocketAnimationContainer.classList.remove('hidden');
        rocketAnimationContainer.style.animation = 'none';
        void rocketAnimationContainer.offsetWidth; // Trigger reflow
        rocketAnimationContainer.style.animation = 'flyRocket 8s forwards ease-in-out';
    }

    function showFinalResults(correctAnswers) {
        hideAllSections();
        resultsSection.classList.remove('hidden');

        rocketAnimationContainer.classList.add('hidden');
        animatedMessage.classList.add('hidden');

        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 2];

        if (!comprehensionPhase || !comprehensionPhase.questions) {
            console.error("Fase de compreensão ou suas perguntas não estão definidas ao exibir resultados finais.");
            totalTimePara.textContent = `Tempo total de leitura (Fases 1-${gameContent.phases.length - 2}): N/A`;
            comprehensionResultPara.textContent = `Resultado da interpretação: N/A (erro na fase de perguntas)`;
            displayStars(0, 0);
            displayFinalMotivationMessage(0, 0);
            showFinalMessageModal();
            return;
        }

        const totalReadingDuration = readingTimes.reduce((sum, time, index) => {
            if (gameContent.phases[index] && gameContent.phases[index].type === 'reading') {
                return sum + time;
            }
            return sum;
        }, 0);

        const minutes = Math.floor(totalReadingDuration / 60);
        const seconds = Math.floor(totalReadingDuration % 60);
        totalTimePara.textContent = `Tempo total de leitura (Fases 1-${gameContent.phases.length - 2}): ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        comprehensionResultPara.textContent = `Você acertou ${correctAnswers} de ${comprehensionPhase.questions.length} perguntas de interpretação.`;

        displayStars(totalReadingDuration, correctAnswers);
        displayFinalMotivationMessage(totalReadingDuration, correctAnswers);

        comprehensionFeedbackDiv.classList.remove('hidden');
        comprehensionFeedbackDiv.innerHTML = '<h3>Respostas de Interpretação:</h3>';

        comprehensionPhase.questions.forEach((q, index) => {
            const feedbackParagraph = document.createElement('p');
            let feedbackText = `<strong>Pergunta ${index + 1}:</strong> ${q.question}<br>`;
            const isCorrect = lastComprehensionCorrectStatus[index] !== undefined ? lastComprehensionCorrectStatus[index] : false;
            const userAnswer = lastComprehensionAnswers[index] !== undefined ? lastComprehensionAnswers[index] : '';

            if (isCorrect) {
                feedbackText += `Sua resposta: "${userAnswer}" - <span class="correct">Correta!</span>`;
                feedbackParagraph.className = 'feedback-item correct';
            } else {
                feedbackText += `Sua resposta: "${userAnswer}" - <span class="incorrect">Incorreta.</span> A resposta correta era: "${q.correctAnswer}"`;
                feedbackParagraph.className = 'feedback-item incorrect';
            }
            feedbackParagraph.innerHTML = feedbackText;
            comprehensionFeedbackDiv.appendChild(feedbackParagraph);
        });

        const writingPhase = gameContent.phases[gameContent.phases.length - 1];
        if (writingPhase && studentFableText) {
            const existingFableFeedback = document.querySelector('.feedback-details.fable-feedback');
            if (existingFableFeedback) {
                existingFableFeedback.remove();
            }

            const fableFeedbackDiv = document.createElement('div');
            fableFeedbackDiv.classList.add('feedback-details', 'fable-feedback');
            fableFeedbackDiv.innerHTML = '<h3>Sua Fábula Criativa:</h3>';
            const fableParagraph = document.createElement('p');
            fableParagraph.innerHTML = `"${studentFableText.replace(/\n/g, '<br>')}"`;
            fableParagraph.style.whiteSpace = 'pre-wrap';
            fableFeedbackDiv.appendChild(fableParagraph);
            comprehensionFeedbackDiv.parentNode.insertBefore(fableFeedbackDiv, comprehensionFeedbackDiv.nextSibling);
        }

        showFinalMessageModal();
    }

    function displayStars(totalTime, correctAnswers) {
        let numStars = 0;
        let totalIdealReadingTime = 0;

        gameContent.phases.forEach((phase) => {
            if (phase && phase.type === 'reading') {
                if (phase.timeLimit !== null && !isNaN(phase.timeLimit)) {
                    totalIdealReadingTime += phase.timeLimit;
                } else if (phase.content) {
                    const words = phase.content.split(/\s+/).filter(word => word.length > 0);
                    if (words.length <= 1) {
                        totalIdealReadingTime += phase.content.length * TIME_THRESHOLD_PER_CHAR;
                    } else {
                        totalIdealReadingTime += words.length * TIME_THRESHOLD_PER_WORD;
                    }
                }
            }
        });

        if (totalIdealReadingTime > 0) {
            if (totalTime <= totalIdealReadingTime * 1.0) {
                numStars += 3;
            } else if (totalTime <= totalIdealReadingTime * 1.5) {
                numStars += 2;
            } else if (totalTime <= totalIdealReadingTime * 2.0) {
                numStars += 1;
            }
        }

        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 2];
        const totalComprehensionQuestions = comprehensionPhase && comprehensionPhase.questions ? comprehensionPhase.questions.length : 0;

        if (totalComprehensionQuestions > 0) {
            const percentageCorrect = correctAnswers / totalComprehensionQuestions;
            if (percentageCorrect >= 1) {
                numStars += 2;
            } else if (percentageCorrect >= 0.5) {
                numStars += 1;
            }
        }

        const creativeWritingPhase = gameContent.phases[gameContent.phases.length - 1];
        if (creativeWritingPhase && studentFableText) {
            const lines = studentFableText.split('\n').filter(line => line.trim() !== '').length;
            if (lines >= creativeWritingPhase.minLines) {
                numStars += 1;
            }
        }

        numStars = Math.min(numStars, 5);

        let starsHtml = '';
        for (let i = 0; i < Math.floor(numStars); i++) {
            starsHtml += '⭐';
        }
        starRatingDiv.textContent = starsHtml || 'Continue praticando para ganhar estrelas!';
    }

    function displayFinalMotivationMessage(totalTime, correctAnswers) {
        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 2];
        const totalQuestions = comprehensionPhase && comprehensionPhase.questions ? comprehensionPhase.questions.length : 0;
        let message = '';
        let isSuccess = false;

        if (!comprehensionPhase || totalQuestions === 0) {
            message = `${studentName}, você completou o jogo, mas parece que houve um problema com a fase de perguntas. Continue praticando!`;
        } else if (correctAnswers === totalQuestions && totalTime <= 120) {
            message = `${studentName}, você foi incrível! Acertou todas as perguntas e leu super rápido! Continue brilhando! 🌟`;
            isSuccess = true;
        } else if (correctAnswers >= totalQuestions * 0.5) {
            message = `${studentName}, parabéns! Você acertou ${correctAnswers} de ${totalQuestions} perguntas e está melhorando sua leitura. Continue assim! 🚀`;
            isSuccess = true;
        } else {
            message = `${studentName}, você terminou o jogo! Acertou ${correctAnswers} de ${totalQuestions} perguntas. Que tal praticar mais para melhorar? 💪`;
        }

        finalMotivationMessagePara.textContent = message;
        finalMotivationMessagePara.classList.toggle('success', isSuccess);
        finalMotivationMessagePara.classList.toggle('motivation', !isSuccess);
    }

    function showFinalMessageModal() {
        feedbackModal.classList.remove('hidden');
        feedbackMessage.classList.add('hidden');
        explanationText.classList.add('hidden');
        retryPhaseButton.classList.add('hidden');
        showExplanationButton.classList.add('hidden');
        continueGameButton.classList.add('hidden');
        closeFeedbackModalButton.classList.add('hidden');
        closeFinalResultsModalButton.classList.remove('hidden');
        finalMotivationMessagePara.classList.remove('hidden');
        modalIcon.classList.remove('hidden');
        modalIcon.textContent = '🏆';
        modalIcon.classList.add('motivation-icon');
        rocketAnimationContainer.classList.add('hidden');
        animatedMessage.classList.add('hidden');
    }

    // --- Event Listeners ---
    submitNameButton.addEventListener('click', () => {
        studentName = studentNameInput.value.trim();
        if (studentName) {
            studentNameDisplay.textContent = `Olá, ${studentName}!`;
            hideAllSections();
            instructionsSection.classList.remove('hidden');
        } else {
            alert('Por favor, digite seu nome.');
        }
    });

    startButton.addEventListener('click', () => {
        currentPhase = 0;
        readingTimes = [];
        studentFableText = '';
        showPhase(currentPhase);
    });

    finishReadingButton.addEventListener('click', handleFinishReading);

    submitAnswersButton.addEventListener('click', calculateResults);

    retryPhaseButton.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
        if (gameContent.phases[currentPhase].type === 'comprehension') {
            displayComprehensionPhase();
        } else {
            showPhase(currentPhase);
        }
    });

    showExplanationButton.addEventListener('click', () => {
        explanationText.textContent = gameContent.phases[currentPhase].explanation;
        explanationText.classList.remove('hidden');
        showExplanationButton.classList.add('hidden');
    });

    continueGameButton.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
        currentPhase++;
        showPhase(currentPhase);
    });

    closeFeedbackModalButton.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
    });

    closeFinalResultsModalButton.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
    });

    restartButton.addEventListener('click', () => {
        hideAllSections();
        nameInputSection.classList.remove('hidden');
        studentNameInput.value = '';
        studentName = '';
        currentPhase = 0;
        readingTimes = [];
        lastComprehensionAnswers = [];
        lastComprehensionCorrectStatus = [];
        studentFableText = '';
    });

    goToAdminButton.addEventListener('click', () => {
        hideAllSections();
        adminSection.classList.remove('hidden');
        loadContent();
    });

    saveContentButton.addEventListener('click', saveContent);

    startPlayForStudentButton.addEventListener('click', () => {
        hideAllSections();
        nameInputSection.classList.remove('hidden');
        studentNameInput.value = '';
        studentName = '';
        currentPhase = 0;
        readingTimes = [];
        lastComprehensionAnswers = [];
        lastComprehensionCorrectStatus = [];
        studentFableText = '';
    });

    addQuestionButton.addEventListener('click', addQuestionField);

    studentWritingArea.addEventListener('input', updateLineCount);

    submitWritingButton.addEventListener('click', handleSubmitWriting);

    // --- Inicialização ---
    loadContent();
    hideAllSections();
    nameInputSection.classList.remove('hidden');
});

