import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Only initialize AI if key exists to prevent immediate crash, otherwise handle in functions
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MENTOR_SYSTEM_INSTRUCTION = `
Você é um amigo cristão leal e sábio.
NÃO use linguagem excessivamente feminina ou masculina ("amiga" ou "campeão"), use termos neutros ou o nome da pessoa.
Responda com profundidade bíblica mas simplicidade.
Seu objetivo é caminhar junto, ouvir e aconselhar.
`;

// --- FALLBACK DATA (OFFLINE MODE) ---
const FALLBACK_DEVOTIONAL = {
  title: "A Paz que Excede o Entendimento",
  verse: "Filipenses 4:7",
  importance: "Em um mundo cheio de ansiedade e ruído, a paz de Deus não é apenas um sentimento, é uma guarda poderosa para a nossa mente.",
  content: "Muitas vezes, procuramos a paz quando as circunstâncias estão calmas, mas a Bíblia nos apresenta uma paz diferente: uma paz que funciona no meio da tempestade.\n\nQuando Paulo escreveu aos Filipenses, ele não estava em um palácio, mas preso. Ainda assim, ele falava de alegria e paz. Isso nos ensina que a paz de Deus não é a ausência de problemas, mas a presença de Cristo em meio a eles.\n\nEssa paz 'guarda' nossos corações como uma sentinela. Ela impede que o medo e a ansiedade tomem conta do nosso ser. Hoje, não peça apenas para que Deus mude as situações, peça para que a Paz dEle inunde seu interior, mudando como você vê a situação.",
  prayer: "Senhor, eu recebo a Tua paz hoje. Guarda minha mente e meu coração, pois confio que Tu estás no controle de tudo."
};

const FALLBACK_RESTORATION = {
  days: [
    { day: 1, title: "Reconhecendo o Lugar", content: "O primeiro passo para a cura é saber onde dói. Deus quer tratar a raiz.", task: "Escreva em um papel uma coisa que tem tirado sua paz e ore entregando-a.", completed: false },
    { day: 2, title: "O Poder do Perdão", content: "A falta de perdão é como beber veneno esperando que o outro morra.", task: "Ore abençoando alguém que te feriu no passado.", completed: false },
    { day: 3, title: "Identidade Restaurada", content: "Você não é o que dizem, você é quem Deus diz que é: Amado e Escolhido.", task: "Olhe no espelho e diga: 'Eu sou filho(a) amado(a) de Deus'.", completed: false },
    { day: 4, title: "Silenciando a Mente", content: "A ansiedade grita, mas o Espírito Santo sussurra. Precisamos parar para ouvir.", task: "Fique 5 minutos em total silêncio apenas ouvindo sua respiração.", completed: false },
    { day: 5, title: "Gratidão como Arma", content: "A gratidão muda a frequência do nosso coração da falta para a abundância.", task: "Liste 3 coisas simples pelas quais você é grato hoje.", completed: false },
    { day: 6, title: "Servindo ao Próximo", content: "Às vezes, a cura vem quando tiramos o foco de nós mesmos e abençoamos outros.", task: "Envie uma mensagem de encorajamento para um amigo.", completed: false },
    { day: 7, title: "Novo Começo", content: "As misericórdias do Senhor se renovam hoje. O passado ficou para trás.", task: "Faça uma oração consagrando sua próxima semana a Deus.", completed: false }
  ]
};

export const getSpiritualMentorResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  if (!ai) {
    return "Estou operando em modo offline no momento. Lembre-se: Deus está com você agora mesmo. O que te aflige? Tente orar ou ler um Salmo, Ele te ouvirá.";
  }
  try {
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: MENTOR_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      })),
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Erro no Mentor Espiritual:", error);
    return "Minha conexão falhou momentaneamente, mas Deus está aqui. Respire fundo e tente novamente em alguns instantes.";
  }
};

export const explainBibleVerse = async (verse: string) => {
  if (!ai) {
    return {
      explanation: "No momento não consigo acessar a base de dados teológica online.",
      context: "Verifique sua conexão ou a configuração da chave API.",
      application: "Enquanto isso, ore pedindo ao Espírito Santo que ilumine este texto ao seu coração.",
      related: "Salmos 119:105"
    };
  }
  try {
    const prompt = `
    Explique o seguinte versículo bíblico: "${verse}".
    
    A resposta deve seguir estritamente este formato JSON:
    {
      "explanation": "Uma explicação teológica clara e acessível (máx 3 frases)",
      "context": "Contexto histórico breve (quem escreveu, para quem, época)",
      "application": "Como aplicar isso na vida prática hoje",
      "related": "Uma referência de outro versículo que complementa este"
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    return {
      explanation: "Não foi possível analisar este versículo agora.",
      context: "Tente novamente mais tarde.",
      application: "Medite na palavra e confie na direção de Deus.",
      related: ""
    };
  }
};

export const generateJournalReflection = async (entry: string) => {
  if (!ai) return "Que bom que você registrou isso. Deus está vendo seu coração.";
  try {
    const prompt = `
    O usuário escreveu no diário: "${entry}".
    Aja como um amigo cristão maduro.
    Gere uma resposta curta (1-2 frases) encorajadora, sem usar gênero (amigo/amiga). Use tom sábio e acolhedor.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "";
  }
};

export const generateDailyDevotional = async (themes: string[]) => {
  if (!ai) return FALLBACK_DEVOTIONAL;
  try {
    const themeStr = themes.join(", ");
    const prompt = `
    Crie um devocional PROFUNDO e COMPLETO sobre um destes temas: ${themeStr}.
    
    O conteúdo deve ser substancial (cerca de 300 palavras), não apenas um resumo.
    
    Formato JSON estrito:
    {
      "title": "Um título cativante",
      "verse": "O versículo chave (texto e referência)",
      "importance": "Explique POR QUE este tema é vital para a vida espiritual (1 parágrafo)",
      "content": "A reflexão profunda. Divida em 3 parágrafos claros. Use linguagem inspiradora, teológica mas acessível.",
      "prayer": "Uma oração em primeira pessoa"
    }
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    const parsed = JSON.parse(response.text || '{}');
    // Basic validation to ensure content isn't empty/broken
    if (!parsed.content || parsed.content.length < 50) return FALLBACK_DEVOTIONAL;
    return parsed;
  } catch (error) {
    return FALLBACK_DEVOTIONAL;
  }
};

export const generateRestorationPlan = async (areas: string[]) => {
  if (!ai) return FALLBACK_RESTORATION;
  try {
    const areaStr = areas.join(", ");
    const prompt = `
    Crie um plano de restauração espiritual de 7 dias focado em: ${areaStr}.
    Para cada dia, forneça um título, um conteúdo breve de leitura e uma tarefa prática MUITO SIMPLES e rápida (máx 5 minutos).
    
    Responda APENAS com este JSON:
    {
      "days": [
        {
          "day": 1,
          "title": "Título do Dia 1",
          "content": "Texto de reflexão do dia (2 frases)",
          "task": "Tarefa prática extremamente simples e rápida (ex: orar o salmo 23, ligar para alguém)"
        },
        ... (até dia 7)
      ]
    }
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return FALLBACK_RESTORATION;
  }
};
