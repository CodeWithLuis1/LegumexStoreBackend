import { z } from "zod"

// Ambas fechas son opcionales: sin rango, el servicio trae todo el historico de cotizaciones.
// Se envian como "YYYY-MM-DD" desde el input type=date del front -- z.coerce.date() las parsea
// a medianoche UTC, y el servicio arma el filtro de createdAt a partir de ahi (endDate se
// extiende hasta el final del dia, ver dashboard.service.ts).
export const dashboardSummaryQuerySchema = z
    .object({
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
    })
    .refine((data) => !data.startDate || !data.endDate || data.startDate <= data.endDate, {
        message: "startDate debe ser menor o igual a endDate",
        path: ["endDate"],
    })

export type DashboardSummaryQuery = z.infer<typeof dashboardSummaryQuerySchema>
