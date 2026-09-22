/**
 * Registra eventos de analítica de UrbanFix.
 *
 * Eventos definidos en el Data Plan:
 * - user_registered
 * - job_created
 * - review_submitted
 */
export const trackEvent = (event, data = {}) => {
  console.log("[Analytics]", {
    event,
    data,
    timestamp: new Date().toISOString(),
  });
};
/**
 * Evento: usuario registrado
 *
 * @param {string} role - "client" o "technician"
 * @param {string|null} category - Categoría/oficio del técnico
 */
export const trackUserRegistered = (role, category = null) => {
  trackEvent("user_registered", {
    role,
    ...(role === "technician" && { category }),
  });
};
/**
 * Evento: publicación creada
 *
 * @param {string|null} category - Categoría seleccionada por el cliente
 * @param {object} jobData - Datos de la publicación
 */
export const trackJobCreated = (category = null, jobData = {}) => {
  trackEvent("job_created", {
    category,
    ...jobData,
  });
};
/**
 * Evento: trabajo calificado
 *
 * @param {number} rating - Calificación del 1 al 5
 * @param {number|string} jobId - ID del trabajo
 */
export const trackReviewSubmitted = (rating, jobId) => {
  trackEvent("review_submitted", {
    rating,
    job_id: jobId,
  });
};