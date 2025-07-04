async function requestAnimation() {
  const inputElement = document.getElementById("input");
  const resultCss = document.getElementById("result-css");
  const resultDiv = document.getElementById("result");

  if (!inputElement || !resultCss || !resultDiv) {
    console.error("Algum dos elementos necessários não foi encontrado.");
    return;
  }

  const questInput = inputElement.value;

  // ⏳ Mostra loading animado
  resultCss.innerHTML = `
    <div class="flex items-center justify-center h-full animate-pulse">
      <svg class="w-6 h-6 text-white animate-spin mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span class="text-white">Carregando animação...</span>
    </div>
  `;

  // Também limpa resultado visual anterior
  resultDiv.innerHTML = `<span class="text-gray-400">Aguardando resposta da mágica...</span>`;

  try {
    const result = await fetch(WEBHOOK_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quest: questInput })
    });

    const responder = await result.json();
    console.log("Resposta direta:", responder);

    if (responder.output) {
      const jsonString = responder.output.trim();

      try {
        const info = JSON.parse(jsonString);

        console.log("🔧 info:", info);

        resultDiv.innerHTML = `
          ${info.preview}
          <style>${info.style}</style>
        `;
        resultCss.innerHTML = `${info.code}`;

      } catch (e) {
        console.error("Erro ao fazer JSON.parse no output:", e);
        resultDiv.innerText = "Erro ao interpretar resposta JSON.";
        resultCss.innerText = "// Erro ao interpretar resposta.";
      }

    } else {
      console.warn("Campo 'output' ausente na resposta.");
      resultDiv.innerText = "Nenhum conteúdo retornado.";
      resultCss.innerText = "// Nenhum código retornado.";
    }

  } catch (error) {
    console.error("Erro na requisição:", error);
    resultDiv.innerText = "Erro ao enviar requisição.";
    resultCss.innerText = "// Erro na requisição.";
  }
}
