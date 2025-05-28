document.addEventListener('DOMContentLoaded', () => {
    // --- Referências para todas as seções e elementos do DOM ---
    const instructionsSection = document.getElementById('instructions');
    const gameplaySection = document.getElementById('gameplay');
    const comprehensionSection = document.getElementById('comprehension');
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
    const saveContentButton = document.getElementById('saveContentButton');
    const saveMessage = document.getElementById('saveMessage');
    const startPlayForStudentButton = document.getElementById('startPlayForStudentButton');
    const goToAdminButton = document.getElementById('goToAdminButton'); // Adicionado o botão para ir para admin

    // NOVOS ELEMENTOS PARA O TEMPO LIMITE DO PROFESSOR
    const phase1TimeLimitInput = document.getElementById('phase1TimeLimit');
    const phase2TimeLimitInput = document.getElementById('phase2TimeLimit');
    const phase3TimeLimitInput = document.getElementById('phase3TimeLimit');
    const phase4TimeLimitInput = document.getElementById('phase4TimeLimit');


    // Elementos para gerenciar perguntas no admin
    const adminQuestionsContainer = document.getElementById('adminQuestionsContainer');
    const addQuestionButton = document.getElementById('addQuestionButton');

    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const explanationText = document.getElementById('explanationText');
    const retryPhaseButton = document.getElementById('retryPhaseButton');
    const showExplanationButton = document.getElementById('showExplanationButton');
    const continueGameButton = document.getElementById('continueGameButton');
    const closeFinalResultsModalButton = document.getElementById('closeFinalResultsModalButton');
    const modalIcon = document.getElementById('modalIcon');
    const finalMotivationMessagePara = document.getElementById('finalMotivationMessage');

    const timerBeep = document.getElementById('timerBeep');

    // NOVOS ELEMENTOS PARA O NOME DO ALUNO
    const studentNameInput = document.getElementById('studentNameInput');
    const submitNameButton = document.getElementById('submitNameButton');
    const studentNameDisplay = document.getElementById('studentNameDisplay');

    // --- Variáveis de Estado do Jogo ---
    let currentPhase = 0;
    let timerInterval;
    let startTime;
    let readingTimes = [];
    let studentName = '';

    // TEMPOS LIMITES AJUSTADOS (permanecem os mesmos da última versão)
    // Estes serão usados como fallback se o professor não definir um tempo
    const TIME_THRESHOLD_PER_CHAR = 1.0;
    const TIME_THRESHOLD_PER_WORD = 2.0;

    let lastComprehensionAnswers = [];
    let lastComprehensionCorrectStatus = [];

    // --- Conteúdo do Jogo (Valores Padrão) ---
    // Adicionado 'timeLimit: null' para indicar que o professor pode definir
    let gameContent = {
        phases: [
            {
                type: 'reading',
                content: "gato",
                instruction: "",
                explanation: "Esta fase é para praticar a leitura de palavras curtas. Tente identificar todas as letras para ler a palavra.",
                buttonText: "Terminei de Ler!",
                timeLimit: null // Professor pode definir
            },
            {
                type: 'reading',
                content: "Casa azul grande",
                instruction: "",
                explanation: "Aqui, você pratica a leitura de pequenas frases. Tente ler as palavras em sequência, sem interrupções.",
                buttonText: "Terminei de Ler!",
                timeLimit: null // Professor pode definir
            },
            {
                type: 'reading',
                content: "O sol brilha no céu. Os pássaros cantam alegremente pela manhã.",
                instruction: "",
                explanation: "Nesta fase, o objetivo é ler um texto curto de forma fluida. Preste atenção à pontuação.",
                buttonText: "Terminei de Ler!",
                timeLimit: null // Professor pode definir
            },
            {
                type: 'reading',
                content: "A borboleta colorida voava entre as flores do jardim, procurando por néctar doce. Ela tinha asas com tons de azul e amarelo, muito bonitas.",
                instruction: "",
                explanation: "Este texto é um pouco mais longo. Tente manter a velocidade de leitura e a compreensão do que está acontecendo na história.",
                buttonText: "Terminei de Ler!",
                timeLimit: null // Professor pode definir
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
            }
        ]
    };

    let adminQuestionCounter = gameContent.phases[4].questions.length + 1;

    // --- Funções de Salvar/Carregar Conteúdo ---
    function loadContent() {
        const savedContent = localStorage.getItem('gameReadingContent');
        if (savedContent) {
            try {
                const parsedContent = JSON.parse(savedContent);
                // Validação mais robusta para o formato do conteúdo
                if (parsedContent.phases && parsedContent.phases.length === 5 &&
                    parsedContent.phases[4] && parsedContent.phases[4].questions && parsedContent.phases[4].questions.length >= 0) {
                    gameContent = parsedContent;

                    // Carrega conteúdo e explicação
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

                    // Carrega tempos limites definidos pelo professor
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
                        `;
                        adminQuestionsContainer.appendChild(questionBlock);
                    });
                    adminQuestionCounter = gameContent.phases[4].questions.length + 1;
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
        // Salva o tempo limite, se for um número válido
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
        // A fase de compreensão não tem timeLimit definido pelo professor, então não a alteramos

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
            <input type="text" id="question${newQuestionIndex}Admin" data-question-index="${newQuestionIndex -1}" value="">
            <label for="answer${newQuestionIndex}Admin">Resposta ${newQuestionIndex} (exata):</label>
            <input type="text" id="answer${newQuestionIndex}Admin" data-answer-index="${newQuestionIndex -1}" value="">
        `;
        adminQuestionsContainer.appendChild(questionBlock);
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

        // PRIORIZA O TEMPO DEFINIDO PELO PROFESSOR
        if (phase && phase.timeLimit !== null && !isNaN(phase.timeLimit)) {
            threshold = phase.timeLimit;
        } else if (phase && phase.content) { // Fallback para cálculo automático
            if (phase.content.split(' ').length <= 1) {
                threshold = phase.content.length * TIME_THRESHOLD_PER_CHAR;
            } else {
                threshold = phase.content.split(/\s+/).filter(word => word.length > 0).length * TIME_THRESHOLD_PER_WORD;
            }
        } else {
            // Caso a fase ou o conteúdo não existam (erro, mas para evitar travar)
            threshold = 10; // Valor padrão para evitar NaN
        }

        if (threshold - seconds <= 5 && threshold - seconds > 0 && seconds !== lastSecondPlayedBeep && timerBeep && timerBeep.canPlayType('audio/mpeg')) {
            timerBeep.currentTime = 0;
            timerBeep.play().catch(e => console.warn("Erro ao tocar beep: ", e)); // Adiciona catch para promessa
            lastSecondPlayedBeep = seconds;
        }
    }

    // --- Lógica das Fases de Leitura ---
    function showPhase(phaseIndex) {
        hideAllSections();
        gameplaySection.classList.remove('hidden');

        // Adiciona verificação para garantir que a fase existe
        if (phaseIndex >= gameContent.phases.length || !gameContent.phases[phaseIndex]) {
            console.error("Tentativa de exibir uma fase que não existe:", phaseIndex);
            // Redireciona para os resultados finais ou volta para o admin
            showFinalResults(0); // Passa 0 acertos ou um valor adequado para erro
            return;
        }

        const phase = gameContent.phases[phaseIndex];
        readingContent.innerHTML = `<p class="content-to-read">${phase.content}</p>`;
        timerDisplay.textContent = '00:00';

        finishReadingButton.classList.remove('hidden');

        startTimer();
    }

    function handleFinishReading() {
        const timeTaken = stopTimer();
        const phase = gameContent.phases[currentPhase];

        let threshold;
        // PRIORIZA O TEMPO DEFINIDO PELO PROFESSOR
        if (phase && phase.timeLimit !== null && !isNaN(phase.timeLimit)) {
            threshold = phase.timeLimit;
        } else if (phase && phase.content) { // Fallback para cálculo automático
            if (phase.content.split(' ').length <= 1) {
                threshold = phase.content.length * TIME_THRESHOLD_PER_CHAR;
            } else {
                threshold = phase.content.split(/\s+/).filter(word => word.length > 0).length * TIME_THRESHOLD_PER_WORD;
            }
        } else {
            threshold = 10; // Valor padrão para evitar NaN
        }

        if (readingTimes.length > currentPhase) {
            readingTimes[currentPhase] = timeTaken;
        } else {
            readingTimes.push(timeTaken);
        }

        if (timeTaken > threshold) {
            showFeedbackModal(
                `Parece que você levou um pouco mais de tempo nesta fase (${timeTaken.toFixed(1)}s). O tempo ideal seria de ${threshold.toFixed(1)}s. Que tal tentar novamente para praticar mais um pouco?`,
                true, // showRetry
                true, // showExplanation
                false, // showContinue
                false // isComprehensionPhase
            );
        } else {
            showFeedbackModal(
                `Muito bem! Você leu esta fase em ${timeTaken.toFixed(1)} segundos. Continue assim!`,
                false, // showRetry
                false, // showExplanation
                true, // showContinue
                false // isComprehensionPhase
            );
        }
    }

    // --- Lógica da Fase de Interpretação ---
    function displayComprehensionPhase() {
        hideAllSections();
        comprehensionSection.classList.remove('hidden');

        // Sempre referencie a fase de compreensão como a última fase
        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 1];

        if (!comprehensionPhase || !comprehensionPhase.questions) {
            console.error("Fase de compreensão ou suas perguntas não estão definidas.");
            showFinalResults(0); // Se a fase de compreensão não existe, vá para os resultados finais com 0 acertos
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
        // SEMPRE pegue a fase de compreensão como a ÚLTIMA no array
        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 1];

        if (!comprehensionPhase || !comprehensionPhase.questions) {
            console.error("Fase de compreensão ou suas perguntas não estão definidas ao calcular resultados.");
            showFinalResults(0); // Trata o erro e vai para o final
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

        // Se acertou todas, vai direto para os resultados finais
        if (correctAnswersCount === comprehensionPhase.questions.length && comprehensionPhase.questions.length > 0) {
            showFinalResults(correctAnswersCount);
        } else {
            // Caso contrário, mostra o modal de feedback de fase
            showFeedbackModal(
                `Você acertou ${correctAnswersCount} de ${comprehensionPhase.questions.length} perguntas. Que tal rever o texto e tentar de novo para melhorar sua compreensão?`,
                true, // showRetry
                true, // showExplanation
                false, // showContinue
                true // isComprehensionPhase
            );
        }
    }

    // --- Lógica dos Resultados Finais e Estrelas ---
    function showFinalResults(correctAnswers) {
        // SEMPRE pegue a fase de compreensão como a ÚLTIMA no array
        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 1];

        if (!comprehensionPhase || !comprehensionPhase.questions) {
            console.error("Fase de compreensão ou suas perguntas não estão definidas ao exibir resultados finais.");
            // Define valores padrão para evitar erros caso as perguntas não existam
            totalTimePara.textContent = `Tempo total de leitura (Fases 1-${gameContent.phases.length - 1}): N/A`;
            comprehensionResultPara.textContent = `Resultado da interpretação: N/A (erro na fase de perguntas)`;
            displayStars(0, 0); // Sem estrelas em caso de erro
            displayFinalMotivationMessage(0, 0); // Mensagem genérica de erro
            showFinalMessageModal(); // Tenta mostrar o modal mesmo com erro
            return;
        }

        const totalReadingDuration = readingTimes.slice(0, gameContent.phases.length - 1).reduce((sum, time) => sum + time, 0);
        const minutes = Math.floor(totalReadingDuration / 60);
        const seconds = Math.floor(totalReadingDuration % 60);
        totalTimePara.textContent = `Tempo total de leitura (Fases 1-${gameContent.phases.length - 1}): ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        comprehensionResultPara.textContent = `Você acertou ${correctAnswers} de ${comprehensionPhase.questions.length} perguntas de interpretação.`;

        displayStars(totalReadingDuration, correctAnswers);
        displayFinalMotivationMessage(totalReadingDuration, correctAnswers);

        // Preencher o feedback detalhado de compreensão (visível apenas após fechar o modal)
        comprehensionFeedbackDiv.classList.remove('hidden');
        comprehensionFeedbackDiv.innerHTML = '<h3>Respostas de Interpretação:</h3>';

        comprehensionPhase.questions.forEach((q, index) => {
            const feedbackParagraph = document.createElement('p');
            let feedbackText = `**Pergunta ${index + 1}:** ${q.question}<br>`;
            // Garante que lastComprehensionCorrectStatus e lastComprehensionAnswers têm o índice correto
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

        // Agora, mostramos o modal para a mensagem final
        showFinalMessageModal();
    }

    function displayStars(totalTime, correctAnswers) {
        let numStars = 0;
        let totalIdealReadingTime = 0;

        gameContent.phases.slice(0, gameContent.phases.length - 1).forEach(phase => {
            if (phase) { // Verifica se a fase existe
                // PRIORIZA O TEMPO DEFINIDO PELO PROFESSOR para o cálculo de estrelas
                if (phase.timeLimit !== null && !isNaN(phase.timeLimit)) {
                    totalIdealReadingTime += phase.timeLimit;
                } else if (phase.content) { // Fallback para cálculo automático
                    if (phase.content.split(' ').length <= 1) {
                        totalIdealReadingTime += phase.content.length * TIME_THRESHOLD_PER_CHAR;
                    } else {
                        totalIdealReadingTime += phase.content.split(/\s+/).filter(word => word.length > 0).length * TIME_THRESHOLD_PER_WORD;
                    }
                }
            }
        });

        if (totalTime <= totalIdealReadingTime * 1.0) {
            numStars += 3;
        } else if (totalTime <= totalIdealReadingTime * 1.5) {
            numStars += 2;
        } else if (totalTime <= totalIdealReadingTime * 2.0) {
            numStars += 1;
        }

        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 1];
        const totalComprehensionQuestions = comprehensionPhase && comprehensionPhase.questions ? comprehensionPhase.questions.length : 0; // Adiciona verificação

        if (totalComprehensionQuestions > 0) {
            const percentageCorrect = correctAnswers / totalComprehensionQuestions;
            if (percentageCorrect >= 1) {
                numStars += 2;
            } else if (percentageCorrect >= 0.5) {
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
        let message = '';
        let messageClass = '';
        let iconChar = ''; // Variável para o caractere do ícone

        const comprehensionPhase = gameContent.phases[gameContent.phases.length - 1];
        const totalComprehensionQuestions = comprehensionPhase && comprehensionPhase.questions ? comprehensionPhase.questions.length : 0; // Adiciona verificação
        const percentageCorrect = totalComprehensionQuestions > 0 ? (correctAnswers / totalComprehensionQuestions) : 0;

        let totalIdealReadingTime = 0;
        gameContent.phases.slice(0, gameContent.phases.length - 1).forEach(phase => {
            if (phase) { // Verifica se a fase existe
                // PRIORIZA O TEMPO DEFINIDO PELO PROFESSOR para o cálculo da mensagem motivacional
                if (phase.timeLimit !== null && !isNaN(phase.timeLimit)) {
                    totalIdealReadingTime += phase.timeLimit;
                } else if (phase.content) { // Fallback para cálculo automático
                    if (phase.content.split(' ').length <= 1) {
                        totalIdealReadingTime += phase.content.length * TIME_THRESHOLD_PER_CHAR;
                    } else {
                        totalIdealReadingTime += phase.content.split(/\s+/).filter(word => word.length > 0).length * TIME_THRESHOLD_PER_WORD;
                    }
                }
            }
        });

        const isGoodTime = totalTime <= totalIdealReadingTime * 1.2;
        const isGoodComprehension = percentageCorrect >= 0.8;

        if (isGoodTime && isGoodComprehension) {
            message = `Parabéns, ${studentName}! Você foi incrível! Sua leitura é rápida e sua compreensão é excelente. Continue brilhando! ✨`;
            messageClass = 'success';
            iconChar = '🎉'; // Ícone de vitória
        } else if (isGoodTime && !isGoodComprehension) {
            message = `Muito bem no tempo, ${studentName}! Sua leitura é ágil. Agora, vamos focar um pouco mais na interpretação. Revise o texto e tente entender cada detalhe. Você consegue! 💪`;
            messageClass = 'motivation';
            iconChar = '🧠'; // Ícone de inteligência/foco
        } else if (!isGoodTime && isGoodComprehension) {
            message = `Excelente interpretação, ${studentName}! Você entende muito bem o que lê. Para a próxima vez, tente focar na velocidade da leitura. Com um pouco mais de prática, você será um super leitor(a)! 🚀`;
            messageClass = 'motivation';
            iconChar = '⚡'; // Ícone de velocidade/energia
        } else {
            message = `Olá, ${studentName}! Que bom que você está praticando. Lembre-se que cada leitura é uma nova chance de aprender e melhorar. Continue se dedicando, um passo de cada vez, e você verá grandes progressos! A leitura é uma aventura, e você está no caminho certo. 📚`;
            messageClass = 'motivation';
            iconChar = '🌱'; // Ícone de crescimento/jornada
        }

        finalMotivationMessagePara.textContent = message;
        finalMotivationMessagePara.className = `final-message ${messageClass}`; // Adiciona a classe para estilização

        modalIcon.textContent = iconChar; // Define o caractere do ícone
        modalIcon.className = `modal-icon ${messageClass}-icon`; // Define a classe do ícone para estilização
    }


    function restartGame() {
        currentPhase = 0;
        readingTimes = [];
        lastComprehensionAnswers = [];
        lastComprehensionCorrectStatus = [];
        starRatingDiv.textContent = '';
        comprehensionFeedbackDiv.innerHTML = '';
        finalMotivationMessagePara.textContent = '';
        finalMotivationMessagePara.classList.add('hidden'); // Volta a esconder e remove classes de estilo
        finalMotivationMessagePara.classList.remove('success', 'motivation'); // Garante a remoção das classes
        modalIcon.textContent = ''; // Limpa o ícone
        modalIcon.className = 'modal-icon'; // Limpa as classes do ícone

        showAdminScreen(); // Volta para a tela do professor após reiniciar
    }

    // --- Funções do Modal de Feedback ---
    function showFeedbackModal(message, showRetry, showExplanation, showContinue, isComprehensionPhase = false) {
        hideAllSections(); // Garante que todas as outras seções estejam escondidas
        feedbackModal.classList.remove('hidden');

        // Garante que os elementos da mensagem final estejam escondidos
        finalMotivationMessagePara.classList.add('hidden');
        finalMotivationMessagePara.classList.remove('success', 'motivation');
        modalIcon.classList.add('hidden');
        modalIcon.textContent = ''; // Limpa o ícone

        // Mostra a mensagem de feedback padrão
        feedbackMessage.classList.remove('hidden');
        feedbackMessage.textContent = message;
        explanationText.classList.add('hidden'); // Esconde a explicação por padrão

        retryPhaseButton.classList.toggle('hidden', !showRetry);
        showExplanationButton.classList.toggle('hidden', !showExplanation);
        continueGameButton.classList.toggle('hidden', !showContinue);
        closeFinalResultsModalButton.classList.add('hidden'); // Certifica que o botão de fechar final está escondido

        // Lógica específica para a fase de interpretação
        if (isComprehensionPhase && (showRetry || showExplanation)) {
            continueGameButton.classList.add('hidden');
        }
    }

    // --- Funções para Navegação entre Seções ---
    function hideAllSections() {
        instructionsSection.classList.add('hidden');
        gameplaySection.classList.add('hidden');
        comprehensionSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        adminSection.classList.add('hidden');
        nameInputSection.classList.add('hidden');
        feedbackModal.classList.add('hidden');
    }

    function showNameInputScreen() {
        hideAllSections();
        nameInputSection.classList.remove('hidden');
    }

    function showInstructions() {
        hideAllSections();
        instructionsSection.classList.remove('hidden');
        studentNameDisplay.textContent = `Olá, ${studentName}!`;
    }

    function showAdminScreen() {
        hideAllSections();
        adminSection.classList.remove('hidden');
        loadContent(); // Carrega o conteúdo salvo ao entrar na área do professor
    }

    function showFinalMessageModal() {
        hideAllSections();
        feedbackModal.classList.remove('hidden');
        // Esconde os botões de feedback de fase
        retryPhaseButton.classList.add('hidden');
        showExplanationButton.classList.add('hidden');
        continueGameButton.classList.add('hidden');
        feedbackMessage.classList.add('hidden'); // Esconde a mensagem de feedback normal
        explanationText.classList.add('hidden'); // Esconde a explicação

        // Mostra os elementos da mensagem final
        finalMotivationMessagePara.classList.remove('hidden');
        modalIcon.classList.remove('hidden');
        closeFinalResultsModalButton.classList.remove('hidden'); // Mostra o botão para fechar o modal final
    }


    // --- Gerenciamento de Eventos ---
    submitNameButton.addEventListener('click', () => {
        studentName = studentNameInput.value.trim();
        if (studentName) {
            showInstructions();
        } else {
            alert('Por favor, digite seu nome para continuar.');
        }
    });

    startButton.addEventListener('click', () => {
        currentPhase = 0; // Inicia na primeira fase
        readingTimes = []; // Zera os tempos de leitura
        showPhase(currentPhase);
    });

    finishReadingButton.addEventListener('click', handleFinishReading);

    submitAnswersButton.addEventListener('click', calculateResults);

    restartButton.addEventListener('click', restartGame);

    goToAdminButton.addEventListener('click', showAdminScreen); // Botão para ir para o admin

    saveContentButton.addEventListener('click', saveContent);

    addQuestionButton.addEventListener('click', addQuestionField);

    startPlayForStudentButton.addEventListener('click', showInstructions); // Botão para voltar para o jogo do aluno

    // Listeners para os botões do modal de feedback
    retryPhaseButton.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
        if (gameContent.phases[currentPhase].type === 'comprehension') {
            displayComprehensionPhase(); // Reinicia a fase de compreensão
        } else {
            showPhase(currentPhase); // Reinicia a fase de leitura atual
        }
    });

    showExplanationButton.addEventListener('click', () => {
        const phase = gameContent.phases[currentPhase];
        if (phase && phase.explanation) {
            explanationText.textContent = phase.explanation;
            explanationText.classList.remove('hidden');
        }
    });

    continueGameButton.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
        currentPhase++;
        if (currentPhase < gameContent.phases.length) {
            if (gameContent.phases[currentPhase].type === 'reading') {
                showPhase(currentPhase);
            } else if (gameContent.phases[currentPhase].type === 'comprehension') {
                displayComprehensionPhase();
            }
        } else {
            showFinalResults(0); // Se não houver mais fases, mostre os resultados finais
        }
    });

    // Listener para o botão de fechar do modal final
    closeFinalResultsModalButton.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
        showResultsSection(); // Mostra a seção de resultados completa
    });

    // Listener para o botão de fechar do modal de feedback (durante o jogo)
    document.getElementById('closeFeedbackModalButton').addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
        // Dependendo de onde você está, pode querer voltar para a fase ou ir para resultados/instruções
        // Por enquanto, apenas esconde o modal. Pode ser necessário ajustar o fluxo aqui.
    });


    // Inicialização
    loadContent(); // Carrega o conteúdo ao iniciar a página
    showNameInputScreen(); // Inicia na tela de entrada do nome
});


// Funções auxiliares para mostrar/esconder seções
// (Mantenha as que você já tinha ou adicione estas)
function showResultsSection() {
    document.getElementById('results').classList.remove('hidden');
}



