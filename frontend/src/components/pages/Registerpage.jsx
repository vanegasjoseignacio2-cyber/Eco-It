import Navbar from "../Layout/Navbar";
import RegisterHero from "../Auth/RegisterHero";
import RegisterForm from "../Auth/RegisterForm";
import Footer from "../Layout/Footer";
import EfectoEcoOndas from "../animations/FondoRegister";

export default function RegisterPage() {
    return (
        <>
            {/* Background animado de fondo */}
            <div className="fixed inset-0 -z-10">
                <EfectoEcoOndas />
            </div>

            <Navbar/>
            <div className="max-w-7xl mx-auto mt-28 mb-20 px-4 py-8 xl:flex xl:items-start xl:gap-12">
                <div className="flex-1 mt-24 xl:pl-8 2xl:pl">
                    <RegisterHero />
                </div>
                <div className="flex-none shrink-0">
                    <RegisterForm/>
                </div>
            </div>
            
            <Footer/>
        </>
    );
}