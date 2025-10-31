async function executarCodigo() {
    const JUDGE0_URL = "http://judge.darlon.com.br";
    const source_code = document.getElementById("source_code").value;
    const stdin = document.getElementById("stdin").value;

    const encoded_source = btoa(new TextEncoder().encode(source_code).reduce((acc, byte) => acc + String.fromCharCode(byte), ""));
    const encoded_stdin = btoa(new TextEncoder().encode(stdin).reduce((acc, byte) => acc + String.fromCharCode(byte), ""));

    const payload = {
        source_code: encoded_source,
        language_id: 62,
        stdin: encoded_stdin,
        base64_encoded: true,
        wait: true
    };

    const outputElement = document.getElementById("output");
    outputElement.textContent = "Executando...";

    try {
        const response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        const stdout = result.stdout ? TextDecoder().decode(Uint8Array.from(atob(result.stdout), c => c.charCodeAt(0))) : "";
        const stderr = result.stderr ? TextDecoder().decode(Uint8Array.from(atob(result.stderr), c => c.charCodeAt(0))) : "";

        const status = result.status?.description || "Desconhecido";

        outputElement.textContent =
            `Status: ${status}\n\n` +
            `Saída padrão:\n${stdout}\n` +
            (stderr ? `\nErros:\n${stderr}` : "");
    } catch (error) {
        outputElement.textContent = "Erro na execução: " + error.message;
    }
}