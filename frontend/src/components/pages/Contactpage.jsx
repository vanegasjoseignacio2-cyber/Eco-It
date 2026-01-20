import Navbar from "../Layout/Navbar";
import HeaderContact from "../Contact/HeaderContact";
import ContactInfoCards from "../Contact/TarjetContact";
import Footer from "../Layout/Footer";
import ContactForm from "../Contact/ContactForm";
import ContactFAQ from "../Contact/ContactFAQ";
import SocialLinks from "../Contact/SocialLinks";
export default function Contactpage() {
    return (
        <>
            <Navbar showLogo sticky />
            <HeaderContact />
            <div className=" bg-green-100">
                <ContactInfoCards />
            </div>
            <div className=" bg-gradient-to-br from-green-100 via-emerald-100 to-teal-50 py-10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                        {/* FORM - Izquierda */}
                        <div className="w-full">
                            <ContactForm />
                        </div>

                        {/* FAQ + SOCIAL - Derecha */}
                        <div className="w-full space-y-8">
                            <ContactFAQ />
                            <SocialLinks />
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}