let botao = document.querySelector('.botao-gerar');
let chave = "Sua chave aqui"; // Substitua pela sua chave de API Groq. Gere a mesma em: https://console.groq.com/keys
let endereco = "https://api.groq.com/openai/v1/chat/completions";

async function gerarCodigo() {
    let textoUsuario = document.querySelector('.caixa-texto').value;
    let blocoCodigo = document.querySelector('.bloco-codigo');
    let resultadoCodigo = document.querySelector('.resultado-codigo');

    if (!textoUsuario.trim()) {
        alert('Digite uma descrição para gerar o código!');
        return;
    }

    try {
        let resposta = await fetch(endereco, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${chave}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Você é um gerador de código HTML e CSS. Responda APENAS com código puro HTML+CSS. NUNCA use crases (`), markdown ou explicações. Formato EXATO: <style>...</style><div class=\"preview\">...</div>. Siga EXATAMENTE o pedido do usuário. Animações: quicando=translateY @keyframes, girando=rotate.",
                    },
                    {
                        role: "user",
                        content: textoUsuario
                    }
                ]
            })
        });

        if (!resposta.ok) {
            let status = resposta.status;
            throw new Error(`Erro API: ${status}`);
        }

        let dados = await resposta.json();
        let resultado = dados.choices[0].message.content;

        blocoCodigo.textContent = resultado;
        resultadoCodigo.srcdoc = resultado;
    } catch (error) {
        console.error('Erro:', error);
        let erroMsg = `// 🚫 ERRO NA GERAÇÃO: ${error.message}\n\n`;
        if (error.message.includes('401')) {
            erroMsg += `// 🔑 401 UNAUTHORIZED - CHAVE INVÁLIDA!\n`;
            erroMsg += `// ✅ PASSOS para CORRIGIR:\n`;
            erroMsg += `// 1. Abra https://console.groq.com/keys\n`;
            erroMsg += `// 2. Revogue TODAS chaves antigas (segurança)\n`;
            erroMsg += `// 3. Crie NOVA chave (gsk_...)\n`;
            erroMsg += `// 4. Cole na linha 3: let chave = "gsk_sua_chave";\n`;
            erroMsg += `// 5. Salve e teste novamente\n\n`;
        } else {
            erroMsg += `// 📋 Veja console F12 para detalhes\n`;
        }
        blocoCodigo.textContent = erroMsg;
    }
}
