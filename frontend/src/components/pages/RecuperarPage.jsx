import RecuperarPassword from "../Auth/RecuperarPassword";
import EfectoEcoOndas from "../animations/FondoRegister";

export default function RecuperarPage() {
  return (
    <>
      {/* Background animado de fondo */}
      {/* Background animado de fondo */}
      <div className="fixed inset-0 -z-10">
        <EfectoEcoOndas />
      </div>
      <div>
        <RecuperarPassword />
      </div>

    </>
  );

}
