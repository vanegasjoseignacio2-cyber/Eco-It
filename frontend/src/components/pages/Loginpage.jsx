import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import LoginHero from "../Auth/LoginHero";
import LoginForm from "../Auth/LoginForm";

export default function Login() {
    return (
        <div className="min-h-screen flex flex-col nature-bg">
            <Navbar />

            <main className="bg-gradient-to-br from-emerald-100 to-green-100 flex-1 flex items-center justify-center px-4 pt-24 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 max-w-7xl w-full">
                    <div className="lg:col-span-2">
                        <LoginHero />
                    </div>
                    <div className="lg:col-span-2">
                        <LoginForm />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}