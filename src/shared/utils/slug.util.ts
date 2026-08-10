/**
 * Convierte texto libre (ej. displayName) en un slug de URL: minusculas,
 * sin acentos, espacios/simbolos reemplazados por guiones.
 */
export function slugify(text: string): string {
    return text
        .toString()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "") // quita marcas diacriticas (acentos) tras normalizar
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

/**
 * Genera un slug unico a partir de un texto base, probando sufijos
 * -2, -3, ... hasta encontrar uno libre. `isTaken` decide, por cada
 * candidato, si ya existe (permite scoping, ej. unico por categoria).
 */
export async function generateUniqueSlug(
    baseText: string,
    isTaken: (candidate: string) => Promise<boolean>
): Promise<string> {
    const base = slugify(baseText) || "item"
    let candidate = base
    let suffix = 2

    while (await isTaken(candidate)) {
        candidate = `${base}-${suffix}`
        suffix += 1
    }

    return candidate
}
