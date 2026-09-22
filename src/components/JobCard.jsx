import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const JobCard = ({
  title = "Pérdida de agua bajo mesada",
  description = "Pérdida importante en el flexible de agua fría bajo la bacha. Tuve que cerrar la llave de paso porque filtra directo hacia el piso. Se requiere cambio del flexible y revisión de las conexiones de desagüe de la pileta.",
}) => {
  return (
    <Card>
      {/* Estado y fecha */}
      <div className="w-[447px] h-[28px] flex items-center justify-between">
        <span className="text-body text-primary">
          Publicado: hoy
        </span>

        <Badge variant="warning">
          Pendiente
        </Badge>
      </div>

      {/* Título */}
      <h3 className="text-h1 text-primary">
        {title}
      </h3>

      {/* Descripción */}
      <p className="text-body text-primary">
        {description}
      </p>

      {/* Categorías */}
      <div className="w-[341px] h-[28px] flex items-center gap-[16px]">
        <span className="w-[107px] h-[28px] rounded-[33px] border border-primary px-[20px] inline-flex items-center justify-center text-caption text-primary">
          Plomería
        </span>

        <span className="w-[107px] h-[28px] rounded-[33px] border border-primary px-[20px] inline-flex items-center justify-center text-caption text-primary">
          Fuga de agua
        </span>

        <span className="w-[107px] h-[28px] rounded-[33px] border border-primary px-[20px] inline-flex items-center justify-center text-caption text-primary">
          Reparación
        </span>
      </div>

      {/* Información */}
      <div className="w-[431.94px] h-[29px] flex items-center">
        <span className="text-body text-primary">
          Caballito, CABA
        </span>

        <span className="text-body text-primary ml-[24px]">
          Lun. 15:00 a 18:00
        </span>

        <span className="text-body text-primary ml-[24px]">
          A convenir en la visita
        </span>
      </div>

      {/* Acciones */}
      <div className="w-[447px] flex items-center justify-between">
        <button
          type="button"
          className="w-[176px] h-[29px] text-label text-blueLight text-left"
        >
          ⚠ Reportar como inadecuado
        </button>

        <div className="flex items-center gap-[16px]">
          <Button variant="outline">
            Rechazar
          </Button>

          <Button variant="cta">
            Aceptar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;