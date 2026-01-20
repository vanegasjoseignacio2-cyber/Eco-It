import { botResponses } from "../Data/botResponses";

export function getResponse(message, hasImage) {
    if (hasImage) return botResponses.imagen;

    const lower = message.toLowerCase();

    if (lower.includes("plástico") || lower.includes("plastico")) return botResponses.plastico;
    if (lower.includes("contenedor") || lower.includes("material")) return botResponses.contenedor;
    if (lower.includes("carbono") || lower.includes("huella")) return botResponses.carbono;
    if (lower.includes("electrónico") || lower.includes("electronico")) return botResponses.electronico;

    return botResponses.default;
}
