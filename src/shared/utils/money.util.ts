import Decimal from "decimal.js"

// Punto único de conversión/redondeo para todo cálculo monetario del cotizador (ver
// quoteService). Antes de esto, quote.service.ts casteaba DECIMAL de Postgres directo a
// `number` y operaba con floats nativos (IEEE 754) sin ningún redondeo explícito -- el error
// de representación de floats se acumulaba silenciosamente a través de multiplicaciones y
// divisiones encadenadas (% -> gramos -> conversión de unidad -> costo), y lo único que
// "ocultaba" el ruido era el formateo a 2 decimales en el front (Intl.NumberFormat). El
// breakdown JSONB guardaba esos floats crudos sin redondear mientras que las columnas
// DECIMAL(12,2) de Quote sí las redondeaba Postgres al insertar -- dos motores de redondeo
// distintos para el mismo dato, sin política única. decimal.js hace la aritmética exacta en
// base 10 (sin el problema de 0.1 + 0.2 !== 0.3) y roundMoney() es el ÚNICO lugar donde se
// decide a cuántos decimales se corta un monto.

// Precisión con la que Postgres declara los montos en DECIMAL(12,2) (ver Quote.model.ts) --
// centavos. Si algún día se cotiza en una moneda sin centavos, este es el único número a tocar.
const MONEY_DECIMALS = 2

export function toDecimal(value: number | string | null | undefined): Decimal {
    if (value === null || value === undefined) return new Decimal(0)
    return new Decimal(value)
}

// Redondea a la precisión monetaria (2 decimales) con la misma regla que usa Postgres para
// NUMERIC (half-away-from-zero), así el valor que se guarda en las columnas DECIMAL(12,2) y el
// que queda congelado en el breakdown JSONB son siempre el mismo número -- no dos redondeos
// independientes que puedan desalinearse por un centavo.
export function roundMoney(value: Decimal): number {
    return value.toDecimalPlaces(MONEY_DECIMALS, Decimal.ROUND_HALF_UP).toNumber()
}

// Suma línea a línea en Decimal (no con Array.prototype.reduce + `+` nativo) y redondea el
// resultado una sola vez al final -- evita que el subtotal difiera del redondeo individual de
// cada línea ya redondeada que se muestra en el breakdown.
export function sumMoney(values: number[]): number {
    return roundMoney(values.reduce((sum, value) => sum.plus(value), new Decimal(0)))
}
