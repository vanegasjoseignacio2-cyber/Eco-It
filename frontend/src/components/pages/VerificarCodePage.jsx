import VerifyCode from "../Auth/VerificarCode";
import EfectoEcoOndas from "../animations/FondoRegister";

export default function VerificarCodePage() {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <EfectoEcoOndas />
      </div>
      <div>
        <VerifyCode />
      </div>
    </>
  );
}
